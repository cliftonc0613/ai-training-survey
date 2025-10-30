# Performance Testing Guide

This guide explains how to run performance tests and optimize the PWA to meet the <3s load time requirement.

## Performance Requirements (PRD)

**Target**: Page load time <3 seconds

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1
- **FCP** (First Contentful Paint): <1.8s
- **TTI** (Time to Interactive): <3.0s

## Running Performance Tests

### Automated Performance Tests

```bash
# Run all performance tests
npx playwright test __tests__/e2e/performance.spec.ts

# Run specific test
npx playwright test -g "homepage should meet"

# Run with specific browser
npx playwright test performance.spec.ts --project=chromium
```

### Manual Lighthouse Audit

```bash
# Using Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance" + "Progressive Web App"
4. Click "Analyze page load"

# Using CLI
npx lighthouse http://localhost:3000 --view
```

## Test Coverage (16 Performance Tests)

### Page Load Performance (3 tests)
1. **Homepage Load** - Page loads in <3s
2. **Registration Page** - Form page loads quickly
3. **Quizzes Page** - Authenticated page performance

### Resource Optimization (4 tests)
4. **Bundle Size** - JS <500KB, CSS <100KB
5. **Image Optimization** - Images not over-sized
6. **Font Loading** - Fonts load in <500ms
7. **Resource Count** - <50 total resources

### Core Web Vitals (3 tests)
8. **Web Vitals** - FCP, LCP, CLS meet targets
9. **Layout Shift** - CLS <0.1
10. **Time to Interactive** - TTI <3s

### Performance Metrics (6 tests)
11. **API Response Time** - API calls <1s
12. **JavaScript Execution** - Execution <1s
13. **Cache Performance** - Resources cached on reload
14. **Third-party Scripts** - Minimal blocking scripts
15. **Mobile Performance** - Mobile load <3s
16. **Rendering** - No render-blocking resources

## Performance Budgets

### JavaScript
- **Initial Bundle**: <500KB (gzipped)
- **Route Bundles**: <200KB each
- **Total JS**: <1MB

### CSS
- **Critical CSS**: <15KB inline
- **Total CSS**: <100KB

### Images
- **Hero Images**: <200KB
- **Icons**: <50KB total
- **Total Images**: <500KB per page

### Fonts
- **Font Files**: <100KB total
- **Font Load Time**: <500ms

## Optimization Strategies

### 1. Code Splitting

Next.js automatically code-splits by route:

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loader />,
});
```

### 2. Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-fold images
/>
```

### 3. Font Optimization

Use `next/font`:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

### 4. Bundle Analysis

```bash
npm run analyze
```

This generates a bundle size report.

### 5. Lazy Loading

```typescript
// Lazy load non-critical components
const Analytics = lazy(() => import('./Analytics'));

<Suspense fallback={<div>Loading...</div>}>
  <Analytics />
</Suspense>
```

## Lighthouse Scores

### Target Scores

- **Performance**: ≥90
- **Accessibility**: ≥90
- **Best Practices**: ≥90
- **SEO**: ≥90
- **PWA**: ≥80

### Running Lighthouse

```bash
# Generate full report
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --view
```

### Lighthouse CI

Configure in `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

## Performance Monitoring

### Browser DevTools

**Performance Tab**:
1. Record page load
2. Analyze main thread activity
3. Identify long tasks
4. Check network waterfall

**Network Tab**:
1. Check resource sizes
2. Verify caching headers
3. Identify slow requests
4. Monitor bundle sizes

### Real User Monitoring

```typescript
// Track Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Common Performance Issues

### 1. Large JavaScript Bundles

**Problem**: Bundle size >500KB

**Solutions**:
- Enable tree-shaking
- Remove unused dependencies
- Use dynamic imports
- Enable code splitting

```typescript
// Before
import { hugeLibrary } from 'huge-library';

// After
const hugeLibrary = dynamic(() => import('huge-library'), {
  ssr: false,
});
```

