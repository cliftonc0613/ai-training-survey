# Database Setup and Seeding Guide

This guide will help you set up your Supabase database and populate it with the AI Training Survey quiz data.

## Step 1: Run Migrations in Supabase

You need to run all SQL migrations in your Supabase SQL Editor in order:

### 1.1 Navigate to Supabase SQL Editor

1. Go to https://supabase.com
2. Open your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"

### 1.2 Run Migrations (In Order)

Copy and paste each file's contents into the SQL Editor and click "Run":

#### Migration 1: Create Users Table
File: `supabase/migrations/001_create_users_table.sql`

Creates the `users` table for storing survey respondents.

#### Migration 2: Create Quizzes and Quiz Responses Tables
File: `supabase/migrations/002_create_quiz_responses_table.sql`

Creates both:
- `quizzes` table (stores survey definitions)
- `quiz_responses` table (stores user answers)

#### Migration 3: Enable Row Level Security
File: `supabase/migrations/003_enable_rls.sql`

Sets up RLS policies for security.

#### Migration 4: Change Quiz ID to TEXT
File: `supabase/migrations/004_change_quiz_id_to_text.sql`

⚠️ **IMPORTANT**: This changes `quizzes.id` from UUID to TEXT to support human-readable IDs like "survey-30days".

### 1.3 Verify Tables Exist

Run this query to verify all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- ✅ `quizzes`
- ✅ `quiz_responses`
- ✅ `users`

## Step 2: Seed Quiz Data

### 2.1 Ensure Dev Server is Running

The seeding script fetches quiz data from your local API:

```bash
npm run dev
```

Verify it's running at http://localhost:3000

### 2.2 Run the Seeding Script

```bash
npm run seed
```

### 2.3 Expected Output

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

✨ Database seeding completed successfully!
```

## Step 3: Verify Data in Supabase

Go to Supabase → Table Editor → `quizzes` table

You should see 4 rows:
1. survey-30days (17 questions, 8 min)
2. survey-90days (29 questions, 12 min)
3. survey-180days (16 questions, 15 min)
4. survey-12months-final (21 questions, 10 min)

## Step 4: Update API Priority (Optional)

The API currently checks mock data first. After seeding, update the API to prioritize database:

In `app/api/quiz/[id]/route.ts`:

**Current Order:**
1. ✅ Check mock data
2. Check database

**Recommended After Seeding:**
1. ✅ Check database
2. Fall back to mock data

This ensures the app uses real database data when available.

## Troubleshooting

### Error: "invalid input syntax for type uuid"

**Problem**: Migration 004 hasn't been run yet.

**Solution**: Run migration `004_change_quiz_id_to_text.sql` in Supabase SQL Editor first.

### Error: "Missing Supabase credentials"

**Problem**: `.env.local` is missing or incomplete.

**Solution**: Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Error: "No quiz data loaded from API"

**Problem**: Dev server isn't running.

**Solution**:
```bash
npm run dev
```

Then run seed script again.

### Error: "quiz_responses_quiz_id_fkey violates foreign key constraint"

**Problem**: There's existing data with UUID-format quiz_ids.

**Solution**: Clear the tables before running migration 004:
```sql
TRUNCATE quiz_responses CASCADE;
TRUNCATE quizzes CASCADE;
```

Then re-run migration 004 and seeding.

## Admin Area Access

After seeding, you can view survey data in the admin area:

1. Navigate to: http://localhost:3000/admin/login
2. Login with: `admin` / `admin123`
3. View quizzes and responses in the dashboard

## Re-Seeding

Safe to run `npm run seed` multiple times:
- Uses `upsert` to avoid duplicates
- Updates existing quizzes with latest data
- Won't delete any quiz responses

## Next Steps

After successful seeding:
- ✅ Take a test survey
- ✅ Submit responses
- ✅ View data in admin area
- ✅ Test the complete flow end-to-end

Your database is now ready for production! 🎉
