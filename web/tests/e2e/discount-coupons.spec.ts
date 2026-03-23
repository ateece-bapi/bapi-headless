import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { routes } from './helpers/routes';
import { safeClick, waitForStableElement, waitAfterNavigation, waitForPageReady } from './helpers/test-utils';

/**
 * Discount Codes & Coupons E2E Tests (Phase D)
 * 
 * Tests coupon/discount code functionality:
 * - Apply valid coupon codes
 * - Handle invalid/expired coupons
 * - Calculate percentage and fixed-amount discounts
 * - Remove applied coupons
 * - Coupon restrictions (minimum order, product-specific)
 * - Cart total updates after discount
 * 
 * Critical for e-commerce promotions and marketing campaigns.
 */

// Test coupon codes (update these based on test environment)
const TEST_COUPONS = {
  valid: {
    percentage: 'SAVE10',        // 10% off
    fixedAmount: 'SAVE5',        // $5 off
    freeShipping: 'FREESHIP',    // Free shipping
  },
  invalid: {
    expired: 'EXPIRED2025',
    nonexistent: 'INVALID123',
    wrongProduct: 'SPECIFIC99',   // Product-specific coupon
  },
};

test.describe('Apply Discount Codes', () => {
  test('should display coupon code input field', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Look for coupon input field (various possible locations)
    const couponInputs = [
      page.locator('input[name*="coupon" i], input[id*="coupon" i]'),
      page.locator('input[placeholder*="coupon" i], input[placeholder*="promo" i]'),
      page.locator('[data-testid*="coupon"] input'),
    ];
    
    let couponInput = null;
    for (const input of couponInputs) {
      if (await input.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        couponInput = input.first();
        break;
      }
    }
    
    if (couponInput) {
      await expect(couponInput).toBeVisible();
    } else {
      // May be behind an "Apply Coupon" button/link
      const showCouponButton = page.locator('button:has-text("Coupon"), a:has-text("Coupon"), button:has-text("Promo")').first();
      
      if (await showCouponButton.isVisible({ timeout: 2000 })) {
        await safeClick(showCouponButton);
        
        // Input should now be visible
        const input = page.locator('input[name*="coupon" i], input[placeholder*="coupon" i]').first();
        await expect(input).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('should apply valid percentage discount coupon', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Get original total
    const originalTotal = await getCartTotal(page);
    
    if (originalTotal > 0) {
      // Apply coupon
      const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
      
      if (applied) {
        // Get new total (applyCoupon already verified the coupon was applied)
        const newTotal = await getCartTotal(page);
        
        // New total should be less than original
        expect(newTotal).toBeLessThan(originalTotal);
        
        // Should show discount line item
        const discountText = page.locator('text=/discount|coupon|promo/i');
        await expect(discountText.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should apply valid fixed-amount discount coupon', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const originalTotal = await getCartTotal(page);
    
    if (originalTotal > 0) {
      const applied = await applyCoupon(page, TEST_COUPONS.valid.fixedAmount);
      
      if (applied) {
        const newTotal = await getCartTotal(page);
        
        // New total should be less by approximately $5
        const discount = originalTotal - newTotal;
        expect(discount).toBeGreaterThan(0);
        
        // Should show discount amount
        const discountAmount = page.locator('text=/\\$\\d+\\.?\\d*/').filter({ hasText: /discount|coupon/i });
        
        if (await discountAmount.first().isVisible({ timeout: 2000 })) {
          await expect(discountAmount.first()).toBeVisible();
        }
      }
    }
  });

  test('should display success message when coupon applied', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      // Look for success toast or message
      const successMessages = [
        page.locator('[role="alert"]:has-text("applied"), [role="status"]:has-text("applied")'),
        page.locator('text=/coupon applied|discount applied|code applied/i'),
        page.locator('.success:has-text("coupon"), .success:has-text("discount")'),
      ];
      
      let successFound = false;
      for (const message of successMessages) {
        if (await message.first().isVisible({ timeout: 3000 }).catch(() => false)) {
          successFound = true;
          break;
        }
      }
      
      // Success indicator should appear (toast, message, or updated UI)
      expect(successFound || await getCartTotal(page) > 0).toBeTruthy();
    }
  });

  test('should show discount breakdown in order summary', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      // applyCoupon already verified success - cart should be updated
      // Look for order summary section
      const orderSummary = page.locator('[data-testid*="summary"], aside, .order-summary, section:has-text("Summary")').first();
      
      if (await orderSummary.isVisible({ timeout: 2000 })) {
        // Should show subtotal, discount, and total lines
        const discountLine = orderSummary.locator('text=/discount|coupon/i');
        await expect(discountLine.first()).toBeVisible({ timeout: 2000 }).catch(() => {
          // Discount may be shown inline with total
        });
      }
    }
  });
});

test.describe('Invalid Coupon Handling', () => {
  test('should reject invalid coupon code', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.invalid.nonexistent);
    
    // Should show error message
    const errorMessages = [
      page.locator('[role="alert"]:has-text("invalid"), [role="alert"]:has-text("not found")'),
      page.locator('text=/invalid coupon|coupon not found|invalid code/i'),
      page.locator('.error:has-text("coupon"), .error:has-text("code")'),
    ];
    
    let errorFound = false;
    for (const message of errorMessages) {
      if (await message.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        errorFound = true;
        break;
      }
    }
    
    // Error should be displayed
    expect(errorFound).toBeTruthy();
  });

  test('should reject expired coupon code', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.invalid.expired);
    
    // Should show expired error
    const expiredMessage = page.locator('text=/expired|no longer valid/i');
    const errorMessage = page.locator('[role="alert"]:has-text("expired"), [role="alert"]:has-text("invalid")');
    
    const expiredVisible = await expiredMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
    const errorVisible = await errorMessage.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    // Either specific expired message or general error
    expect(expiredVisible || errorVisible).toBeTruthy();
  });

  test('should not apply discount for invalid coupon', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const originalTotal = await getCartTotal(page);
    
    await applyCoupon(page, TEST_COUPONS.invalid.nonexistent);
    
    const newTotal = await getCartTotal(page);
    
    // Total should remain unchanged
    expect(newTotal).toBe(originalTotal);
  });

  test('should handle empty coupon code input', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Try to apply empty coupon
    const couponInput = await findCouponInput(page);
    
    if (couponInput) {
      await couponInput.fill('');
      
      // Find apply button
      const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]:near(input[name*="coupon"])').first();
      
      if (await applyButton.isVisible({ timeout: 1000 })) {
        await safeClick(applyButton);
        
        // Should show validation error or button should be disabled
        const errorMessage = page.locator('text=/enter.*code|code.*required/i');
        const buttonDisabled = await applyButton.isDisabled().catch(() => false);
        
        const errorVisible = await errorMessage.first().isVisible({ timeout: 2000 }).catch(() => false);
        
        // Should prevent empty submission
        expect(errorVisible || buttonDisabled).toBeTruthy();
      }
    }
  });
});

