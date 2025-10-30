import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Type assertion after null check
    const quizData = data as any;

    // Format quiz response
    const quiz = {
      id: quizData.id,
      title: quizData.title,
      description: quizData.description,
      questions: quizData.questions,
      estimatedTime: quizData.estimated_time,
      createdAt: quizData.created_at,
      updatedAt: quizData.updated_at,
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
