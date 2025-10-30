#!/usr/bin/env tsx
/**
 * Database Seeding Script
 *
 * Seeds the Supabase database with quiz definitions from the mock data.
 *
 * Prerequisites:
 * - Migrations must be run first (users, quizzes, quiz_responses tables must exist)
 * - .env.local must have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Usage:
 *   npm run seed
 *   # or
 *   npx tsx scripts/seed-database.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import quiz data directly from the API route mock
// We'll just copy the structure here to avoid import issues
const QUIZ_DATA = {
  'survey-30days': {
    title: '30-Day Follow-Up Survey',
    description: 'Track your progress 30 days after course completion',
    estimated_time: 8,
    questionCount: 17,
  },
  'survey-90days': {
    title: '90-Day Progress Check-In',
    description: 'Assess your career progress and job search status',
    estimated_time: 12,
    questionCount: 29,
  },
  'survey-180days': {
    title: '6-Month Impact Assessment',
    description: 'Measure long-term career progression and skill application',
    estimated_time: 15,
    questionCount: 16,
  },
  'survey-12months-final': {
    title: '12-Month Final Assessment',
    description: 'Comprehensive evaluation of your career transformation',
    estimated_time: 10,
    questionCount: 21,
  },
};

async function seedDatabase() {
  console.log('\n🌱 AI Training Survey - Database Seeding\n');
  console.log('═'.repeat(50));

  try {
    // Test connection
    console.log('\n📡 Testing Supabase connection...');
    const { error: connectionError } = await supabase.from('quizzes').select('id').limit(1);

    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }

    console.log('✅ Connected to Supabase successfully\n');

    // Fetch quiz definitions from the API (which has the full mock data)
    console.log('📥 Fetching quiz definitions from API...');
    const quizIds = Object.keys(QUIZ_DATA);
    const quizzes = [];

    for (const quizId of quizIds) {
      try {
        const response = await fetch(`http://localhost:3000/api/quiz/${quizId}`);
        if (response.ok) {
          const data = await response.json();
          quizzes.push({ id: quizId, ...data.quiz });
          console.log(`  ✓ Loaded: ${data.quiz.title} (${data.quiz.questions.length} questions)`);
        } else {
          console.log(`  ⚠ API returned ${response.status} for ${quizId}`);
        }
      } catch (err) {
        console.log(`  ⚠ Failed to fetch ${quizId}:`, err.message);
      }
    }

    if (quizzes.length === 0) {
      throw new Error('No quiz data loaded from API. Is the dev server running?');
    }

    console.log(`\n📊 Loaded ${quizzes.length} quizzes from API\n`);

    // Insert quizzes into database
    console.log('💾 Inserting quizzes into Supabase...\n');

    for (const quiz of quizzes) {
      const { data, error } = await supabase
        .from('quizzes')
        .upsert({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          estimated_time: quiz.estimated_time || quiz.estimatedTime,
        }, {
          onConflict: 'id'
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting ${quiz.title}:`, error.message);
        throw error;
      }

      console.log(`✅ ${quiz.title}`);
      console.log(`   ID: ${quiz.id}`);
      console.log(`   Questions: ${quiz.questions.length}`);
      console.log(`   Time: ~${quiz.estimated_time || quiz.estimatedTime} minutes\n`);
    }

    // Verify seeding
    console.log('═'.repeat(50));
    console.log('\n🔍 Verifying database...\n');

    const { data: allQuizzes, error: verifyError } = await supabase
      .from('quizzes')
      .select('id, title, estimated_time')
      .order('created_at', { ascending: true });

    if (verifyError) {
      throw verifyError;
    }

    console.log(`📋 Total quizzes in database: ${allQuizzes?.length || 0}\n`);
    allQuizzes?.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.title} (~${q.estimated_time} min)`);
    });

    console.log('\n═'.repeat(50));
    console.log('\n✨ Database seeding completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
