import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';
import type { QuizResponse, User, Quiz } from '@/lib/types/database';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the quiz response
    const { data: response, error: responseError } = await db.getQuizResponse(id) as { data: QuizResponse | null; error: any };

    if (responseError || !response) {
      console.error('Error fetching quiz response:', responseError);
      return NextResponse.json(
        { error: 'Quiz response not found' },
        { status: 404 }
      );
    }

    // Fetch the associated user
    const { data: user, error: userError } = await db.getUser(response.user_id) as { data: User | null; error: any };

    if (userError) {
      console.error('Error fetching user:', userError);
    }

    // Fetch the associated quiz
    const { data: quiz, error: quizError } = await db.getQuiz(response.quiz_id) as { data: Quiz | null; error: any };

    if (quizError) {
      console.error('Error fetching quiz:', quizError);
    }

    // Format the response
    const formattedResponse = {
      id: response.id,
      quizId: response.quiz_id,
      userId: response.user_id,
      progress: response.progress,
      responses: response.responses || [],
      startedAt: response.started_at,
      completedAt: response.completed_at,
      user: user
        ? {
            name: user.name,
            email: user.email,
          }
        : undefined,
      quiz: quiz
        ? {
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions || [],
          }
        : undefined,
    };

    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/responses/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
