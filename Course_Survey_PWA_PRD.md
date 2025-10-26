# Product Requirements Document (PRD)
## Project Title: Course Survey Progressive Web App
## Prepared by: Clifton Canady
## Version: 1.0
## Date: October 2025

---

## 1. Objective
Create a Progressive Web Application (PWA) that allows course participants to complete post-course surveys. The app will collect user information and present four separate quizzes that evaluate different aspects of the course experience. The system will store responses in Supabase for later analysis and reporting.

---

## 2. Goals and Success Criteria

### Primary Goals
- Provide a fast, installable, mobile-friendly survey platform.
- Allow participants to complete one or more quizzes after the course.
- Store and manage user information and responses in a structured database.
- Function both online and offline, syncing data when connection is restored.

### Success Metrics
- 100% functional offline mode for cached quizzes.
- Less than 5 seconds average page load time on mobile.
- At least 95% successful submission rate across all quizzes.
- Accurate linkage of user identity (name, email, phone) to quiz responses.

---

## 3. Scope

### In-Scope Features
1. Landing Page – Introduction to the survey and a “Start” button.
2. User Information Form – Collect name, email, and phone number. Validate inputs before submission. Store record in Supabase and retain locally for session continuity.
3. Quiz Selection Page – Display four quiz cards with descriptions and clean URLs:
   - /quiz/course-feedback
   - /quiz/instructor-evaluation
   - /quiz/learning-environment
   - /quiz/overall-satisfaction
4. Quiz Pages – Dynamic quizzes that load questions from JSON definitions. Each quiz accepts multiple-choice, rating scale, and text responses. Submissions are tied to the logged-in user.
5. Thank You Page – Confirmation after submission with optional link to other quizzes.
6. Offline Support – Cache static pages and quizzes. Store submissions locally and sync when online.
7. PWA Installability – App can be installed on mobile or desktop.
8. Admin Data Access – Responses viewable in Supabase dashboard.

### Out-of-Scope (Future Enhancements)
- Custom analytics dashboard with charts.
- Email confirmation workflows (to be added via n8n and Brevo later).
- Multi-language support.
- Authentication beyond simple user info capture.

---

## 4. User Flow

### Step 1 – Landing Page
User opens the app → clicks “Start Survey” → redirected to /start.

### Step 2 – User Information
User enters name, email, and phone → data sent to /api/user → response returns user_id → stored in session/local storage.

### Step 3 – Quiz Selection
User chooses a quiz → navigates to /quiz/[slug].

### Step 4 – Quiz Completion
Quiz questions load dynamically → user answers → submits → data sent to /api/quiz along with user_id.

### Step 5 – Thank You Page
Displays success message → offers to take another quiz or exit.

---

## 5. Functional Requirements

| ID | Requirement | Priority |
|----|--------------|----------|
| FR-01 | The app must allow users to input and validate name, email, and phone. | High |
| FR-02 | The system must store user data in the users table in Supabase. | High |
| FR-03 | The app must show four quizzes selectable from a single menu. | High |
| FR-04 | Each quiz must be dynamically loaded via JSON data. | High |
| FR-05 | Quiz responses must be submitted to the quiz_responses table. | High |
| FR-06 | The app must support offline form completion and background sync. | High |
| FR-07 | PWA manifest and service worker must enable installation. | High |
| FR-08 | The system must show a thank-you screen after submission. | Medium |
| FR-09 | The app should visually align with Clemson branding (orange and purple). | Medium |
| FR-10 | The app should use Mantine for UI consistency. | Medium |

---

## 6. Technical Requirements

| Category | Details |
|-----------|----------|
| Framework | Next.js 15+ (App Router) |
| UI Library | Mantine |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (frontend) |
| Auth | Anonymous session via Supabase; local session handling |
| Offline Support | next-pwa with service worker caching |
| API Routes | /api/user for user info, /api/quiz for quiz submission |
| Data Model | users and quiz_responses tables |
| Languages | TypeScript, SQL, JSON |
| Analytics (future) | Recharts + OpenAI API sentiment scoring |

---

