import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { routes, DEFAULT_LOCALE } from './routes';
import { safeClick, waitForStableElement, waitAfterNavigation, waitForFullPageLoad } from './test-utils';

/**
 * Shared robust add-to-cart helper used across E2E spec files.
 *
 * Strategy (mirrors the working cart-checkout.spec.ts pattern):
 * 1. Navigate to the products landing page (locale-aware).
 * 2. Drill down through the category → subcategory tree with a while-loop
 *    (up to 3 hops) until individual product links (/product/) are found.
 * 3. Navigate to the product at `productIndex` (defaults to 0).
 * 4. Handle variable products — select the first radio option for every
 *    required attribute group so the Add to Cart button becomes active.
 * 5. Wait up to 20 s for the Add to Cart button then click it.
 * 6. Verify the cart badge updates to show at least one item.
 *
 * @param page         Playwright Page instance
 * @param options.locale       BCP-47 locale code for locale-prefixed routes (default: DEFAULT_LOCALE)
 * @param options.productIndex Which product to add (0-based). Clamped to available count.
 */
export async function addProductToCart(
  page: Page,
  options: { locale?: string; productIndex?: number } = {}
): Promise<void> {
  const { locale = DEFAULT_LOCALE, productIndex = 0 } = options;

  await page.goto(routes.products(locale), { waitUntil: 'commit', timeout: 60000 });
  await waitAfterNavigation(page);

  // Wait for either category links OR direct product links to appear
  await Promise.race([
    page.locator('a[href*="/products/"]:visible').first().waitFor({ state: 'visible', timeout: 10000 }),
    page.locator('a[href*="/product/"]:visible').first().waitFor({ state: 'visible', timeout: 10000 }),
  ]).catch(() => {
    // Neither appeared — continue and let the assertion below catch it
  });

  let productLinks = page.locator('a[href*="/product/"]:visible');
  let productCount = await productLinks.count();

  // Drill down category → subcategory → product (up to 3 levels)
  let attempts = 0;
  while (productCount === 0 && attempts < 3) {
    const subcategoryLinks = page.locator('main').locator('a[href*="/products/"]:visible');
    const subCount = await subcategoryLinks.count();
    if (subCount === 0) break;

    const subHref = await subcategoryLinks.first().getAttribute('href');
    if (!subHref) break;

    await page.goto(subHref, { waitUntil: 'commit', timeout: 60000 });
    try {
      await page.locator('a[href*="/product/"]:visible').first().waitFor({ state: 'visible', timeout: 8000 });
    } catch {
      await waitAfterNavigation(page);
    }

    productLinks = page.locator('a[href*="/product/"]:visible');
    productCount = await productLinks.count();
    attempts++;
  }

  expect(productCount).toBeGreaterThan(0);

  // Clamp index so we never exceed what's available
  const safeIndex = Math.min(productIndex, productCount - 1);
  const productHref = await productLinks.nth(safeIndex).getAttribute('href');
  expect(productHref).toBeTruthy();

  await page.goto(productHref!, { waitUntil: 'commit', timeout: 60000 });
  await waitForFullPageLoad(page);

  // Always try to select radios for variable products — don't require a configure message,
  // which may not appear quickly enough or may use different text.
  const attributeNames: string[] = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
    const names = radios.map(r => r.getAttribute('name')).filter(Boolean) as string[];
    return [...new Set(names)];
  });

  if (attributeNames.length > 0) {
    for (const attributeName of attributeNames.slice(0, 5)) {
      const firstRadio = page.locator(`input[type="radio"][name="${attributeName}"]`).first();
      const radioId = await firstRadio.getAttribute('id');
      if (radioId) {
        const label = page.locator(`label[for="${radioId}"]`);
        const isChecked = await firstRadio.isChecked();
        if (!isChecked) {
          await label.click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(200);
        }
      }
    }
    await page.waitForTimeout(500);
  }

  // Wait for Add to Cart button and click it
  const addToCartButton = page.getByRole('button', { name: /Add.*to cart/i });
  await addToCartButton.waitFor({ state: 'visible', timeout: 20000 });
  await waitForStableElement(addToCartButton);
  await safeClick(addToCartButton);

  // Verify cart updated via localStorage (CartButton is a <button>, not a link;
  // cart badge only renders when totalItems > 0, so poll localStorage directly).
  await expect.poll(
    async () => {
      const stored = await page.evaluate(() => localStorage.getItem('bapi-cart-storage'));
      if (!stored) return 0;
      const data = JSON.parse(stored) as { state?: { items?: unknown[] } };
      return data?.state?.items?.length ?? 0;
    },
    { timeout: 10000, message: 'Expected cart to have at least one item in localStorage' }
  ).toBeGreaterThan(0);
}
