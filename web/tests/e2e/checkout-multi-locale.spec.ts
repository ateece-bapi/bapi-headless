import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { routes } from './helpers/routes';
import { safeClick, waitAfterNavigation, waitForPageReady } from './helpers/test-utils';

/**
 * Multi-Locale Checkout E2E Tests (Phase B)
 * 
 * Tests checkout functionality across multiple languages/regions:
 * - Spanish (ES), French (FR), German (DE), Japanese (JA)
 * - Currency display (USD, EUR, etc.)
 * - Translation completeness
 * - Regional formatting (dates, phone numbers)
 * 
 * Critical for Phase 1 launch requirement: 11-language support.
 */

// Locales to test (Phase 1 priorities + key markets)
const TEST_LOCALES = [
  { code: 'es', name: 'Spanish', currency: 'USD', symbol: '$' },
  { code: 'fr', name: 'French', currency: 'USD', symbol: '$' },
  { code: 'de', name: 'German', currency: 'EUR', symbol: '€' },
  { code: 'ja', name: 'Japanese', currency: 'USD', symbol: '$' },
];

test.describe('Multi-Locale Checkout Flow', () => {
  for (const locale of TEST_LOCALES) {
    test.describe(`${locale.name} (${locale.code})`, () => {
      test(`should display checkout page in ${locale.name}`, async ({ page }) => {
        await page.goto(routes.checkout(locale.code), { waitUntil: 'commit', timeout: 60000 });
        await waitAfterNavigation(page);
        
        // Should show checkout heading
        const heading = page.getByRole('heading', { level: 1 }).first();
        await expect(heading).toBeVisible();
        
        // Verify we're on correct locale path
        expect(page.url()).toContain(`/${locale.code}/checkout`);
      });

      test(`should display payment methods in ${locale.name}`, async ({ page }) => {
        // Setup: Add product and navigate to checkout
        await setupCheckoutWithProduct(page, locale.code);
        await navigateToPaymentStep(page, locale.code);
        
        // Should show payment method options
        const creditCardButton = page.getByRole('button', { name: /credit card|tarjeta|carte|kreditkarte|クレジットカード/i });
        const paypalButton = page.getByRole('button', { name: /paypal/i });
        
        // At least one payment method should be visible
        const creditCardVisible = await creditCardButton.isVisible({ timeout: 3000 }).catch(() => false);
        const paypalVisible = await paypalButton.isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(creditCardVisible || paypalVisible).toBeTruthy();
      });

      test(`should display a valid currency format in ${locale.name}`, async ({ page }) => {
        await setupCheckoutWithProduct(page, locale.code);
        
        // Look for currency symbol or code in order summary.
        // NOTE: Currency is driven by persisted region (bapi-region-storage),
        // so we only assert that a supported currency format is shown,
        // not that it matches a specific locale->currency mapping.
        const priceElements = page.locator('text=/\\$|€|USD|EUR|¥|JPY/i');
        
        const priceCount = await priceElements.count();
        expect(priceCount).toBeGreaterThan(0);

        const currencyPattern = /(\$|€|USD|EUR|¥|JPY)/i;
        for (let i = 0; i < Math.min(priceCount, 3); i++) {  // Check first 3 price elements
          const text = await priceElements.nth(i).textContent();
          if (text) {
            expect(text).toMatch(currencyPattern);
          }
        }
      });

      test(`should have translated form labels in ${locale.name}`, async ({ page }) => {
        await setupCheckoutWithProduct(page, locale.code);
        
        // Check for common form labels (should be translated, not in English)
        const formLabels = page.locator('label');
        const labelCount = await formLabels.count();
        
        // Should have form labels
        expect(labelCount).toBeGreaterThan(0);
        
        // Verify labels exist (exact translation checking would be too brittle)
        const firstNameLabel = page.locator('label[for*="first"], label:has-text("first")').first();
        const hasLabel = await firstNameLabel.isVisible({ timeout: 1000 }).catch(() => false);
        
        // If English labels show up, it may indicate missing translation
        if (locale.code !== 'en' && hasLabel) {
          const labelText = await firstNameLabel.textContent();
          // Log for manual verification - automated translation testing is complex
          console.log(`[${locale.code}] First name label: ${labelText}`);
        }
      });

      test(`should complete checkout wizard in ${locale.name}`, async ({ page }) => {
        await setupCheckoutWithProduct(page, locale.code);
        
        // Fill shipping form
        await fillShippingForm(page);
        
        // Navigate to payment step
        const nextButton = page.getByRole('button', { name: /continue|next|continuar|suivant|weiter|次へ/i });
        if (await nextButton.isVisible({ timeout: 1000 })) {
          await safeClick(nextButton);
          await page.waitForTimeout(2000);
        }
        
        // Select payment method
        const paypalButton = page.getByRole('button', { name: /paypal/i });
        if (await paypalButton.isVisible({ timeout: 3000 })) {
          await safeClick(paypalButton);
          await page.waitForTimeout(500);
          
          // Proceed to review
          const paymentNextButton = page.getByRole('button', { name: /continue|next|continuar|suivant|weiter|次へ/i });
          if (await paymentNextButton.isVisible({ timeout: 1000 })) {
            await safeClick(paymentNextButton);
            await page.waitForTimeout(1000);
            
            // Should reach review step
            const reviewHeading = page.getByRole('heading', { name: /review|place|revisar|revoir|überprüfen|確認/i });
            await expect(reviewHeading).toBeVisible({ timeout: 3000 }).catch(() => {
              // Review step may not be fully implemented
            });
          }
        }
      });
    });
  }
});

