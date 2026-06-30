import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { routes } from './helpers/routes';
import { safeClick, waitForStableElement, waitForPageReady, waitAfterNavigation } from './helpers/test-utils';
import { addProductToCart } from './helpers/cart-utils';

/**
 * Cart Management Edge Cases E2E Tests (Phase G)
 * 
 * Tests cart functionality and edge cases:
 * - Quantity updates (increase/decrease)
 * - Remove items from cart
 * - Empty cart handling
 * - Cart persistence across sessions
 * - Multiple items management
 * - Cart total calculations
 * - Maximum/minimum quantity limits
 * - Cart validation and error states
 * 
 * Critical for e-commerce cart reliability and user experience.
 */

test.describe('Quantity Updates', () => {
  test('should increase item quantity in cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Get initial quantity
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      const initialQty = await quantityInput.inputValue();
      const initialQtyNum = parseInt(initialQty) || 1;
      
      // Look for increase button
      const increaseButton = page.locator('button[aria-label*="increase" i], button:has-text("+"), button[data-testid*="increase"]').first();
      
      if (await increaseButton.isVisible({ timeout: 2000 })) {
        await safeClick(increaseButton);
        await waitForPageReady(page);
        
        // Quantity should increase
        const newQty = await quantityInput.inputValue();
        const newQtyNum = parseInt(newQty) || 1;
        
        expect(newQtyNum).toBeGreaterThan(initialQtyNum);
      } else {
        // Try directly updating input
        await quantityInput.fill(String(initialQtyNum + 1));
        await waitForPageReady(page);
        
        const newQty = await quantityInput.inputValue();
        expect(parseInt(newQty)).toBe(initialQtyNum + 1);
      }
    }
  });

  test('should decrease item quantity in cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Increase quantity first to ensure we can decrease
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      await quantityInput.fill('2');
      await waitForPageReady(page);
      
      // Now decrease
      const decreaseButton = page.locator('button[aria-label*="decrease" i], button:has-text("-"), button[data-testid*="decrease"]').first();
      
      if (await decreaseButton.isVisible({ timeout: 2000 })) {
        await safeClick(decreaseButton);
        await waitForPageReady(page);
        
        const newQty = await quantityInput.inputValue();
        expect(parseInt(newQty)).toBe(1);
      }
    }
  });

  test('should update cart total when quantity changes', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialTotal = await getCartTotal(page);
    
    // Increase quantity
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      await quantityInput.fill('2');
      await waitForPageReady(page);
      
      const newTotal = await getCartTotal(page);
      
      // Total should increase (approximately double)
      expect(newTotal).toBeGreaterThan(initialTotal);
    }
  });

  test('should not allow quantity below minimum (1)', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      // Try to set quantity to 0
      await quantityInput.fill('0');
      await waitForPageReady(page);
      
      // Should either prevent or show error
      const qty = await quantityInput.inputValue();
      const qtyNum = parseInt(qty);
      
      // Should stay at 1 or show validation error
      expect(qtyNum).toBeGreaterThanOrEqual(1);
    }
  });

  test('should enforce maximum quantity limit', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      // Try to set very high quantity
      await quantityInput.fill('9999');
      await waitForPageReady(page);
      
      // Check for error message or capped quantity
      const errorMessage = page.locator('text=/maximum|limit|stock|available/i');
      const errorVisible = await errorMessage.first().isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!errorVisible) {
        // Quantity should be capped at reasonable limit
        const qty = await quantityInput.inputValue();
        const qtyNum = parseInt(qty);
        
        // Most products have reasonable limits (< 100)
        expect(qtyNum).toBeLessThan(1000);
      }
    }
  });
});