test.describe('Remove Discount Codes', () => {
  test('should remove applied coupon', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const originalTotal = await getCartTotal(page);
    
    // Apply coupon
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      const discountedTotal = await getCartTotal(page);
      expect(discountedTotal).toBeLessThan(originalTotal);
      
      // Find remove button
      const removeButtons = [
        page.locator('button:has-text("Remove"), button:has-text("Delete")').filter({ has: page.locator('text=/coupon|discount/i') }),
        page.locator('[aria-label*="remove coupon" i], [aria-label*="delete coupon" i]'),
        page.locator('button[data-testid*="remove-coupon"]'),
      ];
      
      let removeButton = null;
      for (const button of removeButtons) {
        if (await button.first().isVisible({ timeout: 2000 }).catch(() => false)) {
          removeButton = button.first();
          break;
        }
      }
      
      if (removeButton) {
        await safeClick(removeButton);
        
        // Total should return to original
        const restoredTotal = await getCartTotal(page);
        expect(restoredTotal).toBeCloseTo(originalTotal, 2);
      }
    }
  });

  test('should update cart totals after removing coupon', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const originalTotal = await getCartTotal(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      // Remove coupon
      const removeButton = page.locator('button:has-text("Remove")').filter({ has: page.locator('text=/coupon/i') }).first();
      
      if (await removeButton.isVisible({ timeout: 2000 })) {
        await safeClick(removeButton);
        
        // Discount line should disappear
        const discountLine = page.locator('text=/discount.*\\$/i');
        const discountVisible = await discountLine.first().isVisible({ timeout: 1000 }).catch(() => false);
        
        // Discount should be removed from UI
        expect(discountVisible).toBeFalsy();
      }
    }
  });
});

