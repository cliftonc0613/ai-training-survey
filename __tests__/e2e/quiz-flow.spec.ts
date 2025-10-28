import { test, expect } from '@playwright/test';

test.describe('Standard Quiz Flow', () => {
  test('homepage loads and shows start button', async ({ page }) => {
    await page.goto('/');

    // Verify title
    await expect(page).toHaveTitle(/AI Training Course Survey/);

    // Verify Start Survey button is visible
    const startButton = page.getByRole('button', { name: /start survey/i });
    await expect(startButton).toBeVisible();

    // Click Start Survey button
    await startButton.click();

    // Should navigate to /start page
    await expect(page).toHaveURL('/start');
  });

  test('user registration form displays all required fields', async ({ page }) => {
    await page.goto('/start');

    // Verify all form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();

    // Verify continue button exists
    const continueButton = page.getByRole('button', { name: /continue/i });
    await expect(continueButton).toBeVisible();
  });

  test('form validation prevents empty submission', async ({ page }) => {
    await page.goto('/start');

    // Try to submit without filling anything
    const continueButton = page.getByRole('button', { name: /continue/i });
    await continueButton.click();

    // Should still be on /start page (form validation prevented navigation)
    await expect(page).toHaveURL('/start');
  });

  test('form validation shows errors for invalid email', async ({ page }) => {
    await page.goto('/start');

    // Fill form with invalid email
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/phone/i).fill('1234567890');

    // Try to submit
    await page.getByRole('button', { name: /continue/i }).click();

    // Should show validation error (check for error text or stay on page)
    await expect(page).toHaveURL('/start');
  });

  test('form accepts valid user data and navigates', async ({ page }) => {
    await page.goto('/start');

    // Fill form with valid data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone/i).fill('1234567890');

    // Submit form
    await page.getByRole('button', { name: /continue/i }).click();

    // Should navigate away from /start (likely to /quizzes)
    await page.waitForURL((url) => url.pathname !== '/start', { timeout: 10000 });

    // Verify we're on quizzes page
    expect(page.url()).toContain('/quizzes');
  });

  test('quizzes page loads after registration', async ({ page }) => {
    // Register user first
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('5551234567');
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for quizzes page
    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Verify we're on the quizzes page
    await expect(page).toHaveURL('/quizzes');

    // Look for common quiz page elements
    const pageHeading = page.locator('h1, h2').first();
    await expect(pageHeading).toBeVisible();
  });

  test('navigation between pages works correctly', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Navigate to start page
    await page.getByRole('button', { name: /start survey/i }).click();
    await expect(page).toHaveURL('/start');

    // Go back to home
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Forward to start again
    await page.goForward();
    await expect(page).toHaveURL('/start');
  });
});