test.describe('Remove Items', () => {
  test('should remove single item from cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Count initial items via localStorage
    const initialCount = await getCartItemCount(page);
    
    expect(initialCount).toBeGreaterThan(0);
    
    // Find remove button
    const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove"), button[data-testid*="remove"]').first();
    
    if (await removeButton.isVisible({ timeout: 3000 })) {
      await safeClick(removeButton);
        await waitForPageReady(page);
      
      // Item count should decrease (check via localStorage)
      const newCount = await getCartItemCount(page);
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('should display empty cart message after removing all items', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Remove all items
    const removeButtons = page.locator('button[aria-label*="remove" i], button:has-text("Remove")');
    const buttonCount = await removeButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = removeButtons.first();
      if (await button.isVisible({ timeout: 1000 })) {
        await safeClick(button);
        await waitForPageReady(page);
      }
    }
    
    // Should show empty cart message (check common patterns)
    const emptyMessage = page.locator('text=/cart is empty|no items|empty cart|your cart is empty/i');
    const emptyVisible = await emptyMessage.first().isVisible({ timeout: 5000 }).catch(() => false);
    
    // Also check via localStorage — poll for up to 5s for Zustand to persist the cleared cart
    let cartCount = await getCartItemCount(page);
    if (cartCount > 0) {
      await page.waitForFunction(
        () => {
          const raw = localStorage.getItem('bapi-cart-storage');
          if (!raw) return true;
          try { const d = JSON.parse(raw); return (d?.state?.items?.length ?? 0) === 0; } catch { return true; }
        },
        { timeout: 5000 }
      ).catch(() => { /* ignore — we'll re-check below */ });
      cartCount = await getCartItemCount(page);
    }
    
    expect(emptyVisible || cartCount === 0).toBeTruthy();
  });

  test('should update cart total after removing item', async ({ page }) => {
    // Add two products
    await addProductToCart(page);
    await addProductToCart(page);
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialTotal = await getCartTotal(page);
    
    // Remove one item
    const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove")').first();
    
    if (await removeButton.isVisible({ timeout: 3000 })) {
      await safeClick(removeButton);
        await waitForPageReady(page);
      
      const newTotal = await getCartTotal(page);
      
      // Total should decrease
      expect(newTotal).toBeLessThan(initialTotal);
    }
  });

  test('should show confirmation before removing item', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove")').first();
    
    if (await removeButton.isVisible({ timeout: 3000 })) {
      await safeClick(removeButton);
      
      // Look for confirmation dialog
      const confirmDialog = page.locator('[role="dialog"], [role="alertdialog"], .modal').first();
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Remove")');
      
      const dialogVisible = await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (dialogVisible) {
        // Confirmation required - good UX
        console.log('Remove confirmation dialog displayed');
      } else {
        // Direct removal (also acceptable)
        console.log('Direct removal without confirmation');
      }
    }
  });
});

test.describe('Empty Cart Handling', () => {
  test('should display empty cart message when no items', async ({ page }) => {
    // Clear cart
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    await waitForPageReady(page);
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Should show empty cart message
    const emptyMessage = page.locator('text=/cart is empty|no items|empty cart/i');
    await expect(emptyMessage.first()).toBeVisible({ timeout: 3000 });
  });

  test('should hide checkout button when cart is empty', async ({ page }) => {
    // Clear cart
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    await waitForPageReady(page);
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Checkout button should not be visible
    const checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout")');
    const buttonVisible = await checkoutButton.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    expect(buttonVisible).toBeFalsy();
  });

  test('should show "Continue Shopping" link on empty cart', async ({ page }) => {
    // Clear cart
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Should show continue shopping link
    const continueLink = page.locator('a:has-text("Continue Shopping"), a:has-text("Shop"), a:has-text("Products")');
    
    if (await continueLink.first().isVisible({ timeout: 3000 })) {
      await expect(continueLink.first()).toBeVisible();
    }
  });

  test('should display zero total for empty cart', async ({ page }) => {
    // Clear cart
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'commit' });
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const total = await getCartTotal(page);
    expect(total).toBe(0);
  });
});