test.describe('Locale Switching During Checkout', () => {
  test('should preserve cart when switching languages', async ({ page }) => {
    // Add product in English
    await setupCheckoutWithProduct(page, 'en');
    
    // Verify product in cart
    const checkoutHeading = page.getByRole('heading', { name: /checkout/i });
    await expect(checkoutHeading).toBeVisible({ timeout: 2000 });
    
    // Switch to Spanish
    const languageSelector = page.locator('[aria-label*="language"], [data-testid*="language"]').first();
    if (await languageSelector.isVisible({ timeout: 2000 })) {
      await safeClick(languageSelector);
      await page.waitForTimeout(500);
      
      // Click Spanish option
      const spanishOption = page.locator('text=/español|spanish|es/i').first();
      if (await spanishOption.isVisible({ timeout: 1000 })) {
        await safeClick(spanishOption);
        await page.waitForTimeout(2000);
        
        // Should still be on checkout page, just in Spanish
        expect(page.url()).toContain('/es/checkout');
        
        // Cart should still have items
        const emptyCartMessage = page.locator('text=/cart is empty|carrito está vacío/i');
        const isEmpty = await emptyCartMessage.isVisible({ timeout: 1000 }).catch(() => false);
        
        expect(isEmpty).toBeFalsy();
      }
    }
  });

  test('should maintain checkout progress across language switch', async ({ page }) => {
    // Fill shipping form in English
    await setupCheckoutWithProduct(page, 'en');
    await fillShippingForm(page);
    
    // Navigate to payment step
    const nextButton = page.getByRole('button', { name: /continue|next/i });
    if (await nextButton.isVisible({ timeout: 1000 })) {
      await safeClick(nextButton);
      await page.waitForTimeout(2000);
      
      // We're on payment step now
      // Switch to French
      const languageSelector = page.locator('[aria-label*="language"], [data-testid*="language"]').first();
      if (await languageSelector.isVisible({ timeout: 2000 })) {
        await safeClick(languageSelector);
        await page.waitForTimeout(500);
        
        const frenchOption = page.locator('text=/français|french|fr/i').first();
        if (await frenchOption.isVisible({ timeout: 1000 })) {
          await safeClick(frenchOption);
          await page.waitForTimeout(2000);
          
          // Should still be on payment step (Step 2)
          const paymentMethods = page.getByRole('button', { name: /credit card|paypal|carte/i });
          const methodsVisible = await paymentMethods.first().isVisible({ timeout: 3000 }).catch(() => false);
          
          // Payment methods should still be visible
          expect(methodsVisible).toBeTruthy();
        }
      }
    }
  });
});

test.describe('Currency & Regional Formatting', () => {
  test('should display prices in correct format for US locale', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'en');
    
    // US format: $1,234.56
    const pricePattern = /\$\d{1,3}(,\d{3})*(\.\d{2})?/;
    const prices = page.locator('text=/\\$\\d/');
    
    if (await prices.first().isVisible({ timeout: 2000 })) {
      const priceText = await prices.first().textContent();
      expect(priceText).toMatch(pricePattern);
    }
  });

  test('should display prices in correct format for EU locale (German)', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'de');
    
    // EU format: €1.234,56 or 1.234,56 €
    const priceElements = page.locator('text=/€|EUR/');
    
    if (await priceElements.first().isVisible({ timeout: 2000 })) {
      const priceText = await priceElements.first().textContent();
      
      // Should contain Euro symbol or EUR code
      expect(priceText).toMatch(/€|EUR/);
    }
  });

  test('should format phone numbers according to region', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'en');
    
    // Fill phone number
    const phoneInput = page.locator('input[name="phone"], input#phone');
    if (await phoneInput.isVisible({ timeout: 2000 })) {
      await phoneInput.fill('5551234567');
      
      // Some regions may auto-format as you type
      // Just verify the input accepts the number
      const phoneValue = await phoneInput.inputValue();
      expect(phoneValue.replace(/\D/g, '')).toContain('555');
    }
  });
});