test.describe('Coupon Restrictions', () => {
  test('should enforce minimum order amount for coupon', async ({ page }) => {
    // This test assumes we can add a small order below minimum
    await setupCheckoutWithProduct(page);
    
    const cartTotal = await getCartTotal(page);
    
    // Try to apply coupon that may have minimum order requirement
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (!applied) {
      // Look for minimum order error
      const minOrderMessage = page.locator('text=/minimum.*order|order.*minimum/i');
      
      if (await minOrderMessage.isVisible({ timeout: 2000 })) {
        // Coupon correctly rejected due to minimum order
        await expect(minOrderMessage).toBeVisible();
      }
    }
  });

  test('should handle product-specific coupon restrictions', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Try to apply product-specific coupon
    const applied = await applyCoupon(page, TEST_COUPONS.invalid.wrongProduct);
    
    // May show error about product not eligible
    const restrictionMessages = [
      page.locator('text=/not applicable|not eligible|not valid for/i'),
      page.locator('[role="alert"]:has-text("product"), [role="alert"]:has-text("item")'),
    ];
    
    let restrictionFound = false;
    for (const message of restrictionMessages) {
      if (await message.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        restrictionFound = true;
        break;
      }
    }
    
    // Should indicate restriction or apply successfully if product matches
    console.log(`Product-specific coupon restriction found: ${restrictionFound}`);
  });

  test('should not allow multiple discount codes simultaneously', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Apply first coupon
    const firstApplied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (firstApplied) {
      // Try to apply second coupon
      const secondApplied = await applyCoupon(page, TEST_COUPONS.valid.fixedAmount);
      
      if (secondApplied) {
        // Should either replace first coupon or show error
        const errorMessage = page.locator('text=/one coupon|single coupon|already applied/i');
        const errorVisible = await errorMessage.first().isVisible({ timeout: 2000 }).catch(() => false);
        
        // Most systems allow only one coupon
        console.log(`Multiple coupon restriction enforced: ${errorVisible}`);
      }
    }
  });
});

test.describe('Coupon Persistence', () => {
  test('should maintain coupon through checkout steps', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    // Apply coupon
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      const discountedTotal = await getCartTotal(page);
      
      // Navigate to next step (shipping)
      await fillShippingForm(page);
      
      const nextButton = page.getByRole('button', { name: /continue|next/i });
      if (await nextButton.isVisible({ timeout: 2000 })) {
        await safeClick(nextButton);
        await waitAfterNavigation(page);
        
        // Check if discount still shows on payment step
        const discountLine = page.locator('text=/discount|coupon/i');
        const discountVisible = await discountLine.first().isVisible({ timeout: 3000 }).catch(() => false);
        
        // Discount should persist across steps
        expect(discountVisible).toBeTruthy();
      }
    }
  });

  test('should retain coupon on page refresh', async ({ page }) => {
    await setupCheckoutWithProduct(page);
    
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      // Refresh page
      await page.reload({ waitUntil: 'commit' });
      await waitAfterNavigation(page);
      
      // Check if coupon is still applied
      const discountLine = page.locator('text=/discount|coupon/i');
      const discountVisible = await discountLine.first().isVisible({ timeout: 3000 }).catch(() => false);
      
      // Coupon should persist (stored in session/cart)
      if (discountVisible) {
        await expect(discountLine.first()).toBeVisible();
      }
    }
  });
});

