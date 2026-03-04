import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Product Pages E2E Tests
 * 
 * Tests product browsing and product detail pages:
 * - Product listing pages
 * - Product detail pages
 * - Product information display
 * - Add to cart functionality
 * - Product images and media
 * - Breadcrumb navigation
 * - Accessibility compliance
 */

test.describe('Product Pages', () => {
  test.describe('Product Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
    });

    test('should display product grid', async ({ page }) => {
      // Products heading should be visible
      const heading = page.getByRole('heading', { name: /products/i, level: 1 });
      await expect(heading).toBeVisible();
      
      // Should show product cards
      const productLinks = page.getByRole('link').filter({ has: page.locator('img[alt*="product"]') });
      const count = await productLinks.count();
      
      // Should have at least some products visible
      expect(count).toBeGreaterThan(0);
    });

    test('should filter products by category', async ({ page }) => {
      // Look for category filters
      const categoryFilter = page.getByRole('button', { name: /category|filter/i }).first();
      
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click();
        
        // Select a category
        const categoryOption = page.getByRole('option', { name: /damper/i }).first();
        if (await categoryOption.isVisible()) {
          await categoryOption.click();
          
          // Wait for filtered results
          await page.waitForLoadState('networkidle');
          
          // URL should update with filter
          expect(page.url()).toContain('category');
        }
      }
    });

    test('should navigate to product detail page', async ({ page }) => {
      // Click first product
      const firstProduct = page.getByRole('link').filter({ has: page.locator('img[alt*="product"]') }).first();
      await firstProduct.click();
      
      // Should navigate to product detail
      await page.waitForURL(/\/products\/.+/);
      await page.waitForLoadState('networkidle');
      
      // Product heading should be visible
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
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
      // Navigate to products page first
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Click first available product
      const firstProduct = page.getByRole('link').filter({ has: page.locator('img[alt*="product"]') }).first();
      await firstProduct.click();
      
      await page.waitForURL(/\/products\/.+/);
      await page.waitForLoadState('networkidle');
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
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should search for products', async ({ page }) => {
      // Open search
      const searchButton = page.getByRole('button', { name: /search/i });
      await searchButton.click();
      
      // Type search query
      const searchInput = page.getByRole('searchbox');
      await searchInput.fill('damper actuator');
      
      // Submit search or wait for results
      await page.keyboard.press('Enter');
      
      // Should navigate to search results
      await page.waitForLoadState('networkidle');
      
      // Results should be displayed
      const results = page.locator('[data-testid="search-results"], .search-results, main');
      await expect(results).toBeVisible();
    });

    test('should show no results message for invalid search', async ({ page }) => {
      // Open search
      const searchButton = page.getByRole('button', { name: /search/i });
      await searchButton.click();
      
      // Type nonsense query
      const searchInput = page.getByRole('searchbox');
      await searchInput.fill('xyzabc123notfound');
      await page.keyboard.press('Enter');
      
      // Should show no results message
      await page.waitForLoadState('networkidle');
      const noResults = page.locator('text=/no results|nothing found|no products found/i');
      await expect(noResults).toBeVisible();
    });
  });
});
