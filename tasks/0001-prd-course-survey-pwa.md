# Product Requirements Document (PRD)
## Project Title: Course Survey Progressive Web App
## Prepared by: Clifton Canady
## Version: 2.0
## Date: October 2025

---

## 1. Introduction/Overview

Create a Progressive Web Application (PWA) that allows course participants to complete post-course surveys through an intuitive, mobile-first interface. The app will collect user information and present four separate quizzes that evaluate different aspects of the course experience. The system will store responses in Supabase for later analysis and reporting.

**Problem this solves:** Course organizers need a fast, accessible, offline-capable survey platform that participants can complete on any device, with the ability to send participants to specific quizzes or let them choose from all available surveys.

---

## 2. Goals

### Primary Goals
1. Provide a fast, installable, mobile-friendly survey platform
2. Allow participants to complete one or more quizzes after the course
3. Store and manage user information and responses in a structured database
4. Function both online and offline, syncing data when connection is restored
5. Support two user flows: quiz selection OR direct quiz links
6. Enable save-and-continue-later functionality for incomplete surveys

### Success Metrics
- 100% functional offline mode for cached quizzes
- Less than 5 seconds average page load time on mobile
- At least 95% successful submission rate across all quizzes
- Accurate linkage of user identity (name, email, phone) to quiz responses
- Support for all question types: multiple-choice, checkboxes, rating scale, dropdowns, sliders, and text responses

---

## 3. User Stories

### Story 1: Standard Flow - Quiz Selection
**As a** course participant
**I want to** choose which quiz to complete from a selection of four options
**So that** I can provide feedback on the specific aspects of the course I want to comment on

### Story 2: Direct Link Flow - Specific Quiz
**As a** course organizer
**I want to** send participants a direct link to a specific quiz
**So that** I can gather targeted feedback on particular aspects of the course

### Story 3: Save and Continue Later
**As a** course participant
**I want to** save my progress and return later to complete the quiz
**So that** I can complete surveys when convenient without losing my responses

### Story 4: Offline Completion
**As a** course participant
**I want to** complete surveys even without internet connection
**So that** I can provide feedback immediately after the course regardless of connectivity

---

## 4. User Flows

### 4A. Standard Flow (Quiz Selection)

```
Landing Page (/)
  ↓ [Click "Start Survey"]
User Info Form (/start)
  ↓ [Submit name, email, phone]
Quiz Selection (/quizzes)
  ↓ [Choose quiz card]
Quiz Page (/quiz/[slug])
  ↓ [Complete & submit]
Thank You Page (/thank-you)
  ↓ [Option: Take another quiz or Exit]
```

### 4B. Alternate Flow (Direct Quiz Link)

```
Direct Quiz Link (/quiz/[slug])
  ↓ [Detect no user info in session]
User Info Form (/start?redirect=/quiz/[slug])
  ↓ [Submit name, email, phone]
Quiz Page (/quiz/[slug])
  ↓ [Complete & submit]
Thank You Page (/thank-you)
  ↓ [Option: Take another quiz or Exit]
```

**Technical Requirements for Alternate Flow:**
- When accessing `/quiz/[slug]` without user info in session, redirect to `/start?redirect=/quiz/[slug]`
- After user info submission, redirect to the original quiz URL
- Preserve quiz slug throughout the redirect chain
- All four quizzes must be accessible via direct links:
  - `/quiz/survey-30days`
  - `/quiz/survey-90days`
  - `/quiz/survey-180days`
  - `/quiz/survey-12months-final`

---

## 5. Functional Requirements

### FR-01: User Information Collection (High Priority)
The app must collect and validate user information:
- **Required fields:** Name, Email, Phone
- **Validation rules:**
  - Name: minimum 2 characters
  - Email: valid email format
  - Phone: valid US phone format (10 digits, various formats accepted)
- **Form layout:** Traditional vertical form with labeled input fields (Mantine TextInput components)
- **Error handling:** Real-time validation with clear error messages below each field
- **Storage:** Store in Supabase `users` table and retain in local session

