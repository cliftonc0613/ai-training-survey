import { NextRequest, NextResponse } from 'next/server';
import { generateResumeToken, validateResumeToken } from '@/lib/utils/resume-token';

export async function POST(_request: NextRequest) {
  try {
    // Generate a new resume token
    const resumeToken = generateResumeToken();

    return NextResponse.json(
      {
        resumeToken,
        message: 'Resume token generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    // Validate the resume token
    const isValid = validateResumeToken(token);

    return NextResponse.json(
      {
        token,
        isValid,
        message: isValid ? 'Token is valid' : 'Token is invalid',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
