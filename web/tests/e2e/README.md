# E2E Testing with Playwright

**Comprehensive end-to-end testing suite for BAPI Headless e-commerce platform**

## Overview

This e2e test suite covers critical user journeys across 11 languages, 608 products, and multiple browsers. Tests validate functionality, accessibility, and user experience before the April 10, 2026 launch.

## Test Coverage

### 📋 Test Suites

1. **Language Selector** (`language-selector.spec.ts`)
   - Language switching functionality
   - Toast notifications
   - URL locale changes
   - Multi-language navigation
   - Keyboard accessibility
   - Mobile viewport testing

2. **Homepage** (`homepage.spec.ts`)
   - Page load and performance
   - Navigation elements
   - Language/region selectors
   - Search functionality
   - Footer links
   - SEO meta tags
   - Accessibility compliance

3. **Products** (`products.spec.ts`)
   - Product listing pages
   - Product detail pages
   - Product information display
   - Add to cart functionality
   - Image galleries
   - Search functionality
   - Category filtering
   - Related products
   - Breadcrumb navigation

4. **Cart & Checkout** (`cart-checkout.spec.ts`)
   - Add/remove cart items
   - Quantity updates
   - Cart persistence
   - Cart drawer/modal
   - Checkout wizard
   - Form validation
   - Order summary
   - Mobile responsiveness

5. **Authentication** (`authentication.spec.ts`)
   - Sign in page
   - Sign up page
   - Password validation
   - Form validation
   - Forgot password
   - Protected routes
   - Two-factor authentication
   - Account pages

## Installation

Playwright is already installed, but you may need to install browser binaries:

```bash
cd web
pnpm exec playwright install
```

This will install Chromium, Firefox, and WebKit browsers.

## Running Tests

### All Tests (All Browsers)

```bash
pnpm run test:e2e
```

### UI Mode (Recommended for Development)

```bash
pnpm run test:e2e:ui
```

Interactive mode with:
- Visual test runner
- Time travel debugging
- Watch mode
- Trace viewer

### Debug Mode

```bash
pnpm run test:e2e:debug
```

Runs tests with Playwright Inspector for step-by-step debugging.

### Headed Mode (Visible Browser)

```bash
pnpm run test:e2e:headed
```

Watch tests run in a real browser window.

### Single Browser

```bash
# Chromium only (fastest)
pnpm run test:e2e:chromium

# Firefox only
pnpm exec playwright test --project=firefox

# WebKit only
pnpm exec playwright test --project=webkit

# Mobile Chrome
pnpm exec playwright test --project="Mobile Chrome"
```

### Specific Test File

```bash
# Run language selector tests only
pnpm exec playwright test language-selector

# Run products tests only
pnpm exec playwright test products

# Run specific test by name
pnpm exec playwright test -g "should change language and show toast"
```

### CI Mode

```bash
# Runs with retries, single worker, full reporting
CI=1 pnpm run test:e2e
```

## Test Reports

### View Last Run Report

```bash
pnpm run test:e2e:report
```

Opens HTML report with:
- Test results
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

### Report Location

Reports are generated in `web/playwright-report/` and test results in `web/test-results/`.

## Configuration

Configuration is in `playwright.config.ts`:

```typescript
{
  testDir: './tests/e2e',
  timeout: 30000,              // 30s per test
  fullyParallel: true,         // Run tests in parallel
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm run dev',   // Starts dev server automatically
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
}
```

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.getByRole('button', { name: /click me/i });
    
    // Act
    await element.click();
    
    // Assert
    await expect(page).toHaveURL('/new-page');
  });

  test('should pass accessibility checks', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });
});
```

### Best Practices

1. **Use Semantic Selectors**
   ```typescript
   // ✅ Good - Role-based (accessible)
   page.getByRole('button', { name: /submit/i })
   page.getByLabel(/email/i)
   page.getByText(/welcome/i)
   
   // ❌ Avoid - Fragile
   page.locator('#btn-123')
   page.locator('.my-button')
   ```

2. **Wait for Stability**
   ```typescript
   // ✅ Good - Wait for network/DOM stability
   await page.waitForLoadState('networkidle');
   
   // ❌ Avoid - Arbitrary timeouts
   await page.waitForTimeout(5000);
   ```

3. **Test User Journeys, Not Implementation**
   ```typescript
   // ✅ Good - User perspective
   test('should complete checkout', async ({ page }) => {
     await addProductToCart(page);
     await page.goto('/checkout');
     await fillShippingInfo(page);
     await expectOrderConfirmation(page);
   });
   
   // ❌ Avoid - Testing internal state
   test('should update Redux cart state', async ({ page }) => {
     // ...testing implementation details
   });
   ```

4. **Include Accessibility Tests**
   ```typescript
   test('should be accessible', async ({ page }) => {
     await injectAxe(page);
     await checkA11y(page, undefined, {
       detailedReport: true,
       detailedReportOptions: { html: true },
     });
   });
   ```

5. **Test Mobile Viewports**
   ```typescript
   test('should work on mobile', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     // ... test mobile-specific behavior
   });
   ```

## Debugging

### View Trace

When a test fails, Playwright captures a trace file:

```bash
# View specific trace
pnpm exec playwright show-trace test-results/.../trace.zip
```

Trace viewer shows:
- Step-by-step test execution
- DOM snapshots at each step
- Network activity
- Console logs
- Screenshots

### Pause Test Execution

```typescript
test('debug this test', async ({ page }) => {
  await page.goto('/');
  await page.pause();  // ⚙️ Opens Playwright Inspector
  // Test pauses here for manual inspection
});
```

### Slow Motion

```typescript
test.use({ launchOptions: { slowMo: 1000 } });  // 1s delay between actions
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: cd web && pnpm install
      
      - name: Install Playwright browsers
        run: cd web && pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        run: cd web && pnpm run test:e2e
        env:
          CI: true
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: web/playwright-report/
```

## Test Data & Fixtures

### Using Test Fixtures

Create reusable test data in `tests/e2e/fixtures/`:

```typescript
// fixtures/test-products.ts
export const testProducts = [
  {
    sku: 'DAMPER-001',
    name: 'Test Damper Actuator',
    price: 199.99,
  },
];
```

Import in tests:

```typescript
import { testProducts } from './fixtures/test-products';
```

## Performance Testing

### Measure Load Times

```typescript
test('should load quickly', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);  // 3s target
});
```

### Core Web Vitals

```typescript
test('should have good Core Web Vitals', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => ({
    lcp: performance.getEntriesByType('largest-contentful-paint')[0],
    fid: performance.getEntriesByType('first-input')[0],
    cls: performance.getEntriesByType('layout-shift'),
  }));
  
  // Assert metrics meet targets
});
```

## Multi-Language Testing

### Test All Languages

```typescript
const LANGUAGES = ['en', 'es-ES', 'de', 'fr', 'ja', 'zh-CN'];

for (const locale of LANGUAGES) {
  test(`should work in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await page.waitForLoadState('networkidle');
    
    // Assert locale-specific content
    await expect(page).toHaveURL(new RegExp(locale));
  });
}
```

## Accessibility Testing

All test suites include accessibility checks using `axe-playwright` for WCAG 2.1 Level AA compliance.

### Run Accessibility Tests Only

```bash
pnpm exec playwright test -g "accessibility"
```

### Custom Accessibility Rules

```typescript
await checkA11y(page, undefined, {
  rules: {
    'color-contrast': { enabled: true },
    'heading-order': { enabled: true },
  },
  detailedReport: true,
});
```

## Troubleshooting

### Tests Fail Locally But Pass in CI

- **Issue**: Different browser versions or OS
- **Solution**: Run `pnpm exec playwright install` to update browsers

### Flaky Tests

- **Issue**: Tests sometimes pass, sometimes fail
- **Solution**: 
  - Use `waitForLoadState('networkidle')` instead of arbitrary timeouts
  - Increase timeout for slow operations
  - Use `waitForSelector` with explicit conditions

### Screenshots Don't Match

- **Issue**: Visual differences between environments
- **Solution**: Use semantic assertions instead of screenshot comparison

### Dev Server Won't Start

- **Issue**: Port 3000 already in use
- **Solution**: 
  ```bash
  # Kill process on port 3000
  lsof -ti:3000 | xargs kill -9
  
  # Or use different port
  PORT=3001 pnpm run test:e2e
  ```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [axe-playwright Documentation](https://github.com/abhinaba-ghosh/axe-playwright)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Maintenance

### Update Test Selectors

When UI changes, update selectors in affected tests. Use data-testid attributes for stable selectors:

```tsx
// Component
<button data-testid="add-to-cart">Add to Cart</button>

// Test
page.getByTestId('add-to-cart')
```

### Review Failed Tests

When tests fail:
1. Check trace file for detailed execution
2. Review screenshots/videos
3. Update test if behavior changed intentionally
4. Fix bug if behavior is incorrect

## Current Status

- ✅ Playwright installed (v1.58.0)
- ✅ Configuration complete
- ✅ 5 test suites created
- ✅ Accessibility testing integrated
- ✅ Multi-browser testing configured
- ✅ Mobile testing included
- ✅ Scripts added to package.json

**Next Steps:**
1. Install Playwright browsers: `pnpm exec playwright install`
2. Run tests: `pnpm run test:e2e:ui`
3. Review results and adjust as needed
4. Integrate into CI/CD pipeline

**Launch Readiness:**
With 36 days until April 10, 2026 launch, these e2e tests provide confidence that critical user journeys work correctly across browsers and languages.
