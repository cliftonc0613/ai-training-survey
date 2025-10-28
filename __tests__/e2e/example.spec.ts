import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Check that the page title contains expected text
  await expect(page).toHaveTitle(/AI Training Course Survey/);

  // Check for "Start Survey" button
  const startButton = page.getByRole('button', { name: /start survey/i });
  await expect(startButton).toBeVisible();
});

test('navigation to start page works', async ({ page }) => {
  await page.goto('/');

  // Click the "Start Survey" button
  await page.getByRole('button', { name: /start survey/i }).click();

  // Should navigate to /start page
  await expect(page).toHaveURL('/start');

  // Check for form fields
  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/phone/i)).toBeVisible();
});
