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

    // Fetch all users
    const { data: users, error: usersError } = await db.getAllUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Calculate stats
    const totalResponses = responses.length;
    const totalUsers = users.length;
    const completedResponses = responses.filter((r) => r.progress === 100).length;
    const inProgressResponses = responses.filter(
      (r) => r.progress > 0 && r.progress < 100
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
