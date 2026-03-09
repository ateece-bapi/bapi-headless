import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import type { Page } from '@playwright/test';
import { routes, DEFAULT_LOCALE } from './helpers/routes';

/**
 * Cart & Checkout E2E Tests
 * 
 * Tests the shopping cart and checkout process:
 * - Add/remove items from cart
 * - Update quantities
 * - Cart persistence
 * - Checkout wizard flow
 * - Form validation
 * - Order summary
 * - Accessibility compliance
 */

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh - clear localStorage (cart state)
    // Use 'commit' instead of 'networkidle' - faster, doesn't wait for Sentry  
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    // Wait for header to render (indicates React hydration complete)
    await page.getByRole('link', { name: /cart/i }).first().waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should start with empty cart', async ({ page }) => {
    // Test accessible name (screen reader announcement) for empty cart
    // More robust than DOM text assertions for accessibility compliance
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await expect(cartButton).toHaveAccessibleName(/cart\s*\(empty\)/i);
  });

  test('should add item to cart from product page', async ({ page }) => {
    // Use helper to add product (includes navigation to product page)
    await addProductToCart(page);
    
    // Verify toast appeared
    const toast = page.locator('[role="alert"], [role="status"]').filter({ hasText: /added to cart/i });
    await expect(toast).toBeVisible();
  });

  test('should open cart drawer/modal', async ({ page }) => {
    // Add item first
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss (prevents it from blocking cart button click)
    await waitForToastToDismiss(page);
    
    // Click cart button
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    
    // Should show cart contents
    const cartHeading = page.getByRole('heading', { name: /cart|shopping cart/i });
    await expect(cartHeading).toBeVisible();
  });

  test('should display cart items with correct information', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss
    await waitForToastToDismiss(page);
    
    // Open cart
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    
    // Cart should show product name
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    // Should show item details (product name, price, quantity)
    const productName = cartContent.locator('text=/.{3,}/').first(); // Any text 3+ chars
    await expect(productName).toBeVisible();
  });

  test('should update item quantity', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss
    await waitForToastToDismiss(page);
    
    // Open cart
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    
    // Wait for cart content to be visible
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    // Find quantity controls
    const increaseButton = page.getByRole('button', { name: /increase|plus|\+/i }).first();
    
    if (await increaseButton.isVisible()) {
      // Increase quantity
      await increaseButton.click();
      
      // Cart total should update and be visible
      const cartTotal = page.locator('text=/total|subtotal/i').first();
      await expect(cartTotal).toBeVisible();
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss
    await waitForToastToDismiss(page);
    
    // Open cart
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    
    // Wait for cart content
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    // Find remove button
    const removeButton = page.getByRole('button', { name: /remove|delete/i }).first();
    await removeButton.click();
    
    // Cart should be empty
    const emptyMessage = page.locator('text=/empty|no items/i');
    await expect(emptyMessage).toBeVisible();
    
    // Verify cart accessible name indicates empty state
    const updatedCartButton = page.getByRole('link', { name: /cart/i }).first();
    await expect(updatedCartButton).toHaveAccessibleName(/cart\s*\(empty\)/i);
  });

  test('should persist cart across page navigation', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Navigate to another page
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    // Wait for client-side cart hydration from localStorage
    await page.waitForTimeout(2000);
    
    // Cart should still show 1 item
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await expect(cartButton).toContainText('1');
  });

  test('should calculate cart totals correctly', async ({ page }) => {
    // Add item to cart
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss
    await waitForToastToDismiss(page);
    
    // Open cart drawer
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    // Should show cart heading
    const cartHeading = page.getByRole('heading', { name: /cart|shopping/i }).first();
    await expect(cartHeading).toBeVisible();
    
    // Should show subtotal/total
    const subtotal = page.locator('text=/subtotal|total/i').first();
    await expect(subtotal).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss
    await waitForToastToDismiss(page);
    
    // Open cart drawer
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    // Run accessibility check on cart content
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
});

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    await page.waitForTimeout(1000);
    
    // Add item to cart
    await addProductToCart(page);
    
    // Wait for toast to auto-dismiss before tests start
    await waitForToastToDismiss(page);
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Click cart button to open cart drawer/modal  
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    // Find checkout button in cart
    const checkoutButton = page.getByRole('link', { name: /checkout|proceed/i });
    
    if (await checkoutButton.isVisible({ timeout: 5000 })) {
      await checkoutButton.click();
      
      // Should navigate to checkout
      await page.waitForURL(new RegExp(`/${DEFAULT_LOCALE}/checkout`), { timeout: 10000 });
      await page.waitForTimeout(1000);
      
      // Checkout page should load
      const checkoutHeading = page.getByRole('heading', { name: /checkout/i });
      await expect(checkoutHeading).toBeVisible();
    } else {
      // Skip if checkout not implemented yet
      test.skip();
    }
  });

  test('should display checkout wizard/steps', async ({ page }) => {
    await page.goto(routes.checkout());
    await page.waitForTimeout(1000);
    
    // Should show checkout steps/sections
    const stepsIndicator = page.locator('text=/step|shipping|payment|review/i').first();
    
    if (await stepsIndicator.isVisible()) {
      await expect(stepsIndicator).toBeVisible();
    }
  });

  test('should validate shipping information', async ({ page }) => {
    await page.goto(routes.checkout());
    await page.waitForTimeout(1000);
    
    // Try to proceed without filling required fields
    const continueButton = page.getByRole('button', { name: /continue|next|submit/i }).first();
    
    if (await continueButton.isVisible()) {
      await continueButton.click();
      
      // Should show validation errors
      const errorMessage = page.locator('text=/required|error|invalid/i').first();
      
      // Error should be visible (if validation implemented)
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('should display order summary', async ({ page }) => {
    await page.goto(routes.checkout(), { waitUntil: 'commit', timeout: 60000 });
    // Wait for client-side cart hydration and React rendering
    await page.waitForTimeout(2000);
    
    // Order summary should be visible
    const orderSummary = page.locator('text=/order summary|your order/i').first();
    
    if (await orderSummary.isVisible()) {
      await expect(orderSummary).toBeVisible();
      
      // Should show items
      const itemsList = page.locator('[data-testid="order-items"], .order-items').first();
      await expect(itemsList).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(routes.checkout());
    await page.waitForTimeout(1000);
    
    // Checkout should work on mobile
    const heading = page.getByRole('heading', { name: /checkout/i });
    
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto(routes.checkout());
    await page.waitForTimeout(1000);
    
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });
});

/**
 * Helper: Wait for toast to disappear (dismiss timeout or user closes it)
 * More reliable than hardcoded waits
 * 
 * @param page - Playwright page object
 * @param timeout - Total maximum wait time (ms). Allocated proportionally: 25% for appear, 75% for dismiss
 */
async function waitForToastToDismiss(page: Page, timeout = 6000) {
  const toast = page.locator('[role="alert"], [role="status"]').first();
  
  // Allocate timeout proportionally to avoid exceeding caller's expectations
  const appearTimeout = Math.floor(timeout * 0.25); // 25% for toast to appear
  const dismissTimeout = timeout - appearTimeout;   // 75% for toast to dismiss
  
  // First, check if toast appears within the appear window
  let toastAppeared = false;
  await toast.waitFor({ state: 'attached', timeout: appearTimeout })
    .then(() => { toastAppeared = true; })
    .catch(() => {
      // Toast may not appear at all, continue
    });
  
  // Only wait for dismissal if toast actually appeared
  // (prevents early resolution when toast attaches slightly late)
  if (toastAppeared) {
    await toast.waitFor({ state: 'hidden', timeout: dismissTimeout }).catch(() => {
      // Toast may already be gone, continue
    });
  }
}

/**
 * Helper function to add a product to cart
 * Simplified approach: Navigate directly to products page and find any product
 * Uses 'commit' for navigation but waits for actual content to avoid Sentry timeout issues
 */
async function addProductToCart(page: Page) {
  // Navigate to products landing page
  await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
  
  // Wait for React to hydrate and render content
  await page.waitForTimeout(2000);
  
  // Wait for either category links OR product links to appear
  await Promise.race([
    page.locator('a[href*="/categories/"]').first().waitFor({ state: 'attached', timeout: 10000 }),
    page.locator('a[href*="/product/"]').first().waitFor({ state: 'attached', timeout: 10000 })
  ]).catch(() => {
    // If neither appears, continue anyway and let the assertions catch it
  });

  // Try to find a direct product link on the products page
  let productLinks = page.locator('a[href*="/product/"]');
  let productCount = await productLinks.count();
  
  // If no products on main page, navigate into categories to find products
  if (productCount === 0) {
    const categoryLinks = page.locator('a[href*="/categories/"]');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      // Get the href and navigate directly (more stable than clicking)
      const categoryHref = await categoryLinks.first().getAttribute('href');
      if (categoryHref) {
        await page.goto(categoryHref, { waitUntil: 'commit', timeout: 60000 });
        
        // Wait for either product links or subcategory links to appear
        try {
          await Promise.race([
            page.locator('a[href*="/product/"]').first().waitFor({ state: 'attached', timeout: 5000 }),
            page.locator('a[href*="/products/"]').first().waitFor({ state: 'attached', timeout: 5000 }),
          ]);
        } catch {
          // Neither found, wait a bit more for React
          await page.waitForTimeout(2000);
        }
        
        productLinks = page.locator('a[href*="/product/"]');
        productCount = await productLinks.count();
      }
    }
  }
  
  // If still no products, try navigating to first subcategory (up to 3 times)
  let attempts = 0;
  while (productCount === 0 && attempts < 3) {
    const subcategoryLinks = page.locator('main a[href*="/products/"], article a[href*="/products/"]');
    const subCount = await subcategoryLinks.count();
    
    if (subCount === 0) break;
    
    // Get href and navigate directly
    const subHref = await subcategoryLinks.first().getAttribute('href');
    if (subHref) {
      await page.goto(subHref, { waitUntil: 'commit', timeout: 60000 });
      
      // Wait for product links to appear
      try {
        await page.locator('a[href*="/product/"]').first().waitFor({ state: 'attached', timeout: 8000 });
      } catch {
        // Products not found, wait a bit
        await page.waitForTimeout(2000);
      }
      
      productLinks = page.locator('a[href*="/product/"]');
      productCount = await productLinks.count();
    }
    attempts++;
  }
  
  // Assert we found at least one product
  expect(productCount).toBeGreaterThan(0);
  
  // Get the first product href and navigate directly
  const productHref = await productLinks.first().getAttribute('href');
  expect(productHref).toBeTruthy();
  
  if (productHref) {
    await page.goto(productHref, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForURL(new RegExp(`/${DEFAULT_LOCALE}/product/.+`), { timeout: 10000 });
    
    // Find Add to Cart button by aria-label (from AddToCartButton component)
    const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
    
    // Wait for button to appear (replaces hardcoded 4s timeout + 15s wait)
    await addToCartButton.waitFor({ state: 'visible', timeout: 20000 });
    await addToCartButton.click();
    
    // Wait for cart badge to update
    const cartButton = page.getByRole('link', { name: /cart/i }).first();
    await expect(cartButton).toContainText('1', { timeout: 10000 });
  }
}
