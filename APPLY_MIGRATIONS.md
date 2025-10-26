# Apply Database Migrations

Your Supabase project is configured! Now apply the migrations:

## Quick Steps (5 minutes)

1. **Open SQL Editor**: [Click here to open](https://supabase.com/dashboard/project/huvjmonwujoxmqrnltab/sql/new)

2. **Run Migration 1** - Users Table:
   - Copy all content from: `supabase/migrations/001_create_users_table.sql`
   - Paste into SQL Editor
   - Click **Run** button

3. **Run Migration 2** - Quizzes & Responses Tables:
   - Copy all content from: `supabase/migrations/002_create_quiz_responses_table.sql`
   - Paste into SQL Editor
   - Click **Run** button

4. **Run Migration 3** - Security Policies:
   - Copy all content from: `supabase/migrations/003_enable_rls.sql`
   - Paste into SQL Editor
   - Click **Run** button

## Verify Success

After running all migrations, verify in [Table Editor](https://supabase.com/dashboard/project/huvjmonwujoxmqrnltab/editor):

You should see 3 tables:
- ✓ `users`
- ✓ `quizzes`
- ✓ `quiz_responses`

## Next Steps

After migrations are applied, come back and reply "migrations done" to continue with API route setup.
