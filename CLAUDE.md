# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Progressive Web Application (PWA)** for collecting post-course survey responses. It allows course participants to register, complete multiple quizzes about their course experience, and submit responses that sync to Supabase. The app supports offline functionality with automatic background sync when connection is restored.

**Key Features:**
- User registration with resume token for session recovery
- Four dynamic quizzes loaded from Supabase
- Offline-first architecture with IndexedDB caching
- Background sync queue for offline responses
- PWA capabilities (installable, cached static assets)
- Mantine UI components with responsive design

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **UI Library:** Mantine 8.x
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Offline Storage:** IndexedDB + localStorage
- **State Management:** React hooks
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Stylelint
- **Formatting:** Prettier

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build production bundle
npm start            # Start production server
npm test             # Run all tests (prettier, lint, typecheck, jest)
```

### Testing and Quality
```bash
npm run jest         # Run Jest tests only
npm run jest:watch   # Run Jest in watch mode
npm run typecheck    # TypeScript type checking
npm run lint         # Run ESLint and Stylelint
npm run eslint       # Run ESLint only
npm run stylelint    # Run Stylelint only
```

### Code Formatting
```bash
npm run prettier:check   # Check code formatting
npm run prettier:write   # Auto-format all files
```

### Bundle Analysis
```bash
npm run analyze      # Analyze production bundle size (sets ANALYZE=true)
```

### Storybook
```bash
npm run storybook        # Start Storybook dev server on port 6006
npm run storybook:build  # Build Storybook to storybook-static/
```

## Project Architecture

### Directory Structure

```
app/
├── layout.tsx              # Root layout with Mantine providers
├── page.tsx                # Landing page
└── api/
    ├── user/route.ts       # POST: Register user, GET: Retrieve by token
    ├── quiz/route.ts       # POST: Submit quiz, GET: Get user responses, PUT: Update response
    └── quiz/[id]/route.ts  # GET: Load quiz definition by ID

components/
├── ColorSchemeToggle/      # Dark/light mode toggle
└── Welcome/                # Example component with tests

lib/
├── supabaseClient.ts       # Supabase client + db helper functions
├── types.ts                # Application types
├── types/database.ts       # Generated Supabase types
├── hooks/
│   ├── useOfflineQueue.ts  # Offline sync queue management
│   └── useQuizProgress.ts  # Quiz progress tracking
└── utils/
    ├── validation.ts       # Input validation (user registration)
    ├── storage.ts          # IndexedDB + localStorage utilities
    └── resume-token.ts     # Resume token generation

supabase/
└── migrations/
    ├── 001_create_users_table.sql
    ├── 002_create_quiz_responses_table.sql
    └── 003_enable_rls.sql
