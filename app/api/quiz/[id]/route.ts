import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    // Get quiz from database
    const { data, error } = await db.getQuiz(id);

    if (error) {
      console.error('Error fetching quiz:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quiz', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Format quiz response
    const quiz = {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: data.questions,
      estimatedTime: data.estimated_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(
      { quiz },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/quiz/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
