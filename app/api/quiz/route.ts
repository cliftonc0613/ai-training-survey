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

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to create quiz response' },
        { status: 500 }
      );
    }

    // Type assertion after null check
    const quizResponse = data as any;

    // Return success response
    return NextResponse.json(
      {
        quizResponse: {
          id: quizResponse.id,
          quizId: quizResponse.quiz_id,
          userId: quizResponse.user_id,
          responses: quizResponse.responses,
          startedAt: quizResponse.started_at,
          completedAt: quizResponse.completed_at,
          progress: quizResponse.progress,
          synced: quizResponse.synced,
          createdAt: quizResponse.created_at,
          updatedAt: quizResponse.updated_at,
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

    // If userId is provided, return user's quiz responses
    if (userId) {
      // Get all quiz responses for user
      const { data, error } = await db.getQuizResponsesByUser(userId);

      if (error) {
        console.error('Error fetching quiz responses:', error);
        return NextResponse.json(
          { error: 'Failed to fetch quiz responses', details: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'No quiz responses found' },
          { status: 404 }
        );
      }

      // Format responses
      const quizResponses = data.map((response: any) => ({
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
    }

    // Otherwise, return list of available quizzes
    const quizzes = [
      {
        id: 'survey-30days',
        title: '30-Day Follow-Up Survey',
        description: 'Track your progress 30 days after course completion',
        estimatedTime: '8 minutes',
        questionCount: 17,
      },
      {
        id: 'survey-90days',
        title: '90-Day Progress Check-In',
        description: 'Assess your career progress and job search status',
        estimatedTime: '12 minutes',
        questionCount: 29,
      },
      {
        id: 'survey-180days',
        title: '6-Month Impact Assessment',
        description: 'Measure long-term career progression and skill application',
        estimatedTime: '15 minutes',
        questionCount: 16,
      },
      {
        id: 'survey-12months-final',
        title: '12-Month Final Assessment',
        description: 'Comprehensive evaluation of your career transformation',
        estimatedTime: '10 minutes',
        questionCount: 21,
      },
    ];

    return NextResponse.json(
      {
        quizzes,
        count: quizzes.length,
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

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to update quiz response' },
        { status: 500 }
      );
    }

    // Type assertion after null check
    const updatedResponse = data as any;

    // Return updated response
    return NextResponse.json(
      {
        quizResponse: {
          id: updatedResponse.id,
          quizId: updatedResponse.quiz_id,
          userId: updatedResponse.user_id,
          responses: updatedResponse.responses,
          startedAt: updatedResponse.started_at,
          completedAt: updatedResponse.completed_at,
          progress: updatedResponse.progress,
          synced: updatedResponse.synced,
          createdAt: updatedResponse.created_at,
          updatedAt: updatedResponse.updated_at,
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
