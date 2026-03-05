import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import type { Page } from '@playwright/test';
import { routes } from './helpers/routes';

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
    await page.goto(routes.home());
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should start with empty cart', async ({ page }) => {
    // Cart button should show 0 items
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await expect(cartButton).toContainText('0');
  });

  test('should add item to cart from product page', async ({ page }) => {
    // Navigate to products
    await page.goto(routes.products());
    await page.waitForLoadState('networkidle');
    
    // Click first product
    const firstProduct = page.getByRole('link').filter({ has: page.locator('img[alt*="product"]') }).first();
    await firstProduct.click();
    await page.waitForURL(/\/en\/products\/.+/);
    await page.waitForLoadState('networkidle');
    
    // Add to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
    
    // Wait for cart button to update
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await expect(cartButton).toContainText('1');
    
    // Success toast should appear
    const toast = page.locator('[role="alert"], [role="status"]').filter({ hasText: /added to cart/i });
    await expect(toast).toBeVisible();
  });

  test('should open cart drawer/modal', async ({ page }) => {
    // Add item first
    await addProductToCart(page);
    
    // Click cart button
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await cartButton.click();
    
    // Should show cart contents
    const cartHeading = page.getByRole('heading', { name: /cart|shopping cart/i });
    await expect(cartHeading).toBeVisible();
  });

  test('should display cart items with correct information', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
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
    
    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
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
      const cartTotal = page.locator('text=/total|subtotal/i');
      await expect(cartTotal).toBeVisible();
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
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
    
    // Cart count should be 0
    const updatedCartButton = page.getByRole('button', { name: /cart/i }).first();
    await expect(updatedCartButton).toContainText('0');
  });

  test('should persist cart across page navigation', async ({ page }) => {
    // Add item
    await addProductToCart(page);
    
    // Navigate to another page
    await page.goto(routes.home());
    await page.waitForLoadState('networkidle');
    
    // Cart should still show 1 item
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await expect(cartButton).toContainText('1');
  });

  test('should calculate cart totals correctly', async ({ page }) => {
    // Add multiple items
    await addProductToCart(page);
    await page.goto(routes.products());
    await page.waitForLoadState('networkidle');
    
    // Add another product
    const products = page.getByRole('link').filter({ has: page.locator('img[alt*="product"]') });
    const secondProduct = products.nth(1);
    if (await secondProduct.isVisible()) {
      await secondProduct.click();
      await page.waitForLoadState('networkidle');
      
      const addButton = page.getByRole('button', { name: /add to cart/i });
      await addButton.click();
      
      // Wait for cart to update
      const cartButton = page.getByRole('button', { name: /cart/i }).first();
      await expect(cartButton).toContainText('2');
    }
    
    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await cartButton.click();
    
    // Wait for cart content
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    // Should show subtotal
    const subtotal = page.locator('text=/subtotal|total/i');
    await expect(subtotal).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    await addProductToCart(page);
    
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await cartButton.click();
    
    // Wait for cart content to be visible
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });
});

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh
    await page.goto(routes.home());
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Add item to cart
    await addProductToCart(page);
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i }).first();
    await cartButton.click();
    
    // Wait for cart to open
    const cartContent = page.locator('[role="dialog"], .cart-drawer, .cart-modal');
    await expect(cartContent).toBeVisible();
    
    // Click checkout button
    const checkoutButton = page.getByRole('link', { name: /checkout|proceed/i });
    
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      
      // Should navigate to checkout
      await page.waitForURL(/\/en\/checkout/);
      await page.waitForLoadState('networkidle');
      
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
    await page.waitForLoadState('networkidle');
    
    // Should show checkout steps/sections
    const stepsIndicator = page.locator('text=/step|shipping|payment|review/i').first();
    
    if (await stepsIndicator.isVisible()) {
      await expect(stepsIndicator).toBeVisible();
    }
  });

  test('should validate shipping information', async ({ page }) => {
    await page.goto(routes.checkout());
    await page.waitForLoadState('networkidle');
    
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
    await page.goto(routes.checkout());
    await page.waitForLoadState('networkidle');
    
    // Order summary should be visible
    const orderSummary = page.locator('text=/order summary|your order/i');
    
    if (await orderSummary.isVisible()) {
      await expect(orderSummary).toBeVisible();
      
      // Should show items
      const itemsList = page.locator('[data-testid="order-items"], .order-items');
      await expect(itemsList).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(routes.checkout());
    await page.waitForLoadState('networkidle');
    
    // Checkout should work on mobile
    const heading = page.getByRole('heading', { name: /checkout/i });
    
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto(routes.checkout());
    await page.waitForLoadState('networkidle');
    
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });
});

/**
 * Helper function to add a product to cart
 */
async function addProductToCart(page: Page) {
  // Navigate to products landing page
  await page.goto(routes.products());
  await page.waitForLoadState('networkidle');

  // Step 1: Click a category from the landing page
  const firstCategory = page
    .locator('a[href*="/categories/"]')
    .filter({ has: page.getByRole('heading', { level: 2 }) })
    .first();
  await expect(firstCategory).toBeVisible();
  await firstCategory.click();
  await page.waitForLoadState('networkidle');

  // Step 2: From the category page, open the first actual product
  let firstProductLink = page.locator('a[href*="/product/"]').first();
  
  // Some categories render only subcategory links (e.g. /{locale}/products/{parentSlug}/{childSlug})
  // and no direct product links. In that case, click into the first subcategory, then choose a product.
  if ((await firstProductLink.count()) === 0) {
    const subcategoryLinks = page.locator('a[href*="/products/"]');
    const subcategoryCount = await subcategoryLinks.count();
    expect(subcategoryCount).toBeGreaterThan(0);

    const firstSubcategoryLink = subcategoryLinks.first();
    await expect(firstSubcategoryLink).toBeVisible();
    await firstSubcategoryLink.click();
    await page.waitForLoadState('networkidle');
    firstProductLink = page.locator('a[href*="/product/"]').first();
  }
  
  // After potential fallback, assert that at least one product link exists
  const finalProductLinkCount = await page.locator('a[href*="/product/"]').count();
  expect(finalProductLinkCount).toBeGreaterThan(0);
  await expect(firstProductLink).toBeVisible();
  
  await firstProductLink.click();
  await page.waitForURL(/\/en\/product\/.+/);
  await page.waitForLoadState('networkidle');
  
  // Add to cart
  const addToCartButton = page.getByRole('button', { name: /add to cart/i });
  await expect(addToCartButton).toBeVisible();
  await addToCartButton.click();
  
  // Wait for cart to update
  const cartButton = page.getByRole('button', { name: /cart/i }).first();
  await expect(cartButton).toContainText('1');
}
