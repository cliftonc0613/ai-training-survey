import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';

// Mock quiz data for development (until database is seeded)
const MOCK_QUIZZES: Record<string, any> = {
  'survey-30days': {
    id: 'survey-30days',
    title: '30-Day Follow-Up Survey',
    description: 'Track your progress 30 days after course completion',
    estimated_time: 8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'How would you rate your overall course experience?',
        options: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true,
      },
      // Add more questions as needed
    ],
  },
  'survey-90days': {
    id: 'survey-90days',
    title: '90-Day Progress Check-In',
    description: 'Assess your career progress and job search status',
    estimated_time: 12,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is your current employment status?',
        options: ['Employed', 'Actively Job Searching', 'Not Currently Seeking', 'Other'],
        required: true,
      },
    ],
  },
  'survey-180days': {
    id: 'survey-180days',
    title: '6-Month Impact Assessment',
    description: 'Measure long-term career progression and skill application',
    estimated_time: 15,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How confident are you in your new skills?',
        min: 1,
        max: 5,
        required: true,
      },
    ],
  },
  'survey-12months-final': {
    id: 'survey-12months-final',
    title: '12-Month Final Assessment',
    description: 'Comprehensive evaluation of your career transformation',
    estimated_time: 10,
    questions: [
      {
        id: 'q1',
        type: 'text-long',
        question: 'Describe your career transformation over the past year',
        required: true,
      },
    ],
  },
};

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

    // Check if mock quiz exists first (for development)
    const mockQuiz = MOCK_QUIZZES[id];
    if (mockQuiz) {
      return NextResponse.json(
        { quiz: mockQuiz },
        { status: 200 }
      );
    }

    // Try to get quiz from database (for production with real UUIDs)
    const { data, error } = await db.getQuiz(id);

    // If quiz exists in database, use it
    if (data && !error) {
      const quizData = data as any;
      const quiz = {
        id: quizData.id,
        title: quizData.title,
        description: quizData.description,
        questions: quizData.questions,
        estimatedTime: quizData.estimated_time,
        createdAt: quizData.created_at,
        updatedAt: quizData.updated_at,
      };

      return NextResponse.json({ quiz }, { status: 200 });
    }

    // Not found in either mock data or database
    return NextResponse.json(
      { error: 'Quiz not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/quiz/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