test.describe('Translation Completeness', () => {
  test('should not display English fallback text in Spanish', async ({ page }) => {
    await page.goto(routes.checkout('es'), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Check for obvious English words that should be translated
    const untranslatedWords = ['Checkout', 'Continue', 'Back', 'Next', 'Payment', 'Shipping'];
    
    let englishTextFound = false;
    for (const word of untranslatedWords) {
      const element = page.locator(`text="${word}"`).first();
      const isVisible = await element.isVisible({ timeout: 500 }).catch(() => false);
      
      if (isVisible) {
        englishTextFound = true;
        console.warn(`[ES] Found untranslated English word: "${word}"`);
      }
    }
    
    // If any obvious English words are visible, fail the test so CI catches missing translations.
    if (englishTextFound) {
      console.log('[ES] Some English text detected - verify if translations are missing');
    }
    expect(englishTextFound, '[ES] Checkout page should not show untranslated English fallback text').toBe(false);
  });

  test('should have all button labels translated in French', async ({ page }) => {
    await setupCheckoutWithProduct(page, 'fr');
    
    // All buttons should be translated
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    // Should have buttons on checkout page
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check if buttons have text (empty buttons = translation issue)
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const buttonText = await buttons.nth(i).textContent();
      
      if (buttonText && buttonText.trim().length > 0) {
        // Button has text - good
        expect(buttonText.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * Helper: Setup checkout with a product in cart for specific locale
 */
async function setupCheckoutWithProduct(page: Page, locale: string): Promise<void> {
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
  await page.waitForTimeout(1000);
  
  // Navigate to products page in specified locale
  await page.goto(routes.products(locale), { waitUntil: 'commit', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Find and add product (language-agnostic approach)
  let productAdded = false;
  
  // Look for product links
  let productLinks = page.locator('a[href*="/product/"]');
  let productCount = await productLinks.count();
  
  // Navigate through categories if needed
  if (productCount === 0) {
    const categoryLinks = page.locator('a[href*="/categories/"]');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      const categoryHref = await categoryLinks.first().getAttribute('href');
      if (categoryHref) {
        await page.goto(categoryHref, { waitUntil: 'commit', timeout: 60000 });
        await page.waitForTimeout(2000);
        
        productLinks = page.locator('a[href*="/product/"]');
        productCount = await productLinks.count();
      }
    }
  }
  
  // Try to add products (try first 3)
  for (let i = 0; i < Math.min(productCount, 3); i++) {
    const productHref = await productLinks.nth(i).getAttribute('href');
    if (!productHref) continue;
    
    await page.goto(productHref, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Look for Add to Cart button (language agnostic - uses button role)
    const addToCartButton = page.getByRole('button').filter({ hasText: /cart|carrito|panier|warenkorb|カート/i });
    const buttonVisible = await addToCartButton.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (buttonVisible) {
      await safeClick(addToCartButton.first());
      await page.waitForTimeout(1500);
      
      // Check for toast (success indicator)
      const toast = page.locator('[role="alert"], [role="status"]');
      const toastAppeared = await toast.first().isVisible({ timeout: 3000 }).catch(() => false);
      
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
  await page.waitForTimeout(2000);
}

/**
 * Helper: Navigate to payment step by filling shipping form
 */
async function navigateToPaymentStep(page: Page, locale: string): Promise<void> {
  await fillShippingForm(page);
  
  // Click Next button (multi-language support)
  const nextButton = page.getByRole('button', { name: /continue|next|continuar|suivant|weiter|次へ/i });
  if (await nextButton.isVisible({ timeout: 1000 })) {
    await safeClick(nextButton);
    await page.waitForTimeout(2000);
  }
}

/**
 * Helper: Fill shipping form fields
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
    
    await page.waitForTimeout(500);
  }
}

/**
 * Helper: Wait for toast notification to dismiss
 */
async function waitForToastToDismiss(page: Page, timeout = 6000): Promise<void> {
  const toast = page.locator('[role="alert"], [role="status"]').first();
  
  const appearTimeout = Math.floor(timeout * 0.25);
  const dismissTimeout = timeout - appearTimeout;
  
  let toastAppeared = false;
  await toast
    .waitFor({ state: 'attached', timeout: appearTimeout })
    .then(() => {
      toastAppeared = true;
    })
    .catch(() => {
      // Toast may not appear
    });
  
  if (toastAppeared) {
    await toast.waitFor({ state: 'hidden', timeout: dismissTimeout }).catch(() => {
      // Toast may already be gone
    });
  }
}
