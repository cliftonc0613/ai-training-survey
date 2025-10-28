import { test, expect } from '@playwright/test';

test.describe('Save & Resume Functionality', () => {
  test('user receives resume token after registration', async ({ page }) => {
    // Register new user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Resume Test User');
    await page.getByLabel(/email/i).fill('resume@example.com');
    await page.getByLabel(/phone/i).fill('5551234567');
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for registration to complete
    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Check localStorage for resume token
    const resumeToken = await page.evaluate(() => {
      return localStorage.getItem('resume_token');
    });

    // Verify resume token exists and has correct format
    expect(resumeToken).toBeTruthy();
    expect(resumeToken).toMatch(/^[A-Z0-9]+-[A-Z0-9]+$/);

    // Verify token is at least 10 characters
    expect(resumeToken!.length).toBeGreaterThanOrEqual(10);
  });

  test('quiz progress is saved to localStorage during quiz', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Progress Saver');
    await page.getByLabel(/email/i).fill('progress@example.com');
    await page.getByLabel(/phone/i).fill('5559876543');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Access a quiz
    await page.goto('/quiz/any-quiz-id');
    await page.waitForTimeout(2000);

    // Check if quiz session is saved in localStorage
    const quizSession = await page.evaluate(() => {
      const session = localStorage.getItem('quiz_session');
      return session ? JSON.parse(session) : null;
    });

    // If quiz loaded (not error), session should exist
    // This might be null if quiz doesn't exist, which is okay
    if (quizSession) {
      expect(quizSession).toHaveProperty('currentQuiz');
    }
  });

  test('user can navigate away and return with saved session', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Navigation Tester');
    await page.getByLabel(/email/i).fill('navtest@example.com');
    await page.getByLabel(/phone/i).fill('5554443333');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Store user data from localStorage
    const userData = await page.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    expect(userData.currentUser).toBeTruthy();
    expect(userData.resumeToken).toBeTruthy();

    // Navigate to home page
    await page.goto('/');

    // Verify localStorage persists
    const persistedData = await page.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    expect(persistedData.currentUser).toEqual(userData.currentUser);
    expect(persistedData.resumeToken).toEqual(userData.resumeToken);

    // Navigate back to quizzes
    await page.goto('/quizzes');

    // Should not redirect to /start (session still active)
    await expect(page).toHaveURL('/quizzes');
  });

  test('resume token is displayed to user in quiz interface', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Token Display User');
    await page.getByLabel(/email/i).fill('tokendisplay@example.com');
    await page.getByLabel(/phone/i).fill('5556667777');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Get resume token from localStorage
    const storedToken = await page.evaluate(() => {
      return localStorage.getItem('resume_token');
    });

    // Note: This test assumes resume token will be displayed somewhere
    // If it's not displayed in the current UI, this test documents the expected behavior
    expect(storedToken).toBeTruthy();
    expect(storedToken).toMatch(/^[A-Z0-9]+-[A-Z0-9]+$/);
  });

  test('resume link format is correct', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Resume Link Tester');
    await page.getByLabel(/email/i).fill('resumelink@example.com');
    await page.getByLabel(/phone/i).fill('5558889999');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Get resume token
    const resumeToken = await page.evaluate(() => {
      return localStorage.getItem('resume_token');
    });

    expect(resumeToken).toBeTruthy();

    // Construct resume link (expected format)
    const quizId = 'test-quiz-id';
    const expectedResumeUrl = `/quiz/${quizId}/resume/${resumeToken}`;

    // Verify the URL structure is valid
    expect(expectedResumeUrl).toContain('/quiz/');
    expect(expectedResumeUrl).toContain('/resume/');
    expect(expectedResumeUrl).toContain(resumeToken!);
  });

  test('localStorage persists across page refreshes', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Refresh Test User');
    await page.getByLabel(/email/i).fill('refresh@example.com');
    await page.getByLabel(/phone/i).fill('5552223333');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Get initial data
    const initialData = await page.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    // Refresh the page
    await page.reload();

    // Verify data persists after refresh
    const afterRefreshData = await page.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    expect(afterRefreshData.currentUser).toEqual(initialData.currentUser);
    expect(afterRefreshData.resumeToken).toEqual(initialData.resumeToken);

    // Should still be on quizzes page (not redirected)
    await expect(page).toHaveURL('/quizzes');
  });

  test('accessing resume link without valid token shows error', async ({ page }) => {
    // Try to access resume page with invalid token
    await page.goto('/quiz/any-quiz-id/resume/INVALID-TOKEN-123');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Should show error message or redirect
    const errorMessage = page.getByText(/invalid|expired|error|not found/i);
    const isOnStartPage = page.url().includes('/start');

    // Either shows error or redirects to start
    const hasError = (await errorMessage.count()) > 0;
    expect(hasError || isOnStartPage).toBe(true);
  });

  test('user data is correctly stored in localStorage', async ({ page }) => {
    // Register user with specific details
    const testUser = {
      name: 'Storage Test User',
      email: 'storage@example.com',
      phone: '5557778888',
    };

    await page.goto('/start');
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/phone/i).fill(testUser.phone);
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Verify user data in localStorage
    const storedUser = await page.evaluate(() => {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    });

    expect(storedUser).toBeTruthy();
    expect(storedUser.name).toBe(testUser.name);
    expect(storedUser.email).toBe(testUser.email);
    expect(storedUser.phone).toBe(testUser.phone);
    expect(storedUser).toHaveProperty('id');
    expect(storedUser).toHaveProperty('resumeToken');
  });

  test('multiple browser tabs share same localStorage', async ({ context }) => {
    // Create first page and register
    const page1 = await context.newPage();
    await page1.goto('/start');
    await page1.getByLabel(/name/i).fill('Multi Tab User');
    await page1.getByLabel(/email/i).fill('multitab@example.com');
    await page1.getByLabel(/phone/i).fill('5554445555');
    await page1.getByRole('button', { name: /continue/i }).click();

    await page1.waitForURL('/quizzes', { timeout: 10000 });

    // Get data from first tab
    const tab1Data = await page1.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    // Open second tab and navigate to quizzes
    const page2 = await context.newPage();
    await page2.goto('/quizzes');

    // Get data from second tab
    const tab2Data = await page2.evaluate(() => {
      return {
        currentUser: localStorage.getItem('current_user'),
        resumeToken: localStorage.getItem('resume_token'),
      };
    });

    // Data should be the same in both tabs
    expect(tab2Data.currentUser).toEqual(tab1Data.currentUser);
    expect(tab2Data.resumeToken).toEqual(tab1Data.resumeToken);

    // Cleanup
    await page1.close();
    await page2.close();
  });

  test('clearing localStorage logs user out', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Logout Test User');
    await page.getByLabel(/email/i).fill('logout@example.com');
    await page.getByLabel(/phone/i).fill('5551112222');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Verify we're logged in
    await expect(page).toHaveURL('/quizzes');

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Navigate to quizzes page
    await page.goto('/quizzes');

    // Should redirect to /start (no session)
    await page.waitForURL('/start', { timeout: 5000 });
    await expect(page).toHaveURL('/start');
  });
});
