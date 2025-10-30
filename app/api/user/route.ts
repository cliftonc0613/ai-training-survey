import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';
import { validateUserRegistration } from '@/lib/utils/validation';
import { generateResumeToken } from '@/lib/utils/resume-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Validate input
    const validation = validateUserRegistration({ name, email, phone });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate resume token
    const resumeToken = generateResumeToken();
    const now = new Date().toISOString();

    // Create user in database
    const { data, error } = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      resume_token: resumeToken,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Type assertion after null check
    const userData = data as any;

    // Return user data with resume token
    return NextResponse.json(
      {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          resumeToken: userData.resume_token,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeToken = searchParams.get('resumeToken');

    if (!resumeToken) {
      return NextResponse.json(
        { error: 'Resume token is required' },
        { status: 400 }
      );
    }

    // Get user by resume token
    const { data, error } = await db.getUserByResumeToken(resumeToken);

    if (error) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Type assertion after null check
    const userData = data as any;

    // Return user data
    return NextResponse.json(
      {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          resumeToken: userData.resume_token,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
