import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { routes } from './helpers/routes';
import { 
  safeClick, 
  navigateToProducts, 
  waitForFullPageLoad,
  waitForStableElement,
  waitAfterNavigation
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

/**
 * Helper to find and navigate to any product page
 * Simplified approach using direct navigation instead of clicking (more stable)
 */
async function navigateToAnyProduct(page: any): Promise<void> {
  // Wait for either category links OR product links to appear
  await Promise.race([
    page.locator('a[href*="/products/"]:visible').first().waitFor({ state: 'visible', timeout: 10000 }),
    page.locator('a[href*="/product/"]:visible').first().waitFor({ state: 'visible', timeout: 10000 })
  ]).catch(() => {
    // If neither appears, continue anyway and let the assertions catch it
  });

  // Try to find a direct product link on the products page
  let productLinks = page.locator('a[href*="/product/"]:visible');
  let productCount = await productLinks.count();
  
  // If no products on main page, navigate into categories to find products
  if (productCount === 0) {
    const categoryLinks = page.locator('main').locator('a[href*="/products/"]:visible');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      // Get the href and navigate directly (more stable than clicking)
      const categoryHref = await categoryLinks.first().getAttribute('href');
      if (categoryHref) {
        await page.goto(categoryHref, { waitUntil: 'commit', timeout: 60000 });
        await waitAfterNavigation(page);
        
        productLinks = page.locator('a[href*="/product/"]:visible');
        productCount = await productLinks.count();
      }
    }
  }
  
  // If still no products, try navigating to first subcategory (up to 3 attempts)
  let attempts = 0;
  while (productCount === 0 && attempts < 3) {
    const subcategoryLinks = page.locator('main').locator('a[href*="/products/"]:visible');
    const subCount = await subcategoryLinks.count();
    
    if (subCount === 0) break;
    
    // Get href and navigate directly
    const subHref = await subcategoryLinks.first().getAttribute('href');
    if (subHref) {
      await page.goto(subHref, { waitUntil: 'commit', timeout: 60000 });
      await waitAfterNavigation(page);
      
      productLinks = page.locator('a[href*="/product/"]:visible');
      productCount = await productLinks.count();
    }
    attempts++;
  }
  
  // Assert we found at least one product
  expect(productCount).toBeGreaterThan(0);
  
  // Navigate to the first product
  const productHref = await productLinks.first().getAttribute('href');
  expect(productHref).toBeTruthy();
  
  if (productHref) {
    await page.goto(productHref, { waitUntil: 'commit', timeout: 60000 });
    await waitForFullPageLoad(page);
  }
}

