import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, userId, responses, progress, completedAt } = body;

    // Validate required fields
    if (!quizId || !userId || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields: quizId, userId, responses' },
        { status: 400 }
      );
    }

    // Validate responses is an array
    if (!Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Responses must be an array' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const isComplete = progress === 100 || !!completedAt;

    // Create quiz response in database
    const { data, error } = await db.createQuizResponse({
      quiz_id: quizId,
      user_id: userId,
      responses: responses,
      started_at: now,
      completed_at: isComplete ? (completedAt || now) : null,
      progress: progress || 0,
      synced: true,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      console.error('Error creating quiz response:', error);
      return NextResponse.json(
        { error: 'Failed to submit quiz', details: error.message },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        quizResponse: {
          id: data.id,
          quizId: data.quiz_id,
          userId: data.user_id,
          responses: data.responses,
          startedAt: data.started_at,
          completedAt: data.completed_at,
          progress: data.progress,
          synced: data.synced,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        message: isComplete ? 'Quiz submitted successfully' : 'Progress saved',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get all quiz responses for user
    const { data, error } = await db.getQuizResponsesByUser(userId);

    if (error) {
      console.error('Error fetching quiz responses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quiz responses', details: error.message },
        { status: 500 }
      );
    }

    // Format responses
    const quizResponses = data.map((response) => ({
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
    }));

    return NextResponse.json(
      {
        quizResponses,
        count: quizResponses.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, responses, progress, completedAt } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const isComplete = progress === 100 || !!completedAt;

    // Update quiz response
    const { data, error } = await db.updateQuizResponse(id, {
      responses: responses,
      completed_at: isComplete ? (completedAt || now) : null,
      progress: progress,
      synced: true,
      updated_at: now,
    });

    if (error) {
      console.error('Error updating quiz response:', error);
      return NextResponse.json(
        { error: 'Failed to update quiz response', details: error.message },
        { status: 500 }
      );
    }

    // Return updated response
    return NextResponse.json(
      {
        quizResponse: {
          id: data.id,
          quizId: data.quiz_id,
          userId: data.user_id,
          responses: data.responses,
          startedAt: data.started_at,
          completedAt: data.completed_at,
          progress: data.progress,
          synced: data.synced,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        message: isComplete ? 'Quiz updated and completed' : 'Progress updated',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in PUT /api/quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
