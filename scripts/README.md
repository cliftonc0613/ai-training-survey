# Database Seeding Scripts

## Overview

This directory contains scripts for populating the Supabase database with initial data.

## Prerequisites

1. **Supabase Project Setup**:
   - Create a Supabase project
   - Run all migrations from `supabase/migrations/` in order:
     - `001_create_users_table.sql`
     - `002_create_quiz_responses_table.sql`
     - `003_enable_rls.sql`

2. **Environment Variables**:
   - Ensure `.env.local` exists with:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Dev Server Running**:
   - The seeding script fetches quiz data from the local API
   - Run `npm run dev` in another terminal before seeding

## Seeding the Database

### Seed All Quizzes

```bash
npm run seed
```

This will:
1. Connect to your Supabase database
2. Fetch all 4 survey definitions from the local API (`/api/quiz/[id]`)
3. Insert or update quizzes in the `quizzes` table
4. Verify the seeding was successful

### Expected Output

```
🌱 AI Training Survey - Database Seeding

══════════════════════════════════════════════════

📡 Testing Supabase connection...
✅ Connected to Supabase successfully

📥 Fetching quiz definitions from API...
  ✓ Loaded: 30-Day Follow-Up Survey (17 questions)
  ✓ Loaded: 90-Day Progress Check-In (29 questions)
  ✓ Loaded: 6-Month Impact Assessment (16 questions)
  ✓ Loaded: 12-Month Final Assessment (21 questions)

📊 Loaded 4 quizzes from API

💾 Inserting quizzes into Supabase...

✅ 30-Day Follow-Up Survey
   ID: survey-30days
   Questions: 17
   Time: ~8 minutes

✅ 90-Day Progress Check-In
   ID: survey-90days
   Questions: 29
   Time: ~12 minutes

✅ 6-Month Impact Assessment
   ID: survey-180days
   Questions: 16
   Time: ~15 minutes

✅ 12-Month Final Assessment
   ID: survey-12months-final
   Questions: 21
   Time: ~10 minutes

══════════════════════════════════════════════════

🔍 Verifying database...

📋 Total quizzes in database: 4

   1. 30-Day Follow-Up Survey (~8 min)
   2. 90-Day Progress Check-In (~12 min)
   3. 6-Month Impact Assessment (~15 min)
   4. 12-Month Final Assessment (~10 min)

══════════════════════════════════════════════════

✨ Database seeding completed successfully!
```

## What Gets Seeded

### Quizzes Table

All 4 AI Training Survey definitions:

| Survey ID | Title | Questions | Est. Time |
|-----------|-------|-----------|-----------|
| `survey-30days` | 30-Day Follow-Up Survey | 17 | 8 min |
| `survey-90days` | 90-Day Progress Check-In | 29 | 12 min |
| `survey-180days` | 6-Month Impact Assessment | 16 | 15 min |
| `survey-12months-final` | 12-Month Final Assessment | 21 | 10 min |

### Question Types Included

- Multiple choice (radio buttons)
- Checkboxes (multi-select)
- Rating scales (1-5, 0-10 with labels)
- Text inputs (short and long)
- Number inputs

## Troubleshooting

### "Missing Supabase credentials"
- Check that `.env.local` exists and has the correct environment variables
- Variables must start with `NEXT_PUBLIC_`

### "Connection failed"
- Verify your Supabase project URL and anon key are correct
- Check that migrations have been run
- Ensure the quizzes table exists in your database

### "No quiz data loaded from API"
- Make sure the dev server is running (`npm run dev`)
- Verify http://localhost:3000/api/quiz/survey-30days returns data
- Check the console for any API errors

### "Error inserting quiz"
- Verify the quizzes table schema matches the expected structure
- Check Supabase logs for more details
- Ensure RLS policies allow inserts (you may need to temporarily disable RLS for seeding)

## Re-seeding

The script uses `upsert` with `onConflict: 'id'`, so:
- Running the script multiple times is safe
- Existing quizzes will be updated with the latest data
- No duplicates will be created

## Manual Seeding (Alternative)

If the TypeScript script doesn't work, you can use the SQL file:

```bash
# Copy the content of supabase/seed-quizzes.sql
# Paste and run it in Supabase SQL Editor
```

Note: The SQL file only includes a template for the 30-day survey. The TypeScript script is recommended for complete seeding.
