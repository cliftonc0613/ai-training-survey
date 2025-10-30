# Cross-Browser Testing Guide

This guide explains how to run E2E tests across multiple browsers (Chrome, Firefox, Safari, Edge) using Playwright.

## Supported Browsers

The test suite is configured to run on:

- **Chromium** (Chrome/Chromium-based browsers)
- **Firefox** (Mozilla Firefox)
- **WebKit** (Safari)
- **Edge** (Microsoft Edge)

## Installation

### Install Playwright Browsers

Before running cross-browser tests, install the browser binaries:

```bash
# Install all browsers
npx playwright install

# Install specific browsers only
npx playwright install chromium firefox webkit
```

### Browser Requirements

- **Chromium**: Works on all platforms (Windows, macOS, Linux)
- **Firefox**: Works on all platforms
- **WebKit**: Works on all platforms (Safari engine)
- **Edge**: Requires Microsoft Edge installed (Windows/macOS)

## Running Tests

### Run All Browsers

Run tests across all configured browsers:

```bash
npm run test:cross-browser
```

This executes all E2E tests in:
- Chromium
- Firefox
- WebKit (Safari)
- Edge

### Run Specific Browser

Run tests on a single browser:

```bash
# Chrome/Chromium only
npm run playwright:chromium

# Firefox only
npm run playwright:firefox

# Safari (WebKit) only
npm run playwright:webkit

# Edge only
npm run playwright:edge
```

### Run Default (All Projects)

```bash
npm run test:e2e
```

This runs tests on all configured browsers by default.

## Test Execution Examples

### Run specific test file across all browsers

```bash
npx playwright test __tests__/e2e/quiz-flow.spec.ts
```

### Run specific test on specific browser

```bash
npx playwright test __tests__/e2e/quiz-flow.spec.ts --project=firefox
```

### Run with UI mode (interactive)

```bash
npm run playwright:ui
```

### Run specific browser with debugging

```bash
npx playwright test --project=chromium --debug
```

## Configuration

Cross-browser configuration is in `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'edge',
    use: { ...devices['Desktop Edge'], channel: 'msedge' },
  },
]
```

## Browser-Specific Notes

### Chromium
- Default browser for development
- Best debugging support
- Fastest execution

### Firefox
- Good standards compliance
- Different rendering engine (Gecko)
- May expose unique bugs

### WebKit (Safari)
- Critical for iOS compatibility
- Strictest standards enforcement
- May have different behavior for:
  - IndexedDB
  - Service Workers
  - localStorage

### Edge
- Chromium-based but with Edge-specific features
- Requires Edge browser installed
- May skip if Edge not available

## Common Issues

### WebKit Certificate Errors

If you encounter certificate errors on WebKit:

```bash
# Set environment variable
PWDEBUG=1 npm run playwright:webkit
```

### Edge Not Found

If Edge tests fail with "browser not found":

1. Install Microsoft Edge browser
2. Or remove Edge from projects in `playwright.config.ts`

### Headless vs Headed Mode

Run in headed mode to see the browser:

```bash
npx playwright test --headed --project=firefox
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Cross-Browser E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npm run playwright:${{ matrix.browser }}
```

## Test Reports

### View HTML Report

After tests complete:

```bash
npm run playwright:report
```

This opens an interactive HTML report showing:
- Results per browser
- Screenshots of failures
- Traces for debugging
- Performance metrics

### Screenshots

Screenshots are automatically captured on failure:

```
test-results/
  chromium/
    quiz-flow-spec-ts-homepage-loads/
      test-failed-1.png
  firefox/
    quiz-flow-spec-ts-homepage-loads/
      test-failed-1.png
```

## Performance Comparison

Expected execution times (approximate):

- **Chromium**: 2-3 minutes per suite
- **Firefox**: 2-4 minutes per suite
- **WebKit**: 3-5 minutes per suite
- **Edge**: 2-3 minutes per suite

**Total for all browsers**: 10-15 minutes per suite

## Debugging

### Debug specific browser

```bash
# Debug in Chromium
npx playwright test --project=chromium --debug

# Debug in Firefox
npx playwright test --project=firefox --debug
```

### Trace Viewer

View detailed traces:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## Best Practices

1. **Run Chromium First**: Debug issues in Chromium before other browsers
2. **WebKit Last**: WebKit is strictest - fix WebKit issues to ensure broad compatibility
3. **Parallel Execution**: Use `fullyParallel: true` for faster execution
4. **Retries in CI**: Configure retries for flaky tests: `retries: 2`
5. **Screenshots**: Keep `screenshot: 'only-on-failure'` to debug failures

## Test Suite Coverage

All E2E tests run across all browsers:

- ✅ `quiz-flow.spec.ts` - Standard quiz flow (7 tests)
- ✅ `direct-quiz-link-flow.spec.ts` - Direct quiz access (5 tests)
- ✅ `save-resume-flow.spec.ts` - Save & resume (11 tests)
- ✅ `offline-functionality.spec.ts` - Offline mode (11 tests)

**Total**: 34 tests × 4 browsers = **136 test executions**

## Known Browser Differences

### localStorage
- All browsers: ✅ Supported
- WebKit: Stricter security in private mode

### IndexedDB
- All browsers: ✅ Supported
- Firefox: May have different quota limits
- WebKit: Stricter origin requirements

### Service Workers
- Chromium: ✅ Full support
- Firefox: ✅ Full support
- WebKit: ✅ Supported (iOS 11.3+)
- Edge: ✅ Full support

### Offline Detection
- All browsers: ✅ `navigator.onLine` supported
- Behavior may vary in actual network conditions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Browser Support](https://playwright.dev/docs/browsers)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Debugging Tests](https://playwright.dev/docs/debug)
