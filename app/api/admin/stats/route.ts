import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch all quiz responses
    const { data: responses, error: responsesError } = await db.getAllQuizResponses();

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        {
          totalResponses: 0,
          totalUsers: 0,
          completedResponses: 0,
          inProgressResponses: 0,
          completionRate: 0,
        },
        { status: 200 }
      );
    }

    // Fetch all users
    const { data: users, error: usersError } = await db.getAllUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          totalResponses: responses.length,
          totalUsers: 0,
          completedResponses: responses.filter((r: any) => r.progress === 100).length,
          inProgressResponses: responses.filter((r: any) => r.progress > 0 && r.progress < 100)
            .length,
          completionRate:
            responses.length > 0
              ? (responses.filter((r: any) => r.progress === 100).length / responses.length) * 100
              : 0,
        },
        { status: 200 }
      );
    }

    // Calculate stats
    const totalResponses = responses.length;
    const totalUsers = users.length;
    const completedResponses = responses.filter((r: any) => r.progress === 100).length;
    const inProgressResponses = responses.filter(
      (r: any) => r.progress > 0 && r.progress < 100
    ).length;
    const completionRate =
      totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

    return NextResponse.json(
      {
        totalResponses,
        totalUsers,
        completedResponses,
        inProgressResponses,
        completionRate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
