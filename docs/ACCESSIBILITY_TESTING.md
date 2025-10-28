# Accessibility Testing Guide

This guide explains how to run accessibility tests using axe-core and Playwright to ensure WCAG 2.1 AA compliance.

## Overview

Accessibility testing ensures the PWA is usable by people with disabilities, including:
- Screen reader users
- Keyboard-only navigation
- Low vision users
- Color blind users
- Motor impairment users

## Tools Used

- **@axe-core/playwright** - Automated accessibility testing
- **WCAG 2.1 Level AA** - Target compliance level
- **Playwright** - E2E testing framework

## Installation

The axe-core package is already installed:

```bash
npm install --save-dev @axe-core/playwright
```

## Running Accessibility Tests

### Run All Accessibility Tests

```bash
npx playwright test __tests__/e2e/accessibility.spec.ts
```

### Run Specific Test

```bash
npx playwright test __tests__/e2e/accessibility.spec.ts -g "homepage"
```

### Run with UI Mode

```bash
npm run playwright:ui
```

Then select accessibility.spec.ts from the test list.

## Test Coverage

The accessibility test suite includes **16 tests** covering:

### Page-Level Tests
1. **Homepage** - Full WCAG 2.1 AA scan
2. **Registration Page** - Form accessibility
3. **Quizzes Page** - List and navigation
4. **Quiz Page** - Interactive quiz interface

### Component-Level Tests
5. **Form Labels** - All inputs have proper labels
6. **Button Names** - All buttons have accessible names
7. **Image Alt Text** - All images have alt attributes
8. **Color Contrast** - WCAG AA contrast ratios
9. **Heading Hierarchy** - Proper H1-H6 structure
10. **Landmark Regions** - Main, nav, footer, etc.
11. **Document Title** - Page has title element
12. **Keyboard Navigation** - Tab order and focus
13. **ARIA Attributes** - Valid ARIA usage
14. **Mobile Accessibility** - Mobile viewport compliance
15. **Keyboard Form Access** - Forms usable without mouse
16. **Error Messages** - Accessible error feedback

## WCAG Guidelines Tested

### Level A (Must Have)
- ✅ Text alternatives (alt text)
- ✅ Keyboard accessible
- ✅ Meaningful sequence
- ✅ Use of color
- ✅ Bypass blocks
- ✅ Page titles
- ✅ Focus order
- ✅ Link purpose
- ✅ Language of page
- ✅ On focus/input

### Level AA (Should Have)
- ✅ Captions (if video/audio)
- ✅ Orientation
- ✅ Identify input purpose
- ✅ Color contrast (4.5:1 for normal text)
- ✅ Resize text
- ✅ Images of text
- ✅ Multiple ways
- ✅ Headings and labels
- ✅ Focus visible
- ✅ Label in name

## Understanding Test Results

### No Violations (Pass)

```
✓ homepage should not have accessibility violations
```

The page meets WCAG 2.1 AA standards.

### With Violations (Fail)

```
✗ homepage should not have accessibility violations
Expected: []
Received: [
  {
    id: 'color-contrast',
    impact: 'serious',
    description: 'Elements must have sufficient color contrast',
    nodes: [...]
  }
]
```

Each violation includes:
- **id**: Rule that failed (e.g., "color-contrast")
- **impact**: Severity (minor, moderate, serious, critical)
- **description**: What's wrong
- **nodes**: Which elements have the issue

## Common Accessibility Issues

### 1. Color Contrast

**Issue**: Text doesn't have enough contrast against background

**Fix**:
```css
/* Bad: 3:1 ratio */
color: #999;
background: #fff;

/* Good: 4.5:1 ratio */
color: #595959;
background: #fff;
```

**Test**:
```typescript
await new AxeBuilder({ page })
  .withTags(['wcag2aa'])
  .analyze();
```

### 2. Missing Form Labels

**Issue**: Input fields don't have associated labels

**Fix**:
```tsx
// Bad
<input type="text" />

// Good
<label htmlFor="name">Name</label>
<input id="name" type="text" />

// Or with Mantine
<TextInput label="Name" />
```

### 3. Button Without Accessible Name

**Issue**: Button doesn't have text or aria-label

**Fix**:
```tsx
// Bad
<button><IconTrash /></button>

// Good
<button aria-label="Delete item">
  <IconTrash />
</button>
```

### 4. Heading Hierarchy

**Issue**: Skipping heading levels (H1 → H3)

**Fix**:
```tsx
// Bad
<h1>Main Title</h1>
<h3>Subtitle</h3>

// Good
<h1>Main Title</h1>
<h2>Subtitle</h2>
```

