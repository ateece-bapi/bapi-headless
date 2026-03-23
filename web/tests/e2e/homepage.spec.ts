import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { waitForFullPageLoad, safeClick, waitForStableElement } from './helpers/test-utils';
import { routes } from './helpers/routes';

/**
 * Homepage E2E Tests
 * 
 * Tests the homepage functionality including:
 * - Page load and initial render
 * - Navigation elements
 * - Hero section
 * - Featured products
 * - Search functionality
 * - Accessibility compliance
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/BAPI/i);
    
    // Main content should be visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display header with navigation', async ({ page }) => {
    // Check logo presence
    const logo = page.getByRole('link', { name: /bapi|home/i }).first();
    await expect(logo).toBeVisible();
    
    // Check main navigation links
    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
    
    // Should have Products link
    const productsLink = page.getByRole('link', { name: /products/i }).first();
    await expect(productsLink).toBeVisible();
  });

  test('should display language and region selectors', async ({ page }, testInfo) => {
    // Wait for header to be fully rendered first
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // On mobile, selectors are in mobile menu (hidden by default). On desktop, they're in header.
    const isMobile = testInfo.project.name.includes('Mobile') || page.viewportSize()!.width < 1024;
    
    if (isMobile) {
      // Open mobile menu to access selectors
      const mobileMenuButton = page.getByRole('button', { name: /menu/i });
      await expect(mobileMenuButton).toBeVisible();
      await safeClick(mobileMenuButton);
    }
    
    // Language selector should be visible
    const languageSelector = page.getByRole('button', { name: /select language/i });
    await expect(languageSelector).toBeVisible();
    
    // Region selector should be visible
    const regionSelector = page.getByRole('button', { name: /select region/i });
    await expect(regionSelector).toBeVisible();
  });

  test('should have functional search', async ({ page }) => {
    // Find search button/input
    const searchButton = page.getByRole('button', { name: /search/i });
    
    if (await searchButton.isVisible()) {
      await safeClick(searchButton);
      
      // Wait for search input to appear
      const searchInput = page.getByRole('searchbox');
      await expect(searchInput).toBeVisible();
      await waitForStableElement(searchInput);
      
      // Type search query
      await searchInput.fill('damper');
      
      // After typing, verify search UI responds (results container or input has value)
      await expect(searchInput).toHaveValue('damper');
      
      // NOTE: Specific result assertions depend on search implementation
      // When search results are implemented, add assertions like:
      // const resultsRegion = page.getByRole('region', { name: /search results/i });
      // await expect(resultsRegion).toBeVisible();
    }
  });

  test('should navigate to products page', async ({ page }) => {
    // Navigate directly to products page (Products is a button that opens megamenu, not a link)
    await page.goto(routes.products());
    
    // Products page should load successfully
    await waitForFullPageLoad(page);
    await page.waitForURL(/\/products/);
    
    // Products heading should be visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check company links exist
    const companyLink = page.getByRole('link', { name: /company|about/i }).first();
    await expect(companyLink).toBeVisible();
  });

  test('should show cart button', async ({ page }) => {
    // Cart button should be visible in header (it's a link, not a button)
    const cartButton = page.getByRole('link', { name: /cart/i });
    await expect(cartButton).toBeVisible();
    
    // Cart link should have accessible label indicating shopping cart
    await expect(cartButton).toHaveAccessibleName(/cart/i);
  });

  test('should display sign in button for unauthenticated users', async ({ page }) => {
    // Sign in button should be visible
    const signInButton = page.getByRole('link', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
    
    // Clicking should navigate to sign-in page
    await safeClick(signInButton);
    await page.waitForURL(/\/sign-in/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
    
    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenuButton).toBeVisible();
    
    // Click to open mobile menu
    await safeClick(mobileMenuButton);
    
    // Mobile navigation should appear
    const mobileNav = page.getByRole('navigation', { name: /mobile navigation/i });
    await mobileNav.waitFor({ state: 'visible', timeout: 2000 });
    await expect(mobileNav).toBeVisible();
    
    // Verify Products link is present in mobile menu
    await expect(mobileNav.getByText(/products/i).first()).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    // Inject axe-core
    await injectAxe(page);
    
    // Check accessibility (all WCAG AA violations fixed ✅)
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check og:title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });

  test('should load within acceptable CI timeout (performance baseline)', async ({ page }, testInfo) => {
    const startTime = Date.now();
    
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
    
    const loadTime = Date.now() - startTime;
    
    // Mobile devices are slower due to emulated hardware, network throttling
    // Dev server is also slower during parallel test execution across all browsers
    const isMobile = testInfo.project.name.includes('Mobile');
    const threshold = isMobile ? 35000 : 30000; // 35s for mobile, 30s for desktop
    
    // This is a baseline check to prevent catastrophic regressions in CI environment
    // Not a production performance target - use Lighthouse/real user monitoring for that
    expect(loadTime).toBeLessThan(threshold);
  });
});