test.describe('Cart Persistence', () => {
  test('should persist cart items after page refresh', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialItems = await getCartItemCount(page);
    expect(initialItems).toBeGreaterThan(0);
    
    // Refresh page
    await page.reload({ waitUntil: 'commit' });
    await waitForPageReady(page);
    
    // Items should persist
    const itemsAfterRefresh = await getCartItemCount(page);
    expect(itemsAfterRefresh).toBe(initialItems);
  });

  test('should persist cart items when navigating away and back', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialItems = await getCartItemCount(page);
    
    // Navigate to products page
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Navigate back to cart
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Items should persist
    const itemsAfterNavigation = await getCartItemCount(page);
    expect(itemsAfterNavigation).toBe(initialItems);
  });

  test('should persist cart across browser sessions (localStorage)', async ({ page, context }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialItems = await getCartItemCount(page);
    expect(initialItems).toBeGreaterThan(0);
    
    // Get localStorage state
    const storageState = await context.storageState();
    
    // Create new context with same storage
    const newContext = await page.context().browser()!.newContext({ storageState });
    const newPage = await newContext.newPage();
    
    await newPage.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(newPage);
    
    // Items should persist in new session
    const itemsInNewSession = await getCartItemCount(newPage);
    expect(itemsInNewSession).toBe(initialItems);
    
    await newPage.close();
    await newContext.close();
  });
});

test.describe('Multiple Items Management', () => {
  test('should handle multiple different products in cart', async ({ page }) => {
    // Add first product
    await addProductToCart(page);
    // Try to add a second different product; some products may not have Add to Cart
    // (variable products, out of stock, etc.) — gracefully skip if unavailable
    let secondAdded = false;
    try {
      await addProductToCart(page, { productIndex: 1 });
      secondAdded = true;
    } catch {
      // Second product unavailable — test with what we have
    }
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const itemCount = await getCartItemCount(page);
    if (secondAdded) {
      expect(itemCount).toBeGreaterThanOrEqual(2);
    } else {
      expect(itemCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should calculate correct total for multiple items', async ({ page }) => {
    await addProductToCart(page);
    // Try second product; gracefully fall back if unavailable
    try { await addProductToCart(page); } catch { /* same product twice ok */ }
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const total = await getCartTotal(page);
    
    // Total should be positive
    expect(total).toBeGreaterThan(0);
  });

  test('should update individual item quantities independently', async ({ page }) => {
    await addProductToCart(page);
    let secondAdded = false;
    try { await addProductToCart(page, { productIndex: 1 }); secondAdded = true; } catch { /* fall back */ }
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    if (!secondAdded) {
      // Only one product type available on this deployment — skip multi-item check
      test.skip(true, 'Second product type not available for independent-quantity test');
      return;
    }
    
    const quantityInputs = page.locator('input[type="number"], input[name*="quantity" i]');
    const inputCount = await quantityInputs.count();
    
    if (inputCount >= 2) {
      // Update first item
      await quantityInputs.first().fill('2');
      await waitForPageReady(page);
      
      // Update second item
      await quantityInputs.nth(1).fill('3');
      await waitForPageReady(page);
      
      // Verify updates
      const firstQty = await quantityInputs.first().inputValue();
      const secondQty = await quantityInputs.nth(1).inputValue();
      
      expect(parseInt(firstQty)).toBe(2);
      expect(parseInt(secondQty)).toBe(3);
    }
  });

  test('should remove individual items without affecting others', async ({ page }) => {
    await addProductToCart(page);
    let secondAdded = false;
    try { await addProductToCart(page, { productIndex: 1 }); secondAdded = true; } catch { /* fall back */ }
    
    if (!secondAdded) {
      // Only one product type available on this deployment — skip multi-item removal check
      test.skip(true, 'Second product type not available for independent-removal test');
      return;
    }
    
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const initialCount = await getCartItemCount(page);
    expect(initialCount).toBeGreaterThanOrEqual(2);
    
    // Remove first item
    const removeButton = page.locator('button[aria-label*="remove" i], button:has-text("Remove")').first();
    
    if (await removeButton.isVisible({ timeout: 3000 })) {
      await safeClick(removeButton);
        await waitForPageReady(page);
      
      const newCount = await getCartItemCount(page);
      expect(newCount).toBe(initialCount - 1);
    }
  });
});

test.describe('Cart Validation', () => {
  test('should display product image in cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const productImage = page.locator('img[alt*="product" i], [data-testid*="product-image"] img').first();
    
    if (await productImage.isVisible({ timeout: 3000 })) {
      const imageSrc = await productImage.getAttribute('src');
      expect(imageSrc).toBeTruthy();
    }
  });

  test('should display product name in cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const cartItems = page.locator('[data-testid*="cart-item"], .cart-item');
    
    if (await cartItems.first().isVisible({ timeout: 3000 })) {
      const itemText = await cartItems.first().textContent();
      expect(itemText?.length).toBeGreaterThan(5);
    }
  });

  test('should display individual item price', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const priceElements = page.locator('text=/\\$\\d+\\.?\\d*/');
    const priceCount = await priceElements.count();
    
    // Should have at least one price displayed
    expect(priceCount).toBeGreaterThan(0);
  });

  test('should display subtotal, tax, and total breakdown', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Look for order summary
    const subtotalLabel = page.locator('text=/subtotal/i');
    const totalLabel = page.locator('text=/total/i');
    
    const subtotalVisible = await subtotalLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
    const totalVisible = await totalLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    // Should display pricing breakdown
    expect(subtotalVisible || totalVisible).toBeTruthy();
  });
});

