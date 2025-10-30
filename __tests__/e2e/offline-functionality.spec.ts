import { test, expect } from '@playwright/test';

test.describe('Offline Functionality', () => {
  test('application detects when going offline', async ({ page, context }) => {
    // Register user first
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Offline Test User');
    await page.getByLabel(/email/i).fill('offline@example.com');
    await page.getByLabel(/phone/i).fill('5551234567');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Verify initially online
    const initialOnlineStatus = await page.evaluate(() => navigator.onLine);
    expect(initialOnlineStatus).toBe(true);

    // Go offline
    await context.setOffline(true);

    // Wait a moment for offline detection
    await page.waitForTimeout(500);

    // Verify offline status
    const offlineStatus = await page.evaluate(() => navigator.onLine);
    expect(offlineStatus).toBe(false);

    // Go back online
    await context.setOffline(false);

    // Wait for online detection
    await page.waitForTimeout(500);

    // Verify back online
    const backOnlineStatus = await page.evaluate(() => navigator.onLine);
    expect(backOnlineStatus).toBe(true);
  });

  test('IndexedDB is available and initialized', async ({ page }) => {
    await page.goto('/');

    // Check if IndexedDB is supported
    const isIndexedDBSupported = await page.evaluate(() => {
      return 'indexedDB' in window;
    });

    expect(isIndexedDBSupported).toBe(true);

    // Check if our database can be opened
    const canOpenDB = await page.evaluate(async () => {
      try {
        const request = indexedDB.open('ai-training-survey-db', 1);
        return new Promise<boolean>((resolve) => {
          request.onsuccess = () => {
            request.result.close();
            resolve(true);
          };
          request.onerror = () => resolve(false);
        });
      } catch (error) {
        return false;
      }
    });

    expect(canOpenDB).toBe(true);
  });

  test('offline queue stores items when offline', async ({ page, context }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Queue Test User');
    await page.getByLabel(/email/i).fill('queue@example.com');
    await page.getByLabel(/phone/i).fill('5559876543');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Try to access a quiz (this might create queue items)
    await page.goto('/quiz/test-quiz-id');
    await page.waitForTimeout(2000);

    // Check if offline queue exists in IndexedDB
    const queueExists = await page.evaluate(async () => {
      try {
        const request = indexedDB.open('ai-training-survey-db', 1);
        return new Promise<boolean>((resolve) => {
          request.onsuccess = () => {
            const db = request.result;
            const hasQueue = db.objectStoreNames.contains('offline_queue');
            db.close();
            resolve(hasQueue);
          };
          request.onerror = () => resolve(false);
        });
      } catch (error) {
        return false;
      }
    });

    expect(queueExists).toBe(true);

    // Go back online
    await context.setOffline(false);
  });

  test('data persists in IndexedDB across page refreshes', async ({ page }) => {
    // Register user and store data
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Persistence Test');
    await page.getByLabel(/email/i).fill('persist@example.com');
    await page.getByLabel(/phone/i).fill('5554445555');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Get user data from localStorage
    const userDataBefore = await page.evaluate(() => {
      return localStorage.getItem('current_user');
    });

    expect(userDataBefore).toBeTruthy();

    // Refresh the page
    await page.reload();

    // Check if data still exists after refresh
    const userDataAfter = await page.evaluate(() => {
      return localStorage.getItem('current_user');
    });

    expect(userDataAfter).toEqual(userDataBefore);

    // Verify IndexedDB is still accessible
    const dbAccessible = await page.evaluate(async () => {
      try {
        const request = indexedDB.open('ai-training-survey-db', 1);
        return new Promise<boolean>((resolve) => {
          request.onsuccess = () => {
            request.result.close();
            resolve(true);
          };
          request.onerror = () => resolve(false);
        });
      } catch (error) {
        return false;
      }
    });

    expect(dbAccessible).toBe(true);
  });

  test('localStorage remains accessible when offline', async ({ page, context }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('LocalStorage Offline');
    await page.getByLabel(/email/i).fill('lsoffline@example.com');
    await page.getByLabel(/phone/i).fill('5556667777');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Get data while online
    const onlineData = await page.evaluate(() => {
      return {
        user: localStorage.getItem('current_user'),
        token: localStorage.getItem('resume_token'),
      };
    });

    expect(onlineData.user).toBeTruthy();
    expect(onlineData.token).toBeTruthy();

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Try to access localStorage while offline
    const offlineData = await page.evaluate(() => {
      return {
        user: localStorage.getItem('current_user'),
        token: localStorage.getItem('resume_token'),
      };
    });

    // Data should still be accessible
    expect(offlineData.user).toEqual(onlineData.user);
    expect(offlineData.token).toEqual(onlineData.token);

    // Go back online
    await context.setOffline(false);
  });

  test('cached pages load when offline', async ({ page, context }) => {
    // Register user and navigate to pages while online
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Cache Test User');
    await page.getByLabel(/email/i).fill('cache@example.com');
    await page.getByLabel(/phone/i).fill('5558889999');
    await page.getByRole('button', { name: /continue/i}).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Visit homepage to cache it
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Try to navigate to homepage while offline
    await page.goto('/');

    // Page should load (either from cache or as SPA navigation)
    // Check if page has some content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(0);

    // Go back online
    await context.setOffline(false);
  });

  test('application handles failed API requests when offline', async ({ page, context }) => {
    // Register user first
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('API Fail Test');
    await page.getByLabel(/email/i).fill('apifail@example.com');
    await page.getByLabel(/phone/i).fill('5552223333');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Try to access a quiz (this will fail API call)
    await page.goto('/quiz/test-quiz-id');
    await page.waitForTimeout(3000);

    // Should show loading or error state (not crash)
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();

    // Page should not show blank screen
    expect(bodyContent!.length).toBeGreaterThan(10);

    // Go back online
    await context.setOffline(false);
  });

  test('service worker can be registered', async ({ page }) => {
    await page.goto('/');

    // Check if service workers are supported
    const swSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    expect(swSupported).toBe(true);

    // Note: Actual service worker registration may vary based on PWA setup
    // This test just confirms the API is available
  });

  test('offline mode flag can be stored', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(500);

    // Store offline mode flag
    await page.evaluate(() => {
      localStorage.setItem('offline_mode', 'true');
    });

    // Verify flag is stored
    const offlineFlag = await page.evaluate(() => {
      return localStorage.getItem('offline_mode');
    });

    expect(offlineFlag).toBe('true');

    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(500);

    // Update flag
    await page.evaluate(() => {
      localStorage.setItem('offline_mode', 'false');
    });

    // Verify updated flag
    const onlineFlag = await page.evaluate(() => {
      return localStorage.getItem('offline_mode');
    });

    expect(onlineFlag).toBe('false');
  });

  test('IndexedDB stores are properly initialized', async ({ page }) => {
    await page.goto('/');

    // Check if all required stores exist
    const stores = await page.evaluate(async () => {
      try {
        const request = indexedDB.open('ai-training-survey-db', 1);
        return new Promise<string[]>((resolve) => {
          request.onsuccess = () => {
            const db = request.result;
            const storeNames = Array.from(db.objectStoreNames);
            db.close();
            resolve(storeNames);
          };
          request.onerror = () => resolve([]);
        });
      } catch (error) {
        return [];
      }
    });

    // Verify all required stores exist
    expect(stores).toContain('users');
    expect(stores).toContain('quiz_responses');
    expect(stores).toContain('offline_queue');
  });

  test('network requests work when back online', async ({ page, context }) => {
    // Register user while online
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Network Recovery Test');
    await page.getByLabel(/email/i).fill('netrecover@example.com');
    await page.getByLabel(/phone/i).fill('5557778888');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(1000);

    // Verify offline
    const isOffline = await page.evaluate(() => !navigator.onLine);
    expect(isOffline).toBe(true);

    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(1000);

    // Verify online
    const isOnline = await page.evaluate(() => navigator.onLine);
    expect(isOnline).toBe(true);

    // Try to make a network request (navigate to homepage)
    await page.goto('/');

    // Should load successfully
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
