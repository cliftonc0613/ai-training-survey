import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';
import { validateResumeToken } from '@/lib/utils/resume-token';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validate token format
    if (!validateResumeToken(token)) {
      return NextResponse.json(
        { error: 'Invalid resume token format' },
        { status: 400 }
      );
    }

    // Get user by resume token
    const { data: user, error: userError } = await db.getUserByResumeToken(token);

    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user', details: userError.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this resume token' },
        { status: 404 }
      );
    }

    // Type assertion after null check
    const userRecord = user as any;

    // Get user's quiz responses
    const { data: quizResponses, error: responsesError } = await db.getQuizResponsesByUser(
      userRecord.id
    );

    if (responsesError) {
      console.error('Error fetching quiz responses:', responsesError);
      return NextResponse.json(
        { error: 'Failed to fetch saved progress', details: responsesError.message },
        { status: 500 }
      );
    }

    if (!quizResponses) {
      return NextResponse.json(
        { error: 'No quiz responses found' },
        { status: 404 }
      );
    }

    // Format user data
    const userData = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      resumeToken: userRecord.resume_token,
      createdAt: userRecord.created_at,
      updatedAt: userRecord.updated_at,
    };

    // Format quiz responses
    const savedProgress = quizResponses.map((response: any) => ({
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
