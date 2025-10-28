import { test, expect } from '@playwright/test';

test.describe('Direct Quiz Link Flow', () => {
  test('direct quiz link without session redirects to registration', async ({ page }) => {
    // Try to access quiz directly without registering first
    // Using a placeholder quiz ID - this tests the redirect behavior
    await page.goto('/quiz/any-quiz-id');

    // Should redirect to /start page because user is not registered
    await page.waitForURL('/start', { timeout: 5000 });
    await expect(page).toHaveURL('/start');

    // Verify registration form is displayed
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
  });

  test('registered user can access quiz page after registration', async ({ page }) => {
    // First register the user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Registered User');
    await page.getByLabel(/email/i).fill('registered@example.com');
    await page.getByLabel(/phone/i).fill('5551122334');
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for registration to complete
    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Now try to access a quiz directly (simulating receiving a quiz link)
    await page.goto('/quiz/any-quiz-id');

    // Should stay on quiz page (not redirect to /start)
    await expect(page).toHaveURL(/\/quiz\/any-quiz-id/);

    // Verify quiz is loading or showing content/error
    // Since quiz ID doesn't exist, we should see loading then error
    const loader = page.getByText(/loading quiz/i);
    const errorAlert = page.getByText(/quiz not found|failed to load/i);
    const quizContent = page.locator('h1, h2');

    // One of these should be visible
    await expect(loader.or(errorAlert).or(quizContent)).toBeVisible();
  });

  test('invalid quiz ID shows error message for registered user', async ({ page }) => {
    // Register user first
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Error Test User');
    await page.getByLabel(/email/i).fill('errortest@example.com');
    await page.getByLabel(/phone/i).fill('5556667777');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Try to access quiz with clearly invalid ID
    await page.goto('/quiz/invalid-quiz-id-99999');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Should show error message or alert
    const errorMessage = page.getByText(/quiz not found|failed to load quiz|error/i);
    await expect(errorMessage).toBeVisible();
  });

  test('direct quiz link preserves URL structure', async ({ page }) => {
    // Register user
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('URL Test User');
    await page.getByLabel(/email/i).fill('urltest@example.com');
    await page.getByLabel(/phone/i).fill('5558889999');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Navigate to quiz with specific ID
    const quizId = 'survey-test-id';
    await page.goto(`/quiz/${quizId}`);

    // URL should match the expected pattern
    expect(page.url()).toContain(`/quiz/${quizId}`);

    // Verify dynamic route parameter is working
    await expect(page).toHaveURL(new RegExp(`/quiz/${quizId}`));
  });

  test('browser back button works from direct quiz link', async ({ page }) => {
    // Register and navigate to quizzes
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Back Button User');
    await page.getByLabel(/email/i).fill('backbtn@example.com');
    await page.getByLabel(/phone/i).fill('5552223333');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Navigate to quiz directly
    await page.goto('/quiz/test-quiz-id');
    await page.waitForTimeout(1500);

    // Go back
    await page.goBack();

    // Should return to previous page (quizzes)
    await expect(page).toHaveURL('/quizzes');

    // Forward should return to quiz
    await page.goForward();
    await expect(page).toHaveURL(/\/quiz\/test-quiz-id/);
  });
});
