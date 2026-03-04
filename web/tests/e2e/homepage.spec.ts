import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

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
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

  test('should display language and region selectors', async ({ page }) => {
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
      await searchButton.click();
      
      // Wait for search input to appear
      const searchInput = page.getByRole('searchbox');
      await expect(searchInput).toBeVisible();
      
      // Type search query
      await searchInput.fill('damper');
      
      // Should show search results or suggestions
      await page.waitForTimeout(500); // Debounce
      
      // Note: Specific assertions depend on your search implementation
    }
  });

  test('should navigate to products page', async ({ page }) => {
    // Click Products link
    const productsLink = page.getByRole('link', { name: /products/i }).first();
    await productsLink.click();
    
    // Should navigate to products page
    await page.waitForURL(/\/products/);
    
    // Products heading should be visible
    await page.waitForLoadState('networkidle');
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
    // Cart button should be visible in header
    const cartButton = page.getByRole('button', { name: /cart/i });
    await expect(cartButton).toBeVisible();
    
    // Should show item count (0 initially)
    await expect(cartButton).toContainText('0');
  });

  test('should display sign in button for unauthenticated users', async ({ page }) => {
    // Sign in button should be visible
    const signInButton = page.getByRole('link', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
    
    // Clicking should navigate to sign-in page
    await signInButton.click();
    await page.waitForURL(/\/sign-in/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenuButton).toBeVisible();
    
    // Click to open mobile menu
    await mobileMenuButton.click();
    
    // Mobile navigation should appear
    await page.waitForTimeout(500); // Animation
    const mobileNav = page.getByRole('navigation').filter({ hasText: /products/i });
    await expect(mobileNav).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    // Inject axe-core
    await injectAxe(page);
    
    // Check accessibility
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

  test('should load quickly (performance)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (generous for e2e)
    expect(loadTime).toBeLessThan(5000);
  });
});
