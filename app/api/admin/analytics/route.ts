import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch all quiz responses
    const { data: responses, error } = await db.getAllQuizResponses();

    if (error) {
      console.error('Error fetching responses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses found' },
        { status: 404 }
      );
    }

    // Calculate responses by quiz
    const responsesByQuiz = responses.reduce((acc: any, response: any) => {
      const quizId = response.quiz_id;
      if (!acc[quizId]) {
        acc[quizId] = {
          quizId,
          total: 0,
          completed: 0,
          inProgress: 0,
        };
      }
      acc[quizId].total++;
      if (response.progress === 100) {
        acc[quizId].completed++;
      } else if (response.progress > 0) {
        acc[quizId].inProgress++;
      }
      return acc;
    }, {});

    // Calculate responses by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const responsesByDay = responses
      .filter((r: any) => new Date(r.created_at) >= thirtyDaysAgo)
      .reduce((acc: any, response: any) => {
        const date = new Date(response.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});

    // Convert to array and sort by date
    const responsesByDayArray = Object.entries(responsesByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate completion rate
    const totalResponses = responses.length;
    const completedResponses = responses.filter((r: any) => r.progress === 100).length;
    const completionRate =
      totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

    return NextResponse.json(
      {
        responsesByQuiz: Object.values(responsesByQuiz),
        responsesByDay: responsesByDayArray,
        completionRate,
        totalResponses,
        completedResponses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