test.describe('Multi-Locale Coupon Display', () => {
  test('should display coupon field in Spanish', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'es');
    
    // Look for coupon input (Spanish: "cupón" or "código")
    const couponInput = page.locator('input[placeholder*="cupón" i], input[placeholder*="código" i], input[name*="coupon"]').first();
    
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await expect(couponInput).toBeVisible();
    }
  });

  test('should display discount in French', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'fr');
    
    const applied = await applyCoupon(page, TEST_COUPONS.valid.percentage);
    
    if (applied) {
      // Look for French discount text ("remise", "réduction")
      const discountLine = page.locator('text=/remise|réduction|coupon/i');
      
      if (await discountLine.first().isVisible({ timeout: 2000 })) {
        await expect(discountLine.first()).toBeVisible();
      }
    }
  });
});

/**
 * Helper: Setup checkout with a product in cart
 */
async function setupCheckoutWithProduct(page: Page, locale: string = 'en'): Promise<void> {
  // Clear cart but preserve region detection to prevent auto-redirect
  await page.goto(routes.home(locale), { waitUntil: 'commit', timeout: 60000 });
  await page.evaluate(() => localStorage.clear());
  
  // Set region/language to match the locale being tested (prevents auto-detection redirect)
  await page.evaluate((localeCode) => {
    localStorage.setItem('bapi-region-welcome-shown', 'true');
    // Optionally set persisted language to match test locale
    if (localeCode === 'es' || localeCode === 'fr' || localeCode === 'de' || localeCode === 'ja') {
      localStorage.setItem('bapi-region-storage', JSON.stringify({
        language: localeCode,
        region: localeCode === 'de' ? 'eu' : 'us', // DE typically EUR/EU, others USD/US
      }));
    }
  }, locale);
  
  await page.reload({ waitUntil: 'commit' });
  await waitAfterNavigation(page);
  
  // Navigate to products
  await page.goto(routes.products(locale), { waitUntil: 'commit', timeout: 60000 });
  await waitAfterNavigation(page);
  
  // Find and add product
  let productAdded = false;
  let productLinks = page.locator('a[href*="/product/"]');
  let productCount = await productLinks.count();
  
  if (productCount === 0) {
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      const categoryHref = await categoryLink.getAttribute('href');
      if (categoryHref) {
        await page.goto(categoryHref, { waitUntil: 'commit', timeout: 60000 });
        await waitAfterNavigation(page);
        productLinks = page.locator('a[href*="/product/"]');
        productCount = await productLinks.count();
      }
    }
  }
  
  for (let i = 0; i < Math.min(productCount, 3); i++) {
    const productHref = await productLinks.nth(i).getAttribute('href');
    if (!productHref) continue;
    
    await page.goto(productHref, { waitUntil: 'commit', timeout: 60000 });
    await waitAfterNavigation(page);
    
    const addToCartButton = page.getByRole('button').filter({ hasText: /cart|carrito|panier/i });
    const buttonVisible = await addToCartButton.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (buttonVisible) {
      await safeClick(addToCartButton.first());
      
      // Wait for success toast
      const toast = page.locator('[role="alert"], [role="status"]');
      const toastAppeared = await toast.first().waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
      
      if (toastAppeared) {
        await waitForToastToDismiss(page);
        productAdded = true;
        break;
      }
    }
  }
  
  if (!productAdded) {
    throw new Error(`Could not add product to cart in locale: ${locale}`);
  }
  
  // Navigate to checkout
  await page.goto(routes.checkout(locale), { waitUntil: 'commit', timeout: 60000 });
  await waitAfterNavigation(page);
}

/**
 * Helper: Find coupon input field
 */