```

### Database Schema

**users table:**
- `id` (UUID, PK) - User unique identifier
- `name` (TEXT) - Full name
- `email` (TEXT) - Email address
- `phone` (TEXT) - Phone number
- `resume_token` (TEXT, UNIQUE) - Session recovery token
- `created_at`, `updated_at` (TIMESTAMPTZ)

**quizzes table:**
- `id` (UUID, PK) - Quiz unique identifier
- `title` (TEXT) - Quiz title
- `description` (TEXT) - Quiz description
- `questions` (JSONB) - Array of question objects
- `estimated_time` (INTEGER) - Estimated completion time in minutes
- `created_at`, `updated_at` (TIMESTAMPTZ)

**quiz_responses table:**
- `id` (UUID, PK) - Response unique identifier
- `quiz_id` (UUID, FK → quizzes.id) - Reference to quiz
- `user_id` (UUID, FK → users.id) - Reference to user
- `responses` (JSONB) - Array of user answers
- `started_at` (TIMESTAMPTZ) - When user started quiz
- `completed_at` (TIMESTAMPTZ, nullable) - When user completed quiz
- `progress` (INTEGER, 0-100) - Completion percentage
- `synced` (BOOLEAN) - Whether response synced from offline storage
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Use Context7 for API:**
Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

### API Routes

**POST /api/user**
- Register new user with name, email, phone
- Validates input via `validateUserRegistration()`
- Generates unique `resume_token` for session recovery
- Returns user object with `resumeToken`

**GET /api/user?resumeToken={token}**
- Retrieve user by resume token
- Used for session recovery

**POST /api/quiz**
- Submit quiz response (new or progress update)
- Required: `quizId`, `userId`, `responses` (array)
- Optional: `progress`, `completedAt`
- Auto-calculates `isComplete` if progress=100 or completedAt exists

**GET /api/quiz?userId={userId}**
- Retrieve all quiz responses for a user
- Returns array of responses with formatted fields

**PUT /api/quiz**
- Update existing quiz response
- Required: `id`
- Optional: `responses`, `progress`, `completedAt`

**GET /api/quiz/[id]**
- Load quiz definition by ID
- Returns quiz object with title, description, questions, estimatedTime

### Offline Architecture

The app uses a **dual-storage strategy**:

1. **IndexedDB** - Primary offline storage
   - Stores users, quiz_responses, offline_queue
   - Managed via `lib/utils/storage.ts` utilities
   - Three object stores: `users`, `quiz_responses`, `offline_queue`

2. **localStorage** - Session/preference storage
   - Keys: `current_user`, `resume_token`, `quiz_session`, `offline_mode`
   - JSON serialization handled automatically

**Offline Queue System:**
- `useOfflineQueue` hook manages background sync
- Queued items: `{ id, type, data, timestamp, retryCount, synced }`
- Auto-syncs when network restored
- Max retry count: 5 attempts
- Processes user registrations and quiz submissions

**Online/Offline Detection:**
- Monitors `navigator.onLine`
- Listens to `online`/`offline` events
- Auto-triggers queue processing when online

### Resume Token System

Users receive a unique `resume_token` on registration:
- Generated via `generateResumeToken()` in `lib/utils/resume-token.ts`
- Stored in localStorage as `resume_token`
- Used to restore user session via GET /api/user?resumeToken={token}
- Enables seamless continuation across devices/sessions

## Environment Configuration

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important:**
- Both variables MUST start with `NEXT_PUBLIC_` to be accessible in browser
- Never commit `.env.local` to version control
- Configure these in Vercel project settings for deployment

## Database Setup

### Option 1: Manual Migration (Recommended)

Run migrations in order via Supabase SQL Editor:

```bash
1. supabase/migrations/001_create_users_table.sql
2. supabase/migrations/002_create_quiz_responses_table.sql
3. supabase/migrations/003_enable_rls.sql
```

### Option 2: Supabase CLI (if configured)

```bash
supabase db push
```

**Note:** Ensure RLS policies are configured in migration 003 before deploying to production.

## Testing Strategy

**Component Tests:**
- Located in `components/*/*.test.tsx`
- Uses React Testing Library + Jest
- Mantine test utilities in `test-utils/render.tsx`

**Running Tests:**
```bash
npm run jest              # Run all tests once
npm run jest:watch        # Watch mode for development
npm run test              # Full test suite (includes lint + typecheck)
```

**Test Pattern:**
- Co-located with components (e.g., `Welcome.tsx` + `Welcome.test.tsx`)
- Use `render()` from `test-utils/render.tsx` for Mantine context

## PWA Configuration

**Current Status:**
- `next.config.mjs` uses `@next/bundle-analyzer` only
- PWA not yet configured

**To Enable PWA:**
1. Install: `npm install next-pwa`
2. Update `next.config.mjs` with PWA wrapper (see PRD section 13.5)
3. Add `public/manifest.json` with app metadata
4. Add icons: `public/icon-192.png`, `public/icon-512.png`
5. Configure service worker caching strategy

**Reference:** See Course_Survey_PWA_PRD.md section 13.5 for PWA setup instructions.

## Supabase Client Usage

Import the database helpers from `lib/supabaseClient.ts`:

```typescript
import { db } from '@/lib/supabaseClient';

// Create user
const { data, error } = await db.createUser({ name, email, phone, resume_token });

// Get quiz
const { data, error } = await db.getQuiz(quizId);

// Submit quiz response
const { data, error } = await db.createQuizResponse({
  quiz_id: quizId,
  user_id: userId,
  responses: [...],
  progress: 50
});
```

**Available Helper Methods:**
- `db.createUser()`, `db.getUserByResumeToken()`, `db.updateUser()`
- `db.getQuiz()`, `db.getAllQuizzes()`
- `db.createQuizResponse()`, `db.updateQuizResponse()`, `db.getQuizResponsesByUser()`, `db.getQuizResponse()`

## Type Safety

**Database Types:**
- Generated types in `lib/types/database.ts`
- TypeScript interfaces for all tables
- Helper types: `User`, `UserInsert`, `UserUpdate`, `Quiz`, `QuizResponse`, etc.

**Application Types:**
- Defined in `lib/types.ts`
- Import via `import type { User } from '@/lib/types/database'`

**Re-generating Types:**
- After database schema changes, update `lib/types/database.ts` manually or via Supabase CLI type generation

## Deployment

**Platform:** Vercel (recommended)

**Pre-deployment Checklist:**
1. Set environment variables in Vercel project settings
2. Run `npm run build` locally to verify
3. Ensure Supabase migrations applied
4. Configure RLS policies for production
5. Test PWA installability via Lighthouse

**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

## Common Workflows

### Adding a New Quiz
1. Insert quiz definition into `quizzes` table via Supabase dashboard
2. Structure: `{ title, description, questions: [...], estimated_time: 10 }`
3. Quiz automatically available via GET /api/quiz/[id]

### Adding New API Route
1. Create file in `app/api/{route}/route.ts`
2. Export named functions: `GET`, `POST`, `PUT`, `DELETE`
3. Import `db` helpers from `@/lib/supabaseClient`
4. Return `NextResponse.json()`

### Testing Offline Mode
1. Run dev server: `npm run dev`
2. Open Chrome DevTools → Network tab
3. Select "Offline" throttling
4. Submit quiz response → check IndexedDB for queued item
5. Restore "Online" → verify auto-sync

## Important Notes

- **Resume Tokens:** Users must store their resume token to continue sessions (stored in localStorage)
- **JSONB Fields:** Quiz questions and responses are stored as JSONB arrays in Supabase
- **Offline-First:** Always check `navigator.onLine` before Supabase operations
- **Type Safety:** All API routes use typed database helpers from `lib/supabaseClient.ts`
- **Session Management:** PWA handles sessions via resume tokens, not Supabase auth
- **Validation:** User input validated in `lib/utils/validation.ts` before database writes

## Troubleshooting

**Supabase Connection Fails:**
- Verify environment variables in `.env.local`
- Check Supabase project URL and anon key
- Ensure network allows Supabase API calls

**IndexedDB Not Working:**
- Check browser supports IndexedDB
- Verify storage quota not exceeded
- Clear browser data and retry

**Offline Queue Not Syncing:**
- Check `navigator.onLine` status
- Verify `useOfflineQueue` hook initialized
- Check console for retry errors

**Type Errors:**
- Run `npm run typecheck` for full error report
- Ensure database types match schema in `lib/types/database.ts`
- Regenerate types after schema changes

## Project Status

**Completed:**
- Database schema and migrations
- API routes for user registration and quiz submission
- Offline queue system with IndexedDB
- Type-safe Supabase client helpers
- Resume token session management

**In Progress:**
- PWA configuration (manifest, service worker)
- Frontend quiz UI components
- User registration form
- Quiz selection page

**Planned:**
- n8n + Brevo email automation integration
- Analytics dashboard with Recharts
- Multi-language support

## References

- **PRD:** Course_Survey_PWA_PRD.md - Full product requirements
- **Tasks:** tasks/0001-prd-course-survey-pwa.md - Implementation tasks
- **Mantine Docs:** https://mantine.dev/
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
