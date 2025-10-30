import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouse from 'lighthouse';
import { URL } from 'url';

// Performance thresholds based on PRD requirements
const PERFORMANCE_THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
  pwa: 80,
};

// Custom thresholds for specific metrics
const METRIC_THRESHOLDS = {
  'first-contentful-paint': 1800, // 1.8s
  'largest-contentful-paint': 2500, // 2.5s
  'total-blocking-time': 200, // 200ms
  'cumulative-layout-shift': 0.1,
  'speed-index': 3000, // 3s (PRD requirement)
  'interactive': 3000, // 3s time to interactive
};

test.describe('Performance Tests', () => {
  test('homepage should meet performance budgets', async ({ page, browser }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
      };
    });

    // Verify metrics meet thresholds
    expect(metrics.domInteractive).toBeLessThan(3000); // DOM Interactive < 3s
    expect(metrics.firstPaint).toBeLessThan(1800); // First Paint < 1.8s
  });

  test('registration page should load quickly', async ({ page }) => {
    await page.goto('/start');
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      };
    });

    // Page should load in under 3 seconds
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('quizzes page should load efficiently after registration', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Performance Test');
    await page.getByLabel(/email/i).fill('perf@example.com');
    await page.getByLabel(/phone/i).fill('5551234567');
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for quizzes page
    await page.waitForURL('/quizzes', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      };
    });

    expect(metrics.loadTime).toBeLessThan(3000);
  });

  test('bundle size should be reasonable', async ({ page }) => {
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.map((r) => ({
        name: r.name,
        size: r.transferSize,
        type: r.initiatorType,
      }));
    });

    // Calculate total JavaScript size
    const jsSize = resourceSizes
      .filter((r) => r.name.includes('.js'))
      .reduce((acc, r) => acc + r.size, 0);

    // Calculate total CSS size
    const cssSize = resourceSizes
      .filter((r) => r.name.includes('.css'))
      .reduce((acc, r) => acc + r.size, 0);

    // Total JS should be under 500KB (initial load)
    expect(jsSize).toBeLessThan(500000);

    // Total CSS should be under 100KB
    expect(cssSize).toBeLessThan(100000);
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');

    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map((img) => ({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        displayWidth: img.width,
        displayHeight: img.height,
      }));
    });

    // Check that images are not over-sized
    imageMetrics.forEach((img) => {
      if (img.width && img.displayWidth) {
        const ratio = img.width / img.displayWidth;
        // Images should not be more than 2x their display size
        expect(ratio).toBeLessThan(2);
      }
    });
  });

  test('API requests should complete quickly', async ({ page }) => {
    const apiTimes: number[] = [];

    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        const timing = response.timing();
        apiTimes.push(timing.responseEnd);
      }
    });

    await page.goto('/start');
    await page.getByLabel(/name/i).fill('API Test User');
    await page.getByLabel(/email/i).fill('apitest@example.com');
    await page.getByLabel(/phone/i).fill('5559999999');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForTimeout(2000);

    // API requests should complete in under 1 second
    apiTimes.forEach((time) => {
      expect(time).toBeLessThan(1000);
    });
  });

  test('page should have minimal layout shift', async ({ page }) => {
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    const layoutShift = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsScore += (entry as any).value;
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsScore);
        }, 1000);
      });
    });

    // CLS should be under 0.1 (good)
    expect(layoutShift).toBeLessThan(0.1);
  });

  test('web vitals should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const webVitals = await page.evaluate(() => {
      return new Promise<any>((resolve) => {
        const vitals: any = {};

        // FCP - First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          vitals.fcp = entries[0]?.startTime;
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // LCP - Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          vitals.lcp = lastEntry?.startTime;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // FID would require user interaction, skipping in automated test

        // CLS - Cumulative Layout Shift
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          vitals.cls = cls;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          resolve(vitals);
        }, 3000);
      });
    });

    // Core Web Vitals thresholds
    if (webVitals.fcp) {
      expect(webVitals.fcp).toBeLessThan(1800); // FCP < 1.8s (good)
    }
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(2500); // LCP < 2.5s (good)
    }
    if (webVitals.cls !== undefined) {
      expect(webVitals.cls).toBeLessThan(0.1); // CLS < 0.1 (good)
    }
  });

  test('fonts should load efficiently', async ({ page }) => {
    await page.goto('/');

    const fontMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const fonts = resources.filter((r) => r.name.includes('.woff') || r.name.includes('.woff2'));
      return fonts.map((f) => ({
        name: f.name,
        duration: f.duration,
        size: f.transferSize,
      }));
    });

    // Fonts should load quickly
    fontMetrics.forEach((font) => {
      expect(font.duration).toBeLessThan(500); // Each font < 500ms
    });
  });

  test('third-party scripts should not block rendering', async ({ page }) => {
    const blockingResources: string[] = [];

    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (resourceType === 'script' || resourceType === 'stylesheet') {
        const url = request.url();
        // Check if it's a third-party resource
        if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
          blockingResources.push(url);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Should have minimal third-party blocking resources
    expect(blockingResources.length).toBeLessThan(5);
  });

  test('JavaScript execution time should be minimal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const jsExecutionTime = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return perfData.domInteractive - perfData.responseEnd;
    });

    // JS execution should be under 1 second
    expect(jsExecutionTime).toBeLessThan(1000);
  });

  test('cached resources should load from cache', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Second visit (should use cache)
    await page.reload();
    await page.waitForLoadState('networkidle');

    const cachedResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.filter((r) => r.transferSize === 0).length;
    });

    // Should have some cached resources on second load
    expect(cachedResources).toBeGreaterThan(0);
  });

  test('mobile performance should be acceptable', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      };
    });

    // Mobile should still load in under 3 seconds
    expect(metrics.loadTime).toBeLessThan(3000);
  });

  test('Time to Interactive should meet target', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tti = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return perfData.domInteractive - perfData.fetchStart;
    });

    // TTI should be under 3 seconds (PRD requirement)
    expect(tti).toBeLessThan(3000);
  });

  test('resource count should be reasonable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resourceCount = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    // Should not load excessive resources
    expect(resourceCount).toBeLessThan(50);
  });
});