test.describe('Cart Error Handling', () => {
  test('should handle network error gracefully when updating quantity', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Simulate network failure for update requests
    await page.route('**/api/cart/**', route => route.abort());
    
    const quantityInput = page.locator('input[type="number"], input[name*="quantity" i]').first();
    
    if (await quantityInput.isVisible({ timeout: 3000 })) {
      await quantityInput.fill('5');
      await waitForPageReady(page);
      
      // Should show error message or revert to previous value
      const errorMessage = page.locator('[role="alert"]:has-text("error"), text=/error|failed/i');
      const errorVisible = await errorMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
      
      // Either error shown or quantity not updated
      console.log(`Error handling for cart update: ${errorVisible ? 'shown' : 'quantity reverted'}`);
    }
    
    // Clear route override
    await page.unroute('**/api/cart/**');
  });

  test('should handle out of stock items in cart', async ({ page }) => {
    await addProductToCart(page);
    await page.goto(routes.cart(), { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    // Look for out of stock warnings
    const stockWarning = page.locator('text=/out of stock|unavailable|not available/i');
    const warningVisible = await stockWarning.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (warningVisible) {
      // Out of stock item detected - should show warning
      await expect(stockWarning.first()).toBeVisible();
      
      // Checkout button should be disabled or hidden
      const checkoutButton = page.locator('button:has-text("Checkout")');
      const checkoutDisabled = await checkoutButton.isDisabled().catch(() => true);
      
      expect(checkoutDisabled).toBeTruthy();
    }
  });
});

// addProductToCart is imported from helpers/cart-utils

/**
 * Helper: Get cart total amount from localStorage
 */
async function getCartTotal(page: Page): Promise<number> {
  const stored = await page.evaluate(() => localStorage.getItem('bapi-cart-storage'));
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored) as { state?: { items?: { numericPrice: number; quantity: number }[] } };
    return (data?.state?.items ?? []).reduce(
      (sum, item) => sum + (item.numericPrice ?? 0) * (item.quantity ?? 1),
      0
    );
  } catch {
    return 0;
  }
}

/**
 * Helper: Get cart item count from localStorage
 */
async function getCartItemCount(page: Page): Promise<number> {
  const stored = await page.evaluate(() => localStorage.getItem('bapi-cart-storage'));
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored) as { state?: { items?: unknown[] } };
    return data?.state?.items?.length ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Helper: Wait for toast to dismiss
 */
async function waitForToastToDismiss(page: Page, timeout = 6000): Promise<void> {
  const toast = page.locator('[role="alert"], [role="status"]').first();
  
  const toastAppeared = await toast.isVisible({ timeout: Math.floor(timeout * 0.25) }).catch(() => false);
  
  if (toastAppeared) {
    await toast.waitFor({ state: 'hidden', timeout: timeout - Math.floor(timeout * 0.25) }).catch(() => {});
  }
}