### FR-02: Quiz Selection Interface (High Priority)
Display four quizzes in a card-based grid layout (2x2 on mobile, 1x4 row on desktop):
- Each card must display:
  - Icon representing quiz category
  - Quiz title
  - Brief description (1-2 sentences)
  - Visual selection state (purple border and checkmark when selected)
- Cards must be clickable and navigate to `/quiz/[slug]`
- Responsive grid: Stack vertically on mobile, horizontal grid on tablet/desktop

### FR-03: Question Type Support (High Priority)
The app must support the following question types, with UI determined during quiz creation:

1. **Multiple Choice (Radio Buttons)**
   - Single selection from 2-10 options
   - Visual styles: Card-based OR vertical radio list (determined per-question)
   - Icons optional for card-based style

2. **Checkboxes (Multi-Select)**
   - Multiple selections allowed from 2-10 options
   - Visual style: Card-based with checkmarks OR list with checkboxes

3. **Rating Scale**
   - 1-5, 1-7, or 1-10 point scales
   - Visual options: Star rating, number buttons, or slider
   - Display current rating value

4. **Dropdown Select**
   - Single selection from dropdown menu
   - Used for longer option lists (10+ items)
   - Searchable for 20+ items

5. **Slider (Range)**
   - Continuous or stepped numeric input
   - Display min, max, and current value
   - Visual marks for stepped values

6. **Text Input**
   - Short text: Single-line input (Mantine TextInput)
   - Long text: Multi-line textarea (Mantine Textarea)
   - Character count display for limited inputs
   - Optional minimum/maximum length validation

**Note:** During quiz creation, the system will prompt for specific UI style choices for each question type where multiple visual styles are available.