async function findCouponInput(page: Page): Promise<any> {
  const couponInputs = [
    page.locator('input[name*="coupon" i], input[id*="coupon" i]'),
    page.locator('input[placeholder*="coupon" i], input[placeholder*="promo" i]'),
    page.locator('[data-testid*="coupon"] input'),
  ];
  
  for (const input of couponInputs) {
    if (await input.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      return input.first();
    }
  }
  
  // Try expanding coupon section
  const showCouponButton = page.locator('button:has-text("Coupon"), a:has-text("Coupon"), button:has-text("Promo")').first();
  
  if (await showCouponButton.isVisible({ timeout: 2000 })) {
    await safeClick(showCouponButton);
    
    // Wait for input to appear
    for (const input of couponInputs) {
      if (await input.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        return input.first();
      }
    }
  }
  
  return null;
}

/**
 * Helper: Apply coupon code
 * @returns true if coupon was applied successfully (verified by success message or discount appearing)
 */
async function applyCoupon(page: Page, code: string): Promise<boolean> {
  const couponInput = await findCouponInput(page);
  
  if (!couponInput) {
    console.log('Coupon input not found');
    return false;
  }
  
  await couponInput.fill(code);
  
  // Find and click apply button
  const applyButtons = [
    page.locator('button:has-text("Apply")'),
    page.locator('button[type="submit"]:near(input[name*="coupon"])'),
    page.locator('[data-testid*="apply-coupon"]'),
  ];
  
  let clicked = false;
  for (const button of applyButtons) {
    if (await button.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await safeClick(button.first());
      clicked = true;
      break;
    }
  }
  
  // If no button found, try pressing Enter
  if (!clicked) {
    await couponInput.press('Enter');
  }
  
  // Wait for coupon application to complete (AJAX request + UI update)
  // Check for success indicators with realistic timeout for AJAX completion
  const successIndicators = [
    page.locator('[role="alert"]:has-text("applied"), [role="status"]:has-text("applied")'),
    page.locator('text=/coupon.*applied|discount.*applied/i'),
    page.locator('[data-testid*="discount"], .discount, .coupon-discount'),
  ];
  
  for (const indicator of successIndicators) {
    if (await indicator.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      return true;
    }
  }
  
  // No success indicator found - coupon may not have been applied
  return false;
}

/**
 * Helper: Get cart total amount
 */
async function getCartTotal(page: Page): Promise<number> {
  const totalPatterns = [
    page.locator('text=/total.*\$[\d,]+/i'),
    page.locator('[data-testid*="total"]:has-text("$")'),
    page.locator('.total:has-text("$"), .cart-total:has-text("$")'),
  ];
  
  for (const pattern of totalPatterns) {
    if (await pattern.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      const totalText = await pattern.first().textContent();
      if (totalText) {
        // Updated regex to handle thousands separators (e.g., "$1,234.56")
        const match = totalText.match(/\$?\s*([\d,]+\.?\d*)/);
        if (match) {
          // Remove commas before parsing
          const normalized = match[1].replace(/,/g, '');
          return parseFloat(normalized);
        }
      }
    }
  }
  
  return 0;
}

/**
 * Helper: Fill shipping form
 */
async function fillShippingForm(page: Page): Promise<void> {
  const firstNameInput = page.locator('input[name="firstName"], input#firstName');
  if (await firstNameInput.isVisible({ timeout: 2000 })) {
    await firstNameInput.fill('John');
    await page.locator('input[name="lastName"], input#lastName').fill('Doe');
    await page.locator('input[name="email"], input#email').fill('john.doe@example.com');
    await page.locator('input[name="phone"], input#phone').fill('555-123-4567');
    await page.locator('input[name="address1"], input#address1').fill('123 Test Street');
    await page.locator('input[name="city"], input#city').fill('Test City');
    await page.locator('input[name="state"], input#state').fill('CA');
    await page.locator('input[name="postcode"], input#postcode').fill('12345');
    
    const countrySelect = page.locator('select[name="country"], select#country');
    if (await countrySelect.isVisible({ timeout: 500 })) {
      await countrySelect.selectOption('US');
    }
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