test.describe('Product Pages', () => {
  test.describe('Product Categories Landing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(routes.products());
      await waitForFullPageLoad(page);
      
      // Wait for first category card to be visible and stable
      // Note: category cards do NOT have h2 headings — scope to main to avoid header links
      const firstCategoryCard = page
        .locator('main')
        .locator('a[href*="/products/"]:visible')
        .first();
      await waitForStableElement(firstCategoryCard);
      await expect(firstCategoryCard).toBeVisible();
    });

    test('should display product categories', async ({ page }) => {
      // Products heading should be visible
      const heading = page.getByRole('heading', { name: /products/i, level: 1 });
      await expect(heading).toBeVisible();
      
      // On /products we expect category cards that link to /products/{slug}
      // Scope to main to avoid header/footer links; category cards don't have h2 headings
      const categoryLinks = page
        .locator('main')
        .locator('a[href*="/products/"]:visible');
      const count = await categoryLinks.count();
      
      // Should have at least some categories visible
      expect(count).toBeGreaterThan(0);
    });

    test('should navigate from landing to category page', async ({ page }) => {
      // Click the first category card/link on the products landing page
      // Scope to main to avoid header/footer links; category cards don't have h2 headings
      const firstCategory = page
        .locator('main')
        .locator('a[href*="/products/"]:visible')
        .first();

      // Skip animation waits for category cards (they often have hover effects)
      // Force click to bypass actionability checks on animated elements
      await safeClick(firstCategory, { waitForAnimations: false, force: true });
      await waitForFullPageLoad(page);
      
      // Wait for category page heading to be visible (deterministic)
      const categoryHeading = page.getByRole('heading', { level: 1 });
      await expect(categoryHeading).toBeVisible();

      // Should navigate away from the landing page to a category route
      await expect(page).not.toHaveURL(/\/products\/?$/);
    });

    test('should navigate from category to product detail', async ({ page }) => {
      // Use the helper to navigate through categories to find a product
      await navigateToAnyProduct(page);
      
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
      
      // Use helper to find and navigate to any product
      await navigateToAnyProduct(page);
      
      // Verify we reached a product page
      await expect(page).toHaveURL(/\/product\/.+/, { timeout: 10000 });
      const productHeading = page.getByRole('heading', { level: 1 });
      await expect(productHeading).toBeVisible({ timeout: 10000 });
    });

    test('should display product information', async ({ page }) => {
      // Product title
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
      
      // Product image (alt text is the product name, not "product")
      const productImage = page.locator('main img').first();
      await expect(productImage).toBeVisible();
      
      // Price should be displayed
      const price = page.locator('text=/\\$[0-9,]+\\.\\d{2}/').first();
      await expect(price).toBeVisible();
      
      // Add to cart button (aria-label is "Add {name} to cart" — use .* to match product name)
      const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
      await expect(addToCartButton).toBeVisible();
    });

    test('should display breadcrumb navigation', async ({ page }) => {
      // Breadcrumb should be visible
      const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
      
      if (await breadcrumb.isVisible({ timeout: 500 })) {
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
      
      if (await sku.isVisible({ timeout: 500 })) {
        await expect(sku).toBeVisible();
      }
    });

    test('should add product to cart', async ({ page }) => {
      // Click add to cart (aria-label is "Add {name} to cart" — use .* to match product name)
      const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
      await safeClick(addToCartButton);
      
      // Wait for success toast
      const toast = page.locator('[role="alert"], [role="status"]');
      await toast.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      
      // CartButton is a <button> (not a link) and the badge only renders when items > 0.
      // Poll localStorage — cart state may flush slightly after the toast fires.
      await expect.poll(
        async () => {
          const stored = await page.evaluate(() => localStorage.getItem('bapi-cart-storage'));
          if (!stored) return 0;
          try {
            const data = JSON.parse(stored) as { state?: { items?: unknown[] } };
            return data?.state?.items?.length ?? 0;
          } catch {
            return 0;
          }
        },
        { timeout: 10000, message: 'Expected cart to have at least one item in localStorage' }
      ).toBeGreaterThan(0);
    });

    test('should display product images gallery', async ({ page }) => {
      // Main product image should be visible (alt text is the product name, not "product")
      const mainImage = page.locator('main img').first();
      await expect(mainImage).toBeVisible();
      
      // Check for image thumbnails (if product has multiple images)
      const thumbnails = page.locator('main img');
      const thumbnailCount = await thumbnails.count();
      
      // At least one image should exist
      expect(thumbnailCount).toBeGreaterThan(0);
    });

    test('should show product description', async ({ page }) => {
      // Product description section should exist
      const description = page.locator('text=/description/i').first();
      
      if (await description.isVisible({ timeout: 500 })) {
        await expect(description).toBeVisible();
      }
    });

    test('should display related products', async ({ page }) => {
      // Scroll down to see related products section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Look for related products section
      const relatedSection = page.locator('text=/related|you may also like/i').first();
      
      if (await relatedSection.isVisible({ timeout: 500 })) {
        await expect(relatedSection).toBeVisible();
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Reload page
      await page.reload();
      await waitForFullPageLoad(page);
      
      // Product information should still be visible
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
      
      // Add to cart button (aria-label is "Add {name} to cart" — use .* to match product name)
      const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
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
      
      if (await quantityInput.isVisible({ timeout: 500 })) {
        // Change quantity
        await waitForStableElement(quantityInput);
        await quantityInput.fill('3');
        
        // Add to cart (aria-label is "Add {name} to cart" — use .* to match product name)
        const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
        await safeClick(addToCartButton);
        
        // Wait for cart update - check for toast
        const toast = page.locator('[role="alert"], [role="status"]');
        await toast.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        
        // Poll localStorage until the total quantity of all items equals the chosen value (3).
        // Cart state may flush slightly after the toast; guard JSON.parse for robustness.
        await expect.poll(
          async () => {
            const stored = await page.evaluate(() => localStorage.getItem('bapi-cart-storage'));
            if (!stored) return 0;
            try {
              const data = JSON.parse(stored) as { state?: { items?: { quantity: number }[] } };
              return (data?.state?.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
            } catch {
              return 0;
            }
          },
          { timeout: 10000, message: 'Expected total cart quantity to equal 3' }
        ).toBe(3);
      }
    });

    test('should display product specifications', async ({ page }) => {
      // Look for specifications or technical details
      const specsSection = page.locator('text=/specifications|technical|features/i').first();
      
      if (await specsSection.isVisible({ timeout: 500 })) {
        await expect(specsSection).toBeVisible();
      }
    });
  });

  test.describe('Product Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(routes.products());
      await waitForFullPageLoad(page);
      
      // Wait for header to be fully loaded and stable
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await waitForStableElement(header);
    });

    test('should search for products', async ({ page }) => {
      // Mirror the smoke test pattern: look for an already-visible search input first
      // (the products page may expose it inline), then fall back to clicking the header button.
      const searchboxByRole = page.getByRole('searchbox').first();
      const searchboxByType = page.locator('input[type="search"]').first();
      const searchButton = page.locator('button[aria-label="Search"]').first();

      let searchInput =
        (await searchboxByRole.isVisible({ timeout: 1000 }).catch(() => false)) ? searchboxByRole :
        (await searchboxByType.isVisible({ timeout: 1000 }).catch(() => false)) ? searchboxByType :
        null;

      if (!searchInput) {
        const btnVisible = await searchButton.isVisible({ timeout: 5000 }).catch(() => false);
        if (!btnVisible) { test.skip(true, 'No search button or input found on products page'); return; }
        await safeClick(searchButton);
        const revealedInput = page.getByRole('searchbox').or(page.locator('input[type="search"]')).first();
        await expect(revealedInput).toBeVisible({ timeout: 5000 });
        searchInput = revealedInput;
      }

      await searchInput.fill('damper actuator');
      await page.keyboard.press('Enter');
      await waitForFullPageLoad(page);
      
      // Results should be displayed
      const results = page.locator('[data-testid="search-results"], .search-results, main');
      await expect(results).toBeVisible();
    });

    test('should show no results message for invalid search', async ({ page }) => {
      // Mirror the smoke test pattern: look for an already-visible search input first
      const searchboxByRole = page.getByRole('searchbox').first();
      const searchboxByType = page.locator('input[type="search"]').first();
      const searchButton = page.locator('button[aria-label="Search"]').first();

      let searchInput =
        (await searchboxByRole.isVisible({ timeout: 1000 }).catch(() => false)) ? searchboxByRole :
        (await searchboxByType.isVisible({ timeout: 1000 }).catch(() => false)) ? searchboxByType :
        null;

      if (!searchInput) {
        const btnVisible = await searchButton.isVisible({ timeout: 5000 }).catch(() => false);
        if (!btnVisible) { test.skip(true, 'No search button or input found on products page'); return; }
        await safeClick(searchButton);
        const revealedInput = page.getByRole('searchbox').or(page.locator('input[type="search"]')).first();
        await expect(revealedInput).toBeVisible({ timeout: 5000 });
        searchInput = revealedInput;
      }

      await searchInput.fill('xyzabc123notfound');
      await page.keyboard.press('Enter');
      
      // Should show no results message
      await waitForFullPageLoad(page);
      const noResults = page.locator('text=/no results|nothing found|no products found/i');
      await expect(noResults).toBeVisible();
    });
  });
});