### 5. Missing Alt Text

**Issue**: Images without alt attributes

**Fix**:
```tsx
// Bad
<img src="logo.png" />

// Good - Informative image
<img src="logo.png" alt="Company Logo" />

// Good - Decorative image
<img src="decoration.png" alt="" />
```

### 6. Keyboard Navigation

**Issue**: Interactive elements not keyboard accessible

**Fix**:
```tsx
// Bad
<div onClick={handleClick}>Click me</div>

// Good
<button onClick={handleClick}>Click me</button>

// Or make div accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

## Testing Strategy

### 1. Automated Testing

Run axe-core tests on every page:

```typescript
const accessibilityScanResults = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze();

expect(accessibilityScanResults.violations).toEqual([]);
```

### 2. Manual Testing

**Keyboard Navigation**:
- Tab through all interactive elements
- Verify focus indicators are visible
- Test form submission with Enter
- Test dialogs with Escape

**Screen Reader Testing**:
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free) or JAWS
- Test all major user flows

**Zoom Testing**:
- Browser zoom to 200%
- Verify layout doesn't break
- Text remains readable

### 3. Browser DevTools

**Chrome Lighthouse**:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility"
4. Run audit

**Chrome Accessibility Tree**:
1. DevTools → Elements
2. Accessibility pane
3. View how screen readers see the page

## Mantine-Specific Accessibility

Mantine components are accessible by default:

```tsx
// Mantine handles accessibility automatically
<TextInput label="Email" required />
// Generates proper label association

<Button>Submit</Button>
// Has proper role and keyboard support

<Checkbox label="I agree" />
// Properly labeled and keyboard accessible
```

### Overriding Mantine Defaults

```tsx
// Add aria-label for additional context
<TextInput
  label="Email"
  aria-label="Enter your email address"
/>

// Add aria-describedby for help text
<TextInput
  label="Password"
  description="At least 8 characters"
  aria-describedby="password-help"
/>
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test accessibility.spec.ts
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: accessibility-report
          path: playwright-report/
```

## Debugging Accessibility Issues

### View Detailed Violation Info

```typescript
test('debug accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();

  // Log detailed violation info
  results.violations.forEach(violation => {
    console.log('\n=== Violation ===');
    console.log('ID:', violation.id);
    console.log('Impact:', violation.impact);
    console.log('Description:', violation.description);
    console.log('Help:', violation.help);
    console.log('Help URL:', violation.helpUrl);

    violation.nodes.forEach((node, index) => {
      console.log(`\nNode ${index + 1}:`);
      console.log('HTML:', node.html);
      console.log('Target:', node.target);
    });
  });
});
```

### Exclude Known Issues Temporarily

```typescript
// Exclude specific rules while fixing
const results = await new AxeBuilder({ page })
  .disableRules(['color-contrast']) // Temporarily ignore
  .analyze();
```

### Test Specific Regions

```typescript
// Only test main content
const results = await new AxeBuilder({ page })
  .include('main')
  .analyze();

// Exclude header/footer
const results = await new AxeBuilder({ page })
  .exclude('header')
  .exclude('footer')
  .analyze();
```

## Best Practices

### 1. Semantic HTML

Use proper HTML elements:

```tsx
// Good
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<button>Click</button>

// Avoid
<div className="nav">...</div>
<div className="main">...</div>
<div onClick={...}>Click</div>
```

### 2. Form Accessibility

```tsx
<form>
  <TextInput
    label="Name"
    required
    error={errors.name}
  />

  <Button type="submit">
    Submit
  </Button>
</form>
```

### 3. Focus Management

```tsx
// Manage focus after actions
const handleDelete = () => {
  deleteItem();
  previousButtonRef.current?.focus();
};
```

### 4. Loading States

```tsx
<Button loading disabled>
  <span aria-live="polite">Submitting...</span>
</Button>
```

### 5. Error Messages

```tsx
<TextInput
  label="Email"
  error={errors.email}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <div id="email-error" role="alert">
    {errors.email}
  </div>
)}
```

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Mantine Accessibility](https://mantine.dev/guides/accessibility/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

### Testing
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing](https://webaim.org/articles/keyboard/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Quick Reference

### Run Tests
```bash
npm run test:e2e -- accessibility.spec.ts
```

### Check Specific Page
```bash
npx playwright test -g "homepage"
```

### Debug Mode
```bash
npx playwright test accessibility.spec.ts --debug
```

### Generate Report
```bash
npx playwright test accessibility.spec.ts
npm run playwright:report
```
