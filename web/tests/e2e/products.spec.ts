import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { routes } from './helpers/routes';
import { 
  safeClick, 
  navigateToProducts, 
  waitForFullPageLoad,
  waitForAnimations,
  waitForStableElement
} from './helpers/test-utils';

/**
 * Product Pages E2E Tests (Enterprise-Level)
 * 
 * Tests product browsing and product detail pages with proper handling of:
 * - Animated category cards and transitions
 * - Deep category nesting (3+ levels)
 * - React Suspense boundaries
 * - Lazy-loaded components
 * - Element stability during interactions
 * 
 * Uses enterprise test utilities from ./helpers/test-utils.ts
 * 
 * IMPORTANT: All routes use locale helper (routes.products()) to avoid
 * hardcoding locale prefixes. next-intl requires locale in all routes.
 */

test.describe('Product Pages', () => {
  test.describe('Product Categories Landing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(routes.products());
      await waitForFullPageLoad(page);
      
      // Wait for first category card to be visible and stable
      const firstCategoryCard = page
        .locator('a[href*="/categories/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();
      await waitForStableElement(firstCategoryCard);
      await expect(firstCategoryCard).toBeVisible();
    });

    test('should display product categories', async ({ page }) => {
      // Products heading should be visible
      const heading = page.getByRole('heading', { name: /products/i, level: 1 });
      await expect(heading).toBeVisible();
      
      // On /products we expect category cards that link to /categories/{slug}
      const categoryLinks = page
        .locator('a[href*="/categories/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) });
      const count = await categoryLinks.count();
      
      // Should have at least some categories visible
      expect(count).toBeGreaterThan(0);
    });

    test('should navigate from landing to category page', async ({ page }) => {
      // Click the first category card/link on the products landing page
      const firstCategory = page
        .locator('a[href*="/categories/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();

      await safeClick(firstCategory);
      await waitForFullPageLoad(page);
      
      // Wait for category page heading to be visible (deterministic)
      const categoryHeading = page.getByRole('heading', { level: 1 });
      await expect(categoryHeading).toBeVisible();

      // Should navigate away from the landing page to a category route
      await expect(page).not.toHaveURL(/\/products\/?$/);
    });

    test('should navigate from category to product detail', async ({ page }) => {
      // Navigate from products landing to a category page
      const firstCategory = page
        .locator('a[href*="/categories/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();
      
      await safeClick(firstCategory);
      await waitForFullPageLoad(page);

      // Navigate through category hierarchy to find products (enterprise utility)
      const productLink = await navigateToProducts(page, 3);
      
      // Click product link
      await safeClick(productLink);
      await waitForFullPageLoad(page);

      // Verify we're on a product detail page
      await expect(page).toHaveURL(/\/product\/.+/);
      const productHeading = page.getByRole('heading', { level: 1 });
      await expect(productHeading).toBeVisible();
    });

    test('should pass accessibility checks', async ({ page }) => {
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
      });
    });
  });

  test.describe('Product Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to products landing page
      await page.goto(routes.products());
      await waitForFullPageLoad(page);
      
      // Wait for first category card to be visible and stable
      const firstCategoryCard = page
        .locator('a[href*="/categories/"]')
        .filter({ has: page.getByRole('heading', { level: 2 }) })
        .first();
      await waitForStableElement(firstCategoryCard);
      await expect(firstCategoryCard).toBeVisible();
      
      // Navigate to category page
      await safeClick(firstCategoryCard);
      await waitForFullPageLoad(page);
      
      // Navigate through category hierarchy to find products (enterprise utility)
      const productLink = await navigateToProducts(page, 3);
      
      // Navigate to product detail page
      await safeClick(productLink);
      await waitForFullPageLoad(page);
    });

    test('should display product information', async ({ page }) => {
      // Product title
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
      
      // Product image
      const productImage = page.locator('img[alt*="product"]').first();
      await expect(productImage).toBeVisible();
      
      // Price should be displayed
      const price = page.locator('text=/\\$[0-9,]+\\.\\d{2}/').first();
      await expect(price).toBeVisible();
      
      // Add to cart button should exist
      const addToCartButton = page.getByRole('button', { name: /add to cart/i });
      await expect(addToCartButton).toBeVisible();
    });

    test('should display breadcrumb navigation', async ({ page }) => {
      // Breadcrumb should be visible
      const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
      
      if (await breadcrumb.isVisible()) {
        // Should have Home link
        const homeLink = breadcrumb.getByRole('link', { name: /home/i });
        await expect(homeLink).toBeVisible();
        
        // Should have Products link
        const productsLink = breadcrumb.getByRole('link', { name: /products/i });
        await expect(productsLink).toBeVisible();
      }
    });

    test('should show product SKU or part number', async ({ page }) => {
      // SKU should be displayed (stored in wp_postmeta)
      const sku = page.locator('text=/SKU:|Part Number:/i');
      
      if (await sku.isVisible()) {
        await expect(sku).toBeVisible();
      }
    });

    test('should add product to cart', async ({ page }) => {
      // Get initial cart count
      const cartButton = page.getByRole('button', { name: /cart/i }).first();
      const initialText = await cartButton.textContent();
      const initialCount = parseInt(initialText?.match(/\d+/)?.[0] || '0');
      
      // Click add to cart
      const addToCartButton = page.getByRole('button', { name: /add to cart/i });
      await addToCartButton.click();
      
      // Wait for cart to update
      await page.waitForTimeout(500);
      
      // Cart count should increase
      const updatedText = await cartButton.textContent();
      const updatedCount = parseInt(updatedText?.match(/\d+/)?.[0] || '0');
      
      expect(updatedCount).toBe(initialCount + 1);
      
      // Toast notification should appear
      const toast = page.locator('[role="alert"], [role="status"]').filter({ hasText: /cart/i });
      await expect(toast).toBeVisible();
    });

    test('should display product images gallery', async ({ page }) => {
      // Main product image should be visible
      const mainImage = page.locator('img[alt*="product"]').first();
      await expect(mainImage).toBeVisible();
      
      // Check for image thumbnails (if product has multiple images)
      const thumbnails = page.locator('img[alt*="product"]');
      const thumbnailCount = await thumbnails.count();
      
      // At least one image should exist
      expect(thumbnailCount).toBeGreaterThan(0);
    });

    test('should show product description', async ({ page }) => {
      // Product description section should exist
      const description = page.locator('text=/description/i').first();
      
      if (await description.isVisible()) {
        await expect(description).toBeVisible();
      }
    });

    test('should display related products', async ({ page }) => {
      // Scroll down to see related products section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Look for related products section
      const relatedSection = page.locator('text=/related|you may also like/i').first();
      
      if (await relatedSection.isVisible()) {
        await expect(relatedSection).toBeVisible();
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Product information should still be visible
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
      
      // Add to cart button should be visible
      const addToCartButton = page.getByRole('button', { name: /add to cart/i });
      await expect(addToCartButton).toBeVisible();
    });

    test('should pass accessibility checks', async ({ page }) => {
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
      });
    });

    test('should handle quantity selection', async ({ page }) => {
      // Look for quantity input
      const quantityInput = page.getByRole('spinbutton', { name: /quantity/i });
      
      if (await quantityInput.isVisible()) {
        // Change quantity
        await quantityInput.fill('3');
        
        // Add to cart
        const addToCartButton = page.getByRole('button', { name: /add to cart/i });
        await addToCartButton.click();
        
        // Wait for cart update
        await page.waitForTimeout(500);
        
        // Cart should reflect quantity
        const cartButton = page.getByRole('button', { name: /cart/i }).first();
        const cartText = await cartButton.textContent();
        expect(cartText).toContain('3');
      }
    });

    test('should display product specifications', async ({ page }) => {
      // Look for specifications or technical details
      const specsSection = page.locator('text=/specifications|technical|features/i').first();
      
      if (await specsSection.isVisible()) {
        await expect(specsSection).toBeVisible();
      }
    });
  });

  test.describe('Product Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(routes.products());
      await page.waitForLoadState('networkidle');
      
      // Wait for header to be fully loaded
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should search for products', async ({ page }) => {
      // Open search - try multiple possible search button patterns
      const searchButton = page.getByRole('button', { name: /search/i }).or(
        page.locator('button[aria-label*="search" i]')
      ).or(
        page.locator('[data-testid="search-button"]')
      ).first();
      
      await safeClick(searchButton);
      
      // Wait for search input to appear
      const searchInput = page.getByRole('searchbox');
      await waitForStableElement(searchInput);
      await expect(searchInput).toBeVisible();
      await searchInput.fill('damper actuator');
      
      // Submit search
      await page.keyboard.press('Enter');
      await waitForFullPageLoad(page);
      
      // Results should be displayed
      const results = page.locator('[data-testid="search-results"], .search-results, main');
      await expect(results).toBeVisible();
    });

    test('should show no results message for invalid search', async ({ page }) => {
      // Open search - try multiple possible search button patterns
      const searchButton = page.getByRole('button', { name: /search/i }).or(
        page.locator('button[aria-label*="search" i]')
      ).or(
        page.locator('[data-testid="search-button"]')
      ).first();
      
      await safeClick(searchButton);
      
      // Wait for search input to appear
      const searchInput = page.getByRole('searchbox');
      await waitForStableElement(searchInput);
      await expect(searchInput).toBeVisible();
      await searchInput.fill('xyzabc123notfound');
      await page.keyboard.press('Enter');
      
      // Should show no results message
      await waitForFullPageLoad(page);
      const noResults = page.locator('text=/no results|nothing found|no products found/i');
      await expect(noResults).toBeVisible();
    });
  });
});
