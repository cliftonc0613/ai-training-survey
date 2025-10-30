# Deployment Guide - Vercel Production Setup

This guide covers deploying the AI Training Survey PWA to Vercel for production use.

## Prerequisites

- ✅ All tests passing
- ✅ Supabase project configured
- ✅ GitHub repository created
- ✅ Vercel account (free tier works)

## Phase 10.1 - Create Vercel Account & Connect GitHub

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. From Vercel dashboard, click "Add New Project"
2. Select "Import Git Repository"
3. Choose your GitHub repository: `ai-training-survey`
4. Click "Import"

### Step 3: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave default)

**Build Command**: `npm run build`

**Output Directory**: `.next` (auto-detected)

**Install Command**: `npm install`

---

## Phase 10.2 - Configure Environment Variables

### Required Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto-generated-by-vercel
```

### How to Add Environment Variables

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"
4. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important**: Use the `anon` key (not the `service_role` key)

---

## Phase 10.3 - Deploy to Production

### Automatic Deployment

Vercel automatically deploys when you:
- Push to main branch (production)
- Push to any branch (preview deployment)
- Create a pull request (preview deployment)

### Manual Deployment

From Vercel Dashboard:

1. Go to your project
2. Click "Deployments" tab
3. Click "Redeploy" on any previous deployment
4. Or push new commit to trigger deployment

### Deployment Process

```bash
# Vercel automatically runs:
1. npm install
2. npm run build
3. Deploy to Edge network
4. Generate deployment URL
```

### Deployment URL

Your app will be available at:
- **Production**: `https://your-project.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

---

## Phase 10.4 - Verify Supabase Connection

### Test Database Connection

1. Open production URL: `https://your-project.vercel.app`
2. Click "Start Survey"
3. Fill out registration form
4. Click "Continue"

**Expected Result**: Should redirect to `/quizzes` page

### Verify in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **users**
3. Verify new user record was created

### Troubleshooting Connection Issues

**Error**: "Failed to fetch"
- Check environment variables are set correctly
- Verify Supabase URL has `https://`
- Confirm anon key is correct

**Error**: "Invalid API key"
- Double-check you're using the `anon` key, not `service_role`
- Regenerate keys in Supabase if needed

---

## Phase 10.5 - Test All User Flows

### Critical User Flows to Test

1. **Registration Flow**
   ```
   Homepage → Start Survey → Fill Form → Submit → Quizzes List
   ```

2. **Quiz Completion Flow**
   ```
   Select Quiz → Answer Questions → Submit → Thank You Page
   ```

3. **Resume Flow**
   ```
   Use Resume Link → Resume Quiz → Complete → Submit
   ```

4. **Offline Flow**
   ```
   Enable Offline → Submit Response → Go Online → Verify Sync
   ```

### Testing Checklist

- [ ] Homepage loads correctly
- [ ] Registration form works
- [ ] Resume token is generated
- [ ] Quizzes list displays
- [ ] Quiz questions load
- [ ] Can answer all question types
- [ ] Quiz submission works
- [ ] Data saves to Supabase
- [ ] Offline mode works
- [ ] Background sync functions
- [ ] Resume links work

---

## Phase 10.6 - Validate PWA Installation

### Test PWA Installation on Desktop

**Chrome/Edge**:
1. Open production URL
2. Click install icon in address bar (⊕)
3. Click "Install"
4. App opens as standalone window

**Safari (macOS)**:
1. Open production URL
2. File → Add to Dock
3. App appears in Dock

### Test PWA Installation on Mobile

**iOS Safari**:
1. Open production URL
2. Tap Share button
3. Tap "Add to Home Screen"
4. App icon appears on home screen

**Android Chrome**:
1. Open production URL
2. Tap menu (⋮)
3. Tap "Install app" or "Add to Home Screen"
4. App icon appears on home screen

### PWA Requirements Checklist

- [ ] `manifest.json` served correctly
- [ ] Service worker registers
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Icons (192x192, 512x512) available
- [ ] Theme color set
- [ ] Offline page works

---

## Phase 10.7 - Run Lighthouse Audit

### Running Lighthouse

**From Chrome DevTools**:
1. Open production URL in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "Progressive Web App"
5. Click "Analyze page load"

### Target Scores

- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90
- **PWA**: ≥ 90 (Required for task completion)

### Lighthouse CLI

```bash
npx lighthouse https://your-project.vercel.app \
  --output=html \
  --output-path=./lighthouse-production.html \
  --view
```

### Common Issues

**PWA Score < 90**:
- Ensure service worker is registered
- Check manifest.json is valid
- Verify offline page exists

**Performance Score < 90**:
- Enable Vercel Analytics
- Check image optimization
- Verify Edge CDN is working

---

## Phase 10.8 - Configure Custom Domain (Optional)

### Add Custom Domain

1. Go to Project Settings → Domains
2. Enter your domain: `your-domain.com`
3. Click "Add"

### Configure DNS

**Using Vercel DNS** (Recommended):
1. Vercel provides nameservers
2. Update nameservers at your domain registrar
3. Wait for DNS propagation (up to 48 hours)

**Using External DNS**:

Add these DNS records at your registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate

- **Automatic**: Vercel provisions SSL automatically
- **Custom**: Upload your own certificate in Project Settings

---

## Phase 10.9 - Configure Analytics & Monitoring

### Vercel Analytics

**Enable Analytics**:
1. Go to Project Settings → Analytics
2. Click "Enable Analytics"
3. Analytics automatically configured

**View Analytics**:
- Real User Monitoring (RUM)
- Core Web Vitals
- Page views
- Unique visitors

### Vercel Speed Insights

```typescript
// Already installed in package.json
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Monitoring (Optional)

**Integrate Sentry**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Phase 10.10 - Deployment Documentation

### For Developers

**Quick Deploy**:
```bash
git push origin main
# Vercel automatically deploys
```

**Deploy Specific Branch**:
```bash
git push origin feature/new-feature
# Vercel creates preview deployment
```

**Rollback Deployment**:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click menu (⋯) → "Promote to Production"

### Environment Management

**Production**: `main` branch
**Staging**: `develop` branch (configure in Vercel)
**Preview**: All other branches

---

## Phase 10.11 - User Guide for Sending Quiz Links

### Creating Quiz Links

**Direct Quiz Link Format**:
```
https://your-domain.com/quiz/[quiz-id]
```

**Example**:
```
https://ai-survey.vercel.app/quiz/survey-30days
```

### Sending Quiz Links to Users

**Via Email**:
```
Subject: Complete Your AI Training Survey

Hi [Name],

Please complete your post-training survey using the link below:

https://your-domain.com/quiz/survey-30days

The survey takes approximately 5-10 minutes.

Your unique resume code will be provided after registration
in case you need to pause and continue later.

Thank you!
```

**Via SMS**:
```
Complete your AI training survey: https://your-domain.com/quiz/survey-30days
Estimated time: 5-10 min
```

### Resume Link Format

After user registers, they receive a resume token:
```
https://your-domain.com/quiz/[quiz-id]/resume/[token]
```

**Example**:
```
https://ai-survey.vercel.app/quiz/survey-30days/resume/ABC123-XYZ789
```

---

## Phase 10.12 - Admin Guide for Viewing Responses

### Accessing Quiz Responses

**Via Supabase Dashboard**:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Table Editor**
4. Select `quiz_responses` table

### Viewing Response Data

**Columns**:
- `id`: Unique response ID
- `quiz_id`: Which quiz was taken
- `user_id`: User who submitted (links to `users` table)
- `responses`: JSONB array of answers
- `completed_at`: Submission timestamp
- `progress`: Completion percentage

### Exporting Data

**Export to CSV**:
1. In Table Editor, select `quiz_responses`
2. Click "Export" button (top right)
3. Choose "CSV"
4. Download file

**Export via SQL**:
```sql
-- Get all responses with user info
SELECT
  qr.id,
  qr.quiz_id,
  u.name,
  u.email,
  qr.responses,
  qr.completed_at
FROM quiz_responses qr
JOIN users u ON qr.user_id = u.id
WHERE qr.completed_at IS NOT NULL
ORDER BY qr.completed_at DESC;
```

### Analytics Queries

**Response Rate**:
```sql
SELECT
  quiz_id,
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed,
  ROUND(COUNT(*) FILTER (WHERE completed_at IS NOT NULL)::numeric / COUNT(*) * 100, 2) as completion_rate
FROM quiz_responses
GROUP BY quiz_id;
```

**Average Completion Time**:
```sql
SELECT
  quiz_id,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) as avg_minutes
FROM quiz_responses
WHERE completed_at IS NOT NULL
GROUP BY quiz_id;
```

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Supabase database migrations applied
- [ ] Quiz data seeded in Supabase
- [ ] All tests passing locally
- [ ] Production deployment successful
- [ ] Can register new user in production
- [ ] Can complete quiz in production
- [ ] Data appears in Supabase
- [ ] PWA installable
- [ ] Lighthouse PWA score > 90
- [ ] Offline mode works
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Team has access to Supabase dashboard
- [ ] Admin guide shared with team

---

## Troubleshooting

### Build Failures

**Error**: "Module not found"
```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

**Error**: "Environment variable not found"
- Verify all `NEXT_PUBLIC_*` variables are set in Vercel
- Redeploy after adding variables

### Runtime Errors

**Error**: "Supabase client not initialized"
- Check environment variables are accessible
- Verify URL starts with `https://`

**Error**: "Failed to fetch"
- Check CORS settings in Supabase
- Verify Supabase project is not paused

### Performance Issues

**Slow load times**:
- Check Vercel Analytics for bottlenecks
- Enable Edge Network features
- Optimize images with Next.js Image component

---

## Support

### Vercel Support
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)
- Community: [github.com/vercel/next.js](https://github.com/vercel/next.js)

### Supabase Support
- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub: [github.com/supabase](https://github.com/supabase)

---

## Quick Reference

```bash
# Deploy to production
git push origin main

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls

# Pull production database backup
# (Configure in Supabase Dashboard)

# Run Lighthouse audit
npx lighthouse https://your-domain.com --view
```
