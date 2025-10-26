import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';
import { validateResumeToken } from '@/lib/utils/resume-token';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Validate token format
    if (!validateResumeToken(token)) {
      return NextResponse.json(
        { error: 'Invalid resume token format' },
        { status: 400 }
      );
    }

    // Get user by resume token
    const { data: user, error: userError } = await db.getUserByResumeToken(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'No user found with this resume token' },
        { status: 404 }
      );
    }

    // Get user's quiz responses
    const { data: quizResponses, error: responsesError } = await db.getQuizResponsesByUser(
      user.id
    );

    if (responsesError) {
      console.error('Error fetching quiz responses:', responsesError);
      return NextResponse.json(
        { error: 'Failed to fetch saved progress', details: responsesError.message },
        { status: 500 }
      );
    }

    // Format user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      resumeToken: user.resume_token,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    // Format quiz responses
    const savedProgress = quizResponses.map((response) => ({
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

    // Find in-progress quiz (not completed)
    const inProgressQuiz = savedProgress.find((qr) => !qr.completedAt);

    return NextResponse.json(
      {
        user: userData,
        savedProgress,
        inProgressQuiz: inProgressQuiz || null,
        completedQuizzes: savedProgress.filter((qr) => qr.completedAt),
        totalQuizzes: savedProgress.length,
        message: 'Saved progress loaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/resume/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