## 6A. Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| Frontend Framework | Next.js 15+ (App Router) | Core framework for building the app, managing routes, and handling API endpoints. |
| UI Library | Mantine | Component library for responsive, accessible quiz and form design. |
| Language | TypeScript | Provides static typing and ensures maintainable, scalable code. |
| Database | Supabase (PostgreSQL) | Stores user profiles and quiz responses; provides API and row-level security. |
| Backend Logic | Next.js API Routes | Handles user submissions and quiz data writes to Supabase. |
| Authentication / Session Handling | Supabase Client + Local Storage | Stores anonymous session and user info locally for continuity. |
| Offline Capability | next-pwa + Service Worker | Enables offline access, caching, and background data sync. |
| Hosting & Deployment | Vercel | Hosts the frontend with automatic HTTPS, CI/CD, and PWA support. |
| Automation / Notifications | n8n + Brevo (future enhancement) | Automates email confirmations and survey completion workflows. |
| Styling | Mantine Theme + Custom CSS | Applies Clemson branding (orange #f56600, purple #522d80). |
| Data Visualization (future) | Recharts | Will be used to display quiz results and summary metrics. |
| Development Tools | ESLint, Prettier, GitHub, Docker (for Supabase local testing) | Enforces code quality, version control, and local dev consistency. |

---

## 7. Non-Functional Requirements

| Requirement | Target |
|--------------|--------|
| Performance | <5s load time on mobile |
| Accessibility | WCAG AA compliance |
| Reliability | Data persistence and offline sync |
| Security | HTTPS, Supabase RLS enabled |
| Scalability | Able to handle 5,000 submissions/month |
| Maintainability | Modular React components and JSON-driven quizzes |

---

## 8. Data Model Summary

### users
- id (UUID, PK)
- name (Text)
- email (Text)
- phone (Text)
- created_at (Timestamp)

### quiz_responses
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- quiz_slug (Text)
- responses (JSONB)
- submitted_at (Timestamp)

---

## 9. Dependencies
- Next.js
- Mantine UI
- Supabase JS Client
- next-pwa
- React Hook Form or Mantine Form
- n8n (for automation later)
- Brevo (for email automation later)

---

## 10. Milestones and Timeline

| Phase | Deliverable | Estimated Time |
|--------|--------------|----------------|
| Phase 1 | Setup project, initialize Next.js + Supabase | 1 week |
| Phase 2 | Build user form and quiz selection pages | 1 week |
| Phase 3 | Implement dynamic quizzes and API routes | 2 weeks |
| Phase 4 | Add PWA capabilities (offline + installable) | 1 week |
| Phase 5 | QA, testing, and deployment to Vercel | 1 week |
| **Total Estimate:** | **6 weeks** |

---

## 11. Risks and Mitigation

| Risk | Mitigation |
|------|-------------|
| Offline sync failures | Queue data locally using IndexedDB and retry on reconnect. |
| Data duplication | Use Supabase’s UUID keys and validation. |
| Slow performance on mobile | Cache assets and compress quiz data. |
| User drop-off | Simplify forms and minimize steps. |

---

## 12. Deliverables
- Fully functional PWA with four quizzes.
- Supabase database with linked users and quiz_responses tables.
- Responsive Mantine-based interface.
- Source code in version-controlled repository.
- Deployment on Vercel.


---

## 13. Development Setup Using Mantine Next.js Template

### 13.1 Repository Setup
The project will use the official Mantine Next.js starter template as the base:

**Repository:** [https://github.com/mantinedev/next-app-template.git](https://github.com/mantinedev/next-app-template.git)

### 13.2 Setup Instructions

#### Step 1 – Clone the Repository
```bash
git clone https://github.com/mantinedev/next-app-template.git course-survey-pwa
cd course-survey-pwa
```

#### Step 2 – Install Dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
```

#### Step 3 – Initialize Project Configuration
Update `package.json` metadata:
```json
{
  "name": "course-survey-pwa",
  "description": "Progressive Web App for post-course surveys using Mantine + Supabase"
}
```
Create a `.env.local` file in the root:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

#### Step 4 – Add Required Packages
```bash
pnpm add @supabase/supabase-js next-pwa react-hook-form
```

#### Step 5 – Convert Template to PWA
Edit `next.config.mjs`:
```js
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

export default withPWA(nextConfig);
```
Add `public/manifest.json`:
```json
{
  "name": "Course Survey App",
  "short_name": "SurveyPWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f56600",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

#### Step 6 – Core Pages
- `/start` – User info form  
- `/quizzes` – Quiz selection screen  
- `/quiz/[slug]` – Dynamic quiz pages  
- `/thank-you` – Submission confirmation page  

#### Step 7 – Supabase Integration
Create two tables (`users`, `quiz_responses`).  
Add client configuration in `lib/supabaseClient.ts`:
```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Step 8 – API Routes
- `/api/user` – Handles user info submissions.  
- `/api/quiz` – Handles quiz responses.

#### Step 9 – Deployment
Deploy via **Vercel**.  
Set environment variables and confirm PWA installability using Lighthouse.

---