### FR-04: Progress Indication (High Priority)
Display dual progress indicators:
- **Top of page:** Progress bar with percentage (e.g., "13% Complete")
- **Top of page:** Question counter (e.g., "Question 1 of 8")
- Progress bar fills with primary brand color (#46597e)
- Updates automatically as user advances through questions

**Note:** Specific progress style (bar + percentage vs. pagination dots) will be determined during quiz creation.

### FR-05: Navigation Controls (High Priority)
- **Next Button:** Advances to next question (disabled until current question is answered)
- **Previous Button:** Returns to previous question (enabled except on first question)
- **Save & Continue Later:** Saves current progress to localStorage and provides resume link
- **Submit Button:** Appears on final question, submits all responses

Navigation buttons positioned at bottom of each question:
- Left: "Previous" button (gray, outline style)
- Right: "Next" or "Submit" button (purple, filled style)
- Center (mobile only): "Save & Continue Later" link

### FR-06: Save and Continue Later (High Priority)
- Generate unique resume token for incomplete surveys
- Store partial responses in localStorage with timestamp
- Provide shareable resume URL: `/quiz/[slug]/resume/[token]`
- Display saved progress on resume: "You left off at Question 3 of 8"
- Auto-save on navigation or every 30 seconds
- Resume links valid for 30 days

### FR-07: Data Persistence (High Priority)
- User info stored in `users` table (Supabase)
- Quiz responses stored in `quiz_responses` table (Supabase)
- Link each submission to user via `user_id` foreign key
- Store responses as JSONB with question IDs and answer values
- Include metadata: quiz_slug, submitted_at timestamp

### FR-08: Offline Support (High Priority)
- Cache all static pages and quiz definitions using service worker
- Queue submissions in IndexedDB when offline
- Display offline indicator banner
- Sync queued submissions when connection restored
- Notify user of successful sync

### FR-09: PWA Installability (High Priority)
- Valid manifest.json with app icons (192px, 512px)
- Service worker for offline functionality
- Installable on iOS, Android, and desktop
- Standalone display mode
- Theme color: #46597e (primary blue)
- Background color: #ffffff

### FR-10: Thank You Page (Medium Priority)
- Display success message with confirmation
- Show quiz completion summary
- Offer options:
  - "Take Another Quiz" → navigate to `/quizzes`
  - "View My Responses" (future enhancement)
  - "Exit" → return to landing page
- Display submission timestamp

### FR-11: Visual Design System (Medium Priority)
- **Color Palette:**
  - Primary: #46597e (blue) - [Mantine palette](https://mantine.dev/colors-generator/?color=46597e)
  - Accent: #F06418 (orange) - [Mantine palette](https://mantine.dev/colors-generator/?color=F06418)
- **UI Library:** Mantine v7+ components
- **Typography:** Mantine default font stack
- **Spacing:** Mantine spacing system (xs, sm, md, lg, xl)
- **Responsive breakpoints:** Mantine defaults (xs: 576px, sm: 768px, md: 992px, lg: 1200px, xl: 1408px)
- **Mobile-first design:** All layouts optimized for mobile, then scale up

### FR-12: Dynamic Quiz Loading (High Priority)
- Quiz definitions stored as JSON files in `/data/quizzes/`
- Each quiz file structure:
  ```json
  {
    "slug": "survey-30days",
    "title": "30-Day Follow-Up Survey",
    "description": "Share your experience 30 days after course completion",
    "icon": "calendar",
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "How would you rate the course content?",
        "options": [...],
        "required": true,
        "ui_style": "cards"
      }
    ]
  }
  ```
- Load quiz data dynamically based on URL slug
- Validate quiz structure on load
- Display error page for invalid/missing quizzes

---

## 6. Non-Goals (Out of Scope)

1. **Custom analytics dashboard** - Responses viewable in Supabase; custom dashboard is future enhancement
2. **Email confirmation workflows** - Will be added via n8n and Brevo later
3. **Multi-language support** - English only in v1
4. **User authentication** - Anonymous submission with required contact info only
5. **Quiz editing interface** - Quizzes defined in JSON files, edited manually in v1
6. **Response editing** - Once submitted, responses cannot be edited (future enhancement)
7. **Real-time collaboration** - Single-user experience only
8. **File uploads** - No attachment support in v1
9. **Quiz branching logic** - Linear question flow only (conditional logic is future enhancement)
10. **Admin portal** - Data access via Supabase dashboard only

---

## 7. Design Considerations

### 7.1 UI/UX Reference Images
The following design patterns should be implemented:

**Pattern 1: Card-Based Selection (for Quiz Selection & some question types)**
- Grid layout with icon, title, and description
- Visual feedback on hover (subtle shadow lift)
- Selected state: Purple border (2px) + checkmark icon in top-right
- Reference: Slothui productivity card example

**Pattern 2: Vertical Radio/Checkbox List (for some question types)**
- Clean vertical stack with clear option labels
- Large click targets (minimum 44px height)
- Selected state: Purple checkmark + light purple background
- Reference: Tech comfort level question example

**Pattern 3: Progress Indicators**
- Top bar: Solid color progress bar + percentage text
- Question counter displayed prominently
- Reference: "Question 1 of 8" and "13% Complete" example

### 7.2 Mantine Component Usage
- **Forms:** Mantine Form hook with validation
- **Inputs:** TextInput, Textarea, Select, Radio, Checkbox, Slider
- **Cards:** Card component for quiz selection and card-style questions
- **Buttons:** Button component with primary/secondary variants
- **Layout:** Stack, Group, Grid for responsive layouts
- **Feedback:** Notifications for success/error messages
- **Progress:** Progress component for completion bar

### 7.3 Responsive Design
- Mobile-first approach (320px minimum width)
- Breakpoint adaptations:
  - **Mobile (< 768px):** Single column, stacked cards, full-width buttons
  - **Tablet (768px - 992px):** 2-column grid for quiz cards
  - **Desktop (> 992px):** 4-column grid for quiz cards, wider content max-width

---

## 8. Technical Considerations

### 8.1 Architecture
- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript for type safety
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS)
- **Hosting:** Vercel for automatic deployments and PWA support
- **State Management:** React Context + localStorage for session data

