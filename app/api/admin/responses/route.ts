import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Build query
    let query = supabase
      .from('quiz_responses')
      .select(
        `
        *,
        users (
          id,
          name,
          email,
          phone,
          created_at
        ),
        quizzes (
          id,
          title,
          description
        )
      `
      )
      .order('created_at', { ascending: false });

    // Filter by quiz ID if provided
    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    // Add pagination if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching quiz responses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch responses', details: error.message },
        { status: 500 }
      );
    }

    // Format responses
    const responses = data.map((response: any) => ({
      id: response.id,
      quizId: response.quiz_id,
      userId: response.user_id,
      responses: response.responses,
      startedAt: response.started_at,
      completedAt: response.completed_at,
      progress: response.progress,
      synced: response.synced,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      user: response.users
        ? {
            id: response.users.id,
            name: response.users.name,
            email: response.users.email,
            phone: response.users.phone,
            createdAt: response.users.created_at,
          }
        : null,
      quiz: response.quizzes
        ? {
            id: response.quizzes.id,
            title: response.quizzes.title,
            description: response.quizzes.description,
          }
        : null,
    }));

    return NextResponse.json(
      {
        responses,
        total: count || responses.length,
        count: responses.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
