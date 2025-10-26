# Course Survey Progressive Web App

A mobile-first Progressive Web Application (PWA) for collecting post-course survey responses with offline support and automatic data synchronization.

## Overview

This PWA enables course participants to complete surveys about their learning experience through an intuitive, accessible interface that works online and offline. The application supports multiple quiz formats, saves progress automatically, and syncs responses to Supabase when connectivity is restored.

### Key Features

- ✅ **Offline-First Architecture** - Complete surveys without internet connection
- 📱 **Mobile-Optimized** - Responsive design with mobile-first approach
- 💾 **Auto-Save Progress** - Resume surveys anytime with unique resume tokens
- 🔄 **Background Sync** - Automatic data synchronization when online
- 📊 **Multiple Question Types** - Radio, checkbox, rating, slider, dropdown, and text inputs
- 🎯 **Two User Flows** - Quiz selection page OR direct quiz links
- 🚀 **Installable** - Install as native app on iOS, Android, and desktop
- 🎨 **Clean UI** - Built with Mantine components for consistent design

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **UI Library:** [Mantine 8.x](https://mantine.dev/)
- **Language:** TypeScript
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Offline Storage:** IndexedDB + localStorage
- **Hosting:** [Vercel](https://vercel.com/)
- **Testing:** Jest + React Testing Library

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Vercel account (for deployment, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-training-survey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` in the project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up the database**

   Run migrations in order via Supabase SQL Editor:
   ```bash
   1. supabase/migrations/001_create_users_table.sql
   2. supabase/migrations/002_create_quiz_responses_table.sql
   3. supabase/migrations/003_enable_rls.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server

### Testing & Quality
- `npm test` - Run all tests (prettier, lint, typecheck, jest)
- `npm run jest` - Run Jest tests only
- `npm run jest:watch` - Run Jest in watch mode
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - Run ESLint and Stylelint

### Code Formatting
- `npm run prettier:check` - Check code formatting
- `npm run prettier:write` - Auto-format all files

### Analysis
- `npm run analyze` - Analyze production bundle size

### Storybook
- `npm run storybook` - Start Storybook dev server (port 6006)
- `npm run storybook:build` - Build Storybook to storybook-static/

## User Flows

### Standard Flow (Quiz Selection)

```
Landing Page (/)
  ↓ Click "Start Survey"
User Info Form (/start)
  ↓ Submit name, email, phone
Quiz Selection (/quizzes)
  ↓ Choose quiz card
Quiz Page (/quiz/[slug])
  ↓ Complete & submit
Thank You Page (/thank-you)
```

### Direct Link Flow (Specific Quiz)

```
Direct Quiz Link (/quiz/[slug])
  ↓ Detect no user session
User Info Form (/start?redirect=/quiz/[slug])
  ↓ Submit user info
Quiz Page (/quiz/[slug])
  ↓ Complete & submit
Thank You Page (/thank-you)
```

## Project Structure

```
ai-training-survey/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Mantine providers
│   ├── page.tsx             # Landing page
│   └── api/                 # API routes
│       ├── user/route.ts    # User registration endpoints
│       ├── quiz/route.ts    # Quiz submission endpoints
│       └── quiz/[id]/       # Load quiz definitions
├── components/              # React components
├── lib/                     # Core utilities
│   ├── supabaseClient.ts   # Database client + helpers
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── supabase/               # Database migrations
└── public/                 # Static assets
```

## Database Schema

### Users Table
Stores participant information with unique resume tokens for session recovery.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Full name |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| resume_token | TEXT | Unique session recovery token |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Quizzes Table
Stores quiz definitions loaded dynamically by the application.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Quiz title |
| description | TEXT | Quiz description |
| questions | JSONB | Array of question objects |
| estimated_time | INTEGER | Estimated completion time (minutes) |

### Quiz Responses Table
Stores user responses with progress tracking and sync status.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| quiz_id | UUID | Foreign key to quizzes |
| user_id | UUID | Foreign key to users |
| responses | JSONB | Array of user answers |
| started_at | TIMESTAMPTZ | When quiz was started |
| completed_at | TIMESTAMPTZ | When quiz was completed (nullable) |
| progress | INTEGER | Completion percentage (0-100) |
| synced | BOOLEAN | Whether synced from offline storage |

## API Routes

### User Registration
- **POST** `/api/user` - Register new user, returns user object with resume token
- **GET** `/api/user?resumeToken={token}` - Retrieve user by resume token

### Quiz Operations
- **GET** `/api/quiz/[id]` - Load quiz definition by ID
- **POST** `/api/quiz` - Submit quiz response (new or progress update)
- **GET** `/api/quiz?userId={userId}` - Get all responses for a user
- **PUT** `/api/quiz` - Update existing quiz response

## Offline Support

The app uses a dual-storage strategy for robust offline functionality:

### IndexedDB (Primary Offline Storage)
- Stores users, quiz responses, and offline queue
- Three object stores: `users`, `quiz_responses`, `offline_queue`
- Managed via utilities in `lib/utils/storage.ts`

### localStorage (Session/Preference Storage)
- Keys: `current_user`, `resume_token`, `quiz_session`, `offline_mode`
- Automatic JSON serialization

### Offline Queue System
- Managed by `useOfflineQueue` hook
- Auto-syncs when network is restored
- Max retry count: 5 attempts
- Processes user registrations and quiz submissions

## Supported Question Types

1. **Multiple Choice** - Single selection (radio buttons or card layout)
2. **Checkboxes** - Multiple selections (checkboxes or card layout)
3. **Rating Scale** - 1-5, 1-7, or 1-10 point scales (stars, buttons, or slider)
4. **Dropdown Select** - Single selection from dropdown menu
5. **Slider (Range)** - Continuous or stepped numeric input
6. **Text Input** - Short (single-line) or long (textarea) text responses

## Configuration

### Color Scheme
- **Primary:** `#46597e` (blue) - [Mantine palette](https://mantine.dev/colors-generator/?color=46597e)
- **Accent:** `#F06418` (orange) - [Mantine palette](https://mantine.dev/colors-generator/?color=F06418)

### Responsive Breakpoints
- **Mobile:** < 768px (single column, stacked layout)
- **Tablet:** 768px - 992px (2-column grid)
- **Desktop:** > 992px (4-column grid, wider content)

## Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** - Automatic deployment on push to main branch

### Pre-deployment Checklist
- ✅ Environment variables configured in Vercel
- ✅ Database migrations applied in Supabase
- ✅ RLS policies enabled for production
- ✅ Build succeeds locally (`npm run build`)
- ✅ PWA manifest and icons added to `/public`
- ✅ Service worker configured

## PWA Setup (Optional)

1. **Install next-pwa**
   ```bash
   npm install next-pwa
   ```

2. **Update next.config.mjs**
   ```javascript
   import withPWA from 'next-pwa';

   export default withPWA({
     dest: 'public',
     register: true,
     skipWaiting: true,
     disable: process.env.NODE_ENV === 'development',
   })(nextConfig);
   ```

3. **Add manifest.json** to `/public`
4. **Add app icons** (192px, 512px) to `/public`

## Testing Offline Mode

1. Start dev server: `npm run dev`
2. Open Chrome DevTools → Network tab
3. Select "Offline" throttling
4. Submit quiz response → check IndexedDB for queued item
5. Restore "Online" → verify auto-sync

## Troubleshooting

### Supabase Connection Fails
- Verify environment variables in `.env.local`
- Check Supabase project URL and anon key are correct
- Ensure network allows Supabase API calls

### IndexedDB Not Working
- Check browser supports IndexedDB
- Verify storage quota not exceeded
- Clear browser data and retry

### Offline Queue Not Syncing
- Check `navigator.onLine` status
- Verify `useOfflineQueue` hook initialized
- Check browser console for retry errors

### Type Errors
- Run `npm run typecheck` for full error report
- Ensure database types match schema in `lib/types/database.ts`
- Regenerate types after schema changes

## Project Status

### ✅ Completed
- Database schema and migrations
- API routes for user registration and quiz submission
- Offline queue system with IndexedDB
- Type-safe Supabase client helpers
- Resume token session management

### 🚧 In Progress
- PWA configuration (manifest, service worker)
- Frontend quiz UI components
- User registration form
- Quiz selection page

### 📋 Planned
- n8n + Brevo email automation integration
- Analytics dashboard with Recharts
- Multi-language support

## Documentation

- **PRD:** [Course_Survey_PWA_PRD.md](Course_Survey_PWA_PRD.md) - Full product requirements
- **Tasks:** [tasks/0001-prd-course-survey-pwa.md](tasks/0001-prd-course-survey-pwa.md) - Implementation tasks
- **Developer Guide:** [CLAUDE.md](CLAUDE.md) - Architecture and development guidelines

## External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine Documentation](https://mantine.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For questions or issues, please [open an issue](link-to-issues) or contact [your-email].
