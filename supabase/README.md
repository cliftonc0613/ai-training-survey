# Supabase Database Setup

This directory contains database migrations for the AI Training Survey PWA.

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install globally with `npm install -g supabase`
3. **Environment Variables**: Configure `.env.local` with your Supabase credentials

## Migration Files

- `001_create_users_table.sql` - Creates users table with resume token support
- `002_create_quiz_responses_table.sql` - Creates quizzes and quiz_responses tables
- `003_enable_rls.sql` - Configures Row Level Security policies

## Option 1: Apply Migrations via Supabase Dashboard (Recommended for First Time)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - Copy contents of `001_create_users_table.sql`
   - Paste into SQL Editor and click "Run"
   - Repeat for `002_create_quiz_responses_table.sql`
   - Repeat for `003_enable_rls.sql`

## Option 2: Apply Migrations via Supabase CLI

### First Time Setup

```bash
# Initialize Supabase in your project
npx supabase init

# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Apply Migrations

```bash
# Push migrations to your Supabase project
npx supabase db push

# Or apply specific migration
npx supabase db execute -f supabase/migrations/001_create_users_table.sql
npx supabase db execute -f supabase/migrations/002_create_quiz_responses_table.sql
npx supabase db execute -f supabase/migrations/003_enable_rls.sql
```

## Option 3: Manual SQL Execution

If you prefer to run SQL directly:

```bash
# Using psql (requires direct database connection string)
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -f supabase/migrations/001_create_users_table.sql
```

## Verify Migrations

After applying migrations, verify in Supabase Dashboard:

1. **Table Editor** → Check that `users`, `quizzes`, and `quiz_responses` tables exist
2. **SQL Editor** → Run:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public';
   ```
3. **Authentication** → Verify RLS policies are enabled:
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these from: **Supabase Dashboard → Project Settings → API**

## Troubleshooting

### "relation already exists" error
Migrations have already been applied. Safe to ignore or drop tables first:
```sql
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### Permission denied errors
Make sure you're using the service role key for migrations, not the anon key.

### RLS policies not working
Verify RLS is enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```
