import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('registration page should not have accessibility violations', async ({ page }) => {
    await page.goto('/start');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('quizzes page should not have accessibility violations', async ({ page }) => {
    // Register user first to access quizzes page
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Accessibility Test User');
    await page.getByLabel(/email/i).fill('a11y@example.com');
    await page.getByLabel(/phone/i).fill('5551234567');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('quiz page should not have accessibility violations', async ({ page }) => {
    // Register user first
    await page.goto('/start');
    await page.getByLabel(/name/i).fill('Quiz A11y User');
    await page.getByLabel(/email/i).fill('quiza11y@example.com');
    await page.getByLabel(/phone/i).fill('5559876543');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForURL('/quizzes', { timeout: 10000 });

    // Navigate to a quiz page
    await page.goto('/quiz/test-quiz-id');
    await page.waitForTimeout(2000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Quiz may not load (invalid ID), so we check what's on the page
    // If there's content, it should be accessible
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form inputs should have proper labels', async ({ page }) => {
    await page.goto('/start');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('form')
      .analyze();

    // Specifically check for form label issues
    const labelViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('label')
    );

    expect(labelViolations).toEqual([]);
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for button accessibility issues
    const buttonViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.id.includes('button') || violation.id.includes('link-name')
    );

    expect(buttonViolations).toEqual([]);
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for image alt text violations
    const imageViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('image-alt')
    );

    expect(imageViolations).toEqual([]);
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    // Check for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('color-contrast')
    );

    expect(contrastViolations).toEqual([]);
  });

  test('heading hierarchy should be correct', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();

    // Check for heading order violations
    const headingViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('heading')
    );

    expect(headingViolations).toEqual([]);
  });

  test('landmark regions should be properly defined', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for landmark violations
    const landmarkViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.id.includes('landmark') || violation.id.includes('region')
    );

    expect(landmarkViolations).toEqual([]);
  });

  test('page should have a document title', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();

    // Check for document title violation
    const titleViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('document-title')
    );

    expect(titleViolations).toEqual([]);
  });

  test('keyboard navigation should work', async ({ page }) => {
    await page.goto('/start');

    // Tab through form fields
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);

    // Check that focus is visible
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for focus-related violations
    const focusViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('focus')
    );

    expect(focusViolations).toEqual([]);
  });

  test('ARIA attributes should be valid', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for ARIA violations
    const ariaViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('aria')
    );

    expect(ariaViolations).toEqual([]);
  });

  test('mobile viewport should be accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('registration form should be keyboard accessible', async ({ page }) => {
    await page.goto('/start');

    // Navigate form with keyboard
    await page.keyboard.press('Tab'); // Focus first field
    await page.keyboard.type('John Doe');
    await page.keyboard.press('Tab'); // Move to email
    await page.keyboard.type('john@example.com');
    await page.keyboard.press('Tab'); // Move to phone
    await page.keyboard.type('5551234567');
    await page.keyboard.press('Tab'); // Move to button

    // Verify we can submit with Enter
    const focusedElement = await page.evaluate(
      () => document.activeElement?.getAttribute('type') || document.activeElement?.tagName
    );
    expect(['submit', 'BUTTON']).toContain(focusedElement);
  });

  test('error messages should be accessible', async ({ page }) => {
    await page.goto('/start');

    // Try to submit without filling form (should show errors)
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