### 2. Unoptimized Images

**Problem**: Large image files

**Solutions**:
- Use WebP format
- Compress images
- Use responsive images
- Lazy load below-fold images

```tsx
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  loading="lazy" // Lazy load
  quality={85} // Compress
/>
```

### 3. Render-Blocking Resources

**Problem**: CSS/JS blocks rendering

**Solutions**:
- Inline critical CSS
- Defer non-critical JS
- Use async/defer attributes
- Split CSS by route

```tsx
// Defer non-critical scripts
<Script
  src="/analytics.js"
  strategy="lazyOnload"
/>
```

### 4. Slow API Responses

**Problem**: API calls >1s

**Solutions**:
- Cache API responses
- Use SWR/React Query
- Implement optimistic updates
- Add loading states

```typescript
// Use SWR for caching
import useSWR from 'swr';

const { data, error } = useSWR('/api/quizzes', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
});
```

### 5. Layout Shifts

**Problem**: CLS >0.1

**Solutions**:
- Reserve space for images
- Avoid inserting content above existing
- Use fixed dimensions
- Preload fonts

```tsx
// Reserve space
<div style={{ aspectRatio: '16/9' }}>
  <Image src="/photo.jpg" fill alt="Photo" />
</div>
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm start & # Start server
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test performance.spec.ts
      - run: npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse.json
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: lighthouse.json
```

## Performance Checklist

### Build Time
- [ ] Enable production mode
- [ ] Minify JavaScript
- [ ] Optimize images
- [ ] Remove console.log
- [ ] Enable compression

### Runtime
- [ ] Use code splitting
- [ ] Lazy load images
- [ ] Cache API responses
- [ ] Preload critical resources
- [ ] Defer non-critical scripts

### Deployment
- [ ] Enable CDN
- [ ] Configure caching headers
- [ ] Use HTTP/2
- [ ] Enable compression (gzip/brotli)
- [ ] Set up monitoring

## Next.js Specific Optimizations

### 1. Static Generation

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  const quizzes = await getQuizzes();
  return quizzes.map((quiz) => ({
    id: quiz.id,
  }));
}
```

### 2. Incremental Static Regeneration

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### 3. Streaming SSR

```typescript
// Use Suspense for streaming
<Suspense fallback={<Skeleton />}>
  <QuizList />
</Suspense>
```

### 4. Edge Functions

Deploy API routes to the edge:

```typescript
export const runtime = 'edge';
```

## Monitoring Tools

### Development
- **Chrome DevTools** - Built-in performance profiler
- **React DevTools** - Component profiling
- **Lighthouse** - Automated audits
- **WebPageTest** - Detailed analysis

### Production
- **Vercel Analytics** - Real user metrics
- **Google Analytics** - Web Vitals tracking
- **Sentry** - Error + performance monitoring
- **New Relic** - APM solution

## Performance Regression Prevention

### 1. Performance Budget

Set in `next.config.js`:

```javascript
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.performance = {
      maxAssetSize: 500000, // 500KB
      maxEntrypointSize: 500000,
    };
    return config;
  },
};
```

### 2. Bundle Size Tracking

```bash
# Generate bundle analysis
npm run analyze

# Check bundle size change
npx bundlewatch
```

### 3. Automated Testing

Run performance tests in CI:

```bash
npm run test:e2e -- performance.spec.ts
```

## Resources

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [web-vitals](https://www.npmjs.com/package/web-vitals)

### Documentation
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Mantine Performance](https://mantine.dev/guides/performance/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Best Practices
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/performance)

## Quick Reference

### Run Performance Tests
```bash
npx playwright test performance.spec.ts
```

### Run Lighthouse
```bash
npx lighthouse http://localhost:3000 --view
```

### Analyze Bundle
```bash
npm run analyze
```

### Check Web Vitals
```bash
# Open DevTools → Performance → Record page load
# Look for Core Web Vitals in the summary
```