### 8.2 API Routes
- **POST /api/user** - Create user record, return user_id
- **POST /api/quiz** - Submit quiz responses with user_id
- **GET /api/quiz/[slug]** - Load quiz definition (optional, could use static JSON)
- **POST /api/resume** - Generate resume token for incomplete quiz
- **GET /api/resume/[token]** - Load saved progress

### 8.3 Database Schema

**users table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

**quiz_responses table:**
```sql
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  quiz_slug TEXT NOT NULL,
  responses JSONB NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  resume_token TEXT UNIQUE,
  submitted_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 8.4 Dependencies
- `@mantine/core` - UI components
- `@mantine/form` - Form validation
- `@mantine/hooks` - Utility hooks
- `@supabase/supabase-js` - Database client
- `next-pwa` - PWA functionality

### 8.5 Performance Optimizations
- Code splitting by route
- Image optimization with Next.js Image component
- Quiz JSON preloaded and cached
- Service worker caching for offline-first experience
- Lazy load non-critical components

---

## 9. Success Metrics

### Launch Metrics (First 30 Days)
1. **Completion Rate:** 80%+ of started surveys are completed
2. **Load Performance:** <3s average load time on 3G mobile
3. **Offline Functionality:** 95%+ successful offline submission queuing
4. **Installation Rate:** 15%+ of users install PWA
5. **Technical Reliability:** 99%+ successful data submission rate

---

## 10. Open Questions

### Questions to Address During Quiz Creation
1. **Q1 Progress Style:** For each quiz, should we use progress bar + percentage OR pagination dots?
2. **Q2 Question UI Style:** For each multiple-choice question, should we use card layout OR vertical radio list?
3. **Q3 Rating Scale Style:** For rating questions, prefer star rating, number buttons, or slider?
4. **Q4 Icon Selection:** What icons should represent each quiz category?

---

## 11. Development Setup

### 11.1 Repository Setup
Clone the Mantine Next.js template:

```bash
git clone https://github.com/mantinedev/next-app-template.git course-survey-pwa
cd course-survey-pwa
```

### 11.2 Installation

```bash
pnpm install
```

### 11.3 Environment Configuration

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 11.4 Install Additional Dependencies

```bash
pnpm add @supabase/supabase-js next-pwa
```

### 11.5 Configure PWA

Edit `next.config.mjs`:
```js
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
```

Create `public/manifest.json`:
```json
{
  "name": "Course Survey App",
  "short_name": "SurveyPWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#46597e",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 11.6 Supabase Setup

Create Supabase client (`lib/supabaseClient.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 12. Milestones and Timeline

| Phase | Deliverable | Estimated Time |
|-------|-------------|----------------|
| **Phase 1** | Project Setup | 3-5 days |
| **Phase 2** | Core Pages | 5-7 days |
| **Phase 3** | Question Components | 7-10 days |
| **Phase 4** | Navigation & Progress | 3-5 days |
| **Phase 5** | Data Integration | 5-7 days |
| **Phase 6** | Offline Support | 5-7 days |
| **Phase 7** | Direct Link Flow | 2-3 days |
| **Phase 8** | Testing & QA | 7-10 days |
| **Phase 9** | Deployment | 2-3 days |
| **Total Estimate:** | | **6-8 weeks** |

---

## Appendix A: Quiz JSON Schema

```typescript
interface Quiz {
  slug: string;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  questions: Question[];
}

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  ui_style?: 'cards' | 'radio-list' | 'checkbox-list' | 'stars' | 'numbers' | 'slider';
  show_icons?: boolean;
  icons?: string[];
}

type QuestionType =
  | 'multiple-choice'
  | 'checkbox'
  | 'rating'
  | 'dropdown'
  | 'slider'
  | 'text-short'
  | 'text-long';
```

---

**END OF PRD**
