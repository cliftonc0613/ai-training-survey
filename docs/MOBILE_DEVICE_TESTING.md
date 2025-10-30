# Mobile Device Testing Guide

This guide explains how to run E2E tests on mobile devices (iOS Safari, Chrome Android) and tablets using Playwright's device emulation.

## Supported Mobile Devices

The test suite is configured for:

### Smartphones
- **Mobile Chrome** (Pixel 5) - Android Chrome
- **Mobile Safari** (iPhone 13) - iOS Safari Portrait
- **Mobile Safari Landscape** (iPhone 13 Landscape) - iOS Safari Landscape

### Tablets
- **Tablet Safari** (iPad gen 7) - iOS Safari on iPad
- **Tablet Chrome** (Galaxy Tab S4) - Android Chrome on Tablet

## Device Specifications

### Mobile Chrome (Pixel 5)
- **Viewport**: 393×851px
- **User Agent**: Chrome Mobile Android
- **Screen**: 393×851, deviceScaleFactor: 2.75
- **Touch**: Enabled
- **Mobile**: Yes

### Mobile Safari (iPhone 13)
- **Viewport**: 390×844px
- **User Agent**: Safari Mobile iOS
- **Screen**: 390×844, deviceScaleFactor: 3
- **Touch**: Enabled
- **Mobile**: Yes

### Mobile Safari Landscape (iPhone 13)
- **Viewport**: 844×390px
- **User Agent**: Safari Mobile iOS
- **Screen**: 844×390, deviceScaleFactor: 3
- **Touch**: Enabled
- **Mobile**: Yes

### Tablet Safari (iPad gen 7)
- **Viewport**: 810×1080px
- **User Agent**: Safari Mobile iOS
- **Screen**: 810×1080, deviceScaleFactor: 2
- **Touch**: Enabled
- **Mobile**: Yes (tablet)

### Tablet Chrome (Galaxy Tab S4)
- **Viewport**: 712×1138px
- **User Agent**: Chrome Mobile Android
- **Screen**: 712×1138, deviceScaleFactor: 2.25
- **Touch**: Enabled
- **Mobile**: Yes (tablet)

## Installation

Mobile device testing uses the same Playwright browsers:

```bash
# Install all browsers (includes mobile emulation)
npx playwright install

# Or install specific browsers
npx playwright install chromium webkit
```

**Note**: Mobile device testing uses **device emulation** - no physical devices or emulators required.

## Running Tests

### Run Core Mobile Tests (Phone Only)

```bash
npm run test:mobile
```

This runs tests on:
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Run All Mobile & Tablet Tests

```bash
npm run test:mobile-all
```

This runs tests on all 5 mobile configurations:
- Mobile Chrome
- Mobile Safari (Portrait)
- Mobile Safari (Landscape)
- Tablet Safari
- Tablet Chrome

### Run Specific Device

```bash
# Android Chrome (Pixel 5)
npm run playwright:mobile-chrome

# iOS Safari Portrait (iPhone 13)
npm run playwright:mobile-safari

# iOS Safari Landscape (iPhone 13)
npm run playwright:mobile-safari-landscape

# iPad Safari
npm run playwright:tablet-safari

# Android Tablet Chrome
npm run playwright:tablet-chrome
```

## Test Execution Examples

### Run specific test file on mobile devices

```bash
# Run on all mobile devices
npx playwright test __tests__/e2e/quiz-flow.spec.ts --project="Mobile Chrome" --project="Mobile Safari"

# Run on specific device
npx playwright test __tests__/e2e/quiz-flow.spec.ts --project="Mobile Safari"
```

### Run with UI mode (interactive)

```bash
npm run playwright:ui
```

Select mobile device from the UI.

### Run with headed mode (see the browser)

```bash
npx playwright test --project="Mobile Safari" --headed
```

## Mobile-Specific Test Considerations

### Touch Interactions

Mobile tests automatically use touch events:
- **Tap**: `page.click()` becomes a touch tap
- **Swipe**: Use `page.touchscreen.swipe()`
- **Long Press**: Use `page.touchscreen.tap()` with delay

### Viewport Sizes

Tests automatically adapt to mobile viewports:
- **Small screens**: 390-393px width (phones)
- **Medium screens**: 712-810px width (tablets)
- **Responsive**: All tests should handle different sizes

### Mobile-Specific Features to Test

1. **Touch Gestures**
   - Tap buttons and links
   - Scroll through content
   - Swipe navigation (if applicable)

2. **Responsive Layout**
   - Mobile menu behavior
   - Form field sizes
   - Button accessibility

3. **Keyboard Behavior**
   - Virtual keyboard appearance
   - Input focus
   - Keyboard dismissal

4. **Orientation Changes**
   - Portrait to landscape transitions
   - Layout adaptation
   - Content reflow

## Configuration

Mobile devices are configured in `playwright.config.ts`:

```typescript
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 13'] },
},
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
}
```

### Available Devices

Playwright includes many pre-configured devices:

```typescript
// iOS devices
'iPhone 13'
'iPhone 13 Pro'
'iPhone 13 Pro Max'
'iPhone 13 Mini'
'iPhone 12'
'iPad (gen 7)'
'iPad Pro 11'

// Android devices
'Pixel 5'
'Pixel 4'
'Galaxy S9+'
'Galaxy Tab S4'
```

See [Playwright Devices](https://playwright.dev/docs/emulation#devices) for full list.

## Common Issues

### Touch Targets Too Small

Mobile tests may fail if touch targets are too small:

**Fix**: Ensure buttons/links are at least 44×44px (iOS) or 48×48px (Android)

```css
.btn {
  min-height: 48px;
  min-width: 48px;
}
```

### Viewport-Specific Failures

Tests may pass on desktop but fail on mobile:

**Debug**: Run in headed mode to see the actual rendering

```bash
npx playwright test --project="Mobile Safari" --headed --debug
```

### Text Input Issues

Virtual keyboard may affect layout:

**Fix**: Ensure form fields scroll into view

```typescript
await page.getByLabel('Email').scrollIntoViewIfNeeded();
await page.getByLabel('Email').fill('test@example.com');
```

### Landscape Mode Differences

Some layouts break in landscape:

**Test Both**: Always test critical flows in both orientations

```bash
npm run playwright:mobile-safari           # Portrait
npm run playwright:mobile-safari-landscape # Landscape
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Mobile E2E Tests

on: [push, pull_request]

jobs:
  mobile-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        device:
          - Mobile Chrome
          - Mobile Safari
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --project="${{ matrix.device }}"
```

## Test Reports

### View HTML Report

```bash
npm run playwright:report
```

Filter by device in the report UI to see mobile-specific results.

### Screenshots

Mobile screenshots are automatically captured on failure:

```
test-results/
  Mobile-Chrome/
    quiz-flow-spec-ts-homepage-loads/
      test-failed-1.png
  Mobile-Safari/
    quiz-flow-spec-ts-homepage-loads/
      test-failed-1.png
```

## Performance Considerations

### Execution Times

Mobile tests may be slightly slower:

- **Mobile Chrome**: 2-4 minutes per suite
- **Mobile Safari**: 3-5 minutes per suite
- **Tablets**: 2-4 minutes per suite

**Total for all mobile devices**: 15-20 minutes per suite

### Parallel Execution

Mobile tests run in parallel by default:

```typescript
fullyParallel: true  // In playwright.config.ts
```

## Debugging Mobile Tests

### Debug Specific Device

```bash
npx playwright test --project="Mobile Safari" --debug
```

### Trace Viewer

View detailed mobile interaction traces:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Device Inspector

Use Playwright Inspector to see device emulation:

```bash
PWDEBUG=1 npx playwright test --project="Mobile Safari"
```

## Best Practices

1. **Test Touch Targets**: Ensure all interactive elements are easily tappable
2. **Test Both Orientations**: Critical for mobile apps
3. **Check Responsive Breakpoints**: Test across different viewport sizes
4. **Virtual Keyboard**: Account for keyboard covering content
5. **Network Conditions**: Simulate slow mobile networks (optional)

## Mobile-Specific Tests

All E2E tests run on mobile devices:

- ✅ `quiz-flow.spec.ts` - Form inputs and navigation on mobile
- ✅ `direct-quiz-link-flow.spec.ts` - Mobile browser redirects
- ✅ `save-resume-flow.spec.ts` - localStorage on mobile browsers
- ✅ `offline-functionality.spec.ts` - Mobile offline mode (critical for PWA)

## Test Coverage

**Per Device**:
- 7 tests - Standard quiz flow
- 5 tests - Direct quiz link flow
- 11 tests - Save & resume functionality
- 11 tests - Offline functionality

**= 34 tests × 5 mobile devices = 170 test executions**

## PWA Mobile Features

### Critical for Mobile

1. **Offline Support**
   - Service worker caching
   - IndexedDB persistence
   - Background sync

2. **Install Prompt**
   - Add to Home Screen (iOS)
   - Install banner (Android)

3. **Responsive Design**
   - Flexible layouts
   - Touch-friendly controls
   - Mobile-optimized forms

4. **Performance**
   - Fast load times on mobile networks
   - Efficient resource usage
   - Battery-friendly

## Known Mobile Browser Differences

### iOS Safari

- **localStorage**: May be cleared in private browsing
- **IndexedDB**: Quota limits more restrictive
- **Service Workers**: Full support (iOS 11.3+)
- **Add to Home Screen**: Native iOS prompt

### Chrome Android

- **localStorage**: ✅ Full support
- **IndexedDB**: ✅ Full support with higher quotas
- **Service Workers**: ✅ Full support
- **Install Prompt**: Web App Install Banner

## Simulating Network Conditions

Test on slow mobile networks:

```typescript
// In test file
await page.context().route('**/*', route => {
  setTimeout(() => route.continue(), 1000); // 1s delay
});
```

Or configure globally in `playwright.config.ts`.

## Resources

- [Playwright Mobile Emulation](https://playwright.dev/docs/emulation)
- [Playwright Device List](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
- [Mobile Testing Best Practices](https://playwright.dev/docs/test-mobile-web)
- [Touch Events](https://playwright.dev/docs/input#touch)
