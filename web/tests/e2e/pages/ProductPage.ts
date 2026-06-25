/**
 * ProductPage — Page Object Model
 *
 * Encapsulates interactions with a WooCommerce product detail page
 * (`/[locale]/product/[slug]`).  Provides helpers for the most common
 * test actions so individual specs stay readable and resilient to
 * markup changes.
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { buildRoute } from '../helpers/routes';
import { waitForFullPageLoad } from '../helpers/test-utils';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(slug: string): Promise<void> {
    await this.page.goto(buildRoute(`/product/${slug}`));
    await waitForFullPageLoad(this.page);
  }

  /**
   * Drill through the product catalog (up to 3 levels deep) to find the first
   * visible product link and navigate to it.  Mirrors the smoke-suite strategy
   * so tests are resilient to catalog re-organisation.
   *
   * Returns the URL of the product page navigated to.
   */
  async gotoFirstProduct(): Promise<string> {
    await this.page.goto(buildRoute('/products'));
    await waitForFullPageLoad(this.page);

    for (let level = 0; level < 3; level++) {
      // :visible excludes overflow-hidden tab-nav links
      const productLinks = this.page.locator('a[href*="/product/"]:visible');
      if ((await productLinks.count()) > 0) {
        const href = await productLinks.first().getAttribute('href');
        if (href) {
          await this.page.goto(href);
          await waitForFullPageLoad(this.page);
          return this.page.url();
        }
      }

      const deeper = this.page
        .locator('a[href*="/products/"]:visible, a[href*="/categories/"]:visible')
        .first();
      const href = await deeper.getAttribute('href').catch(() => null);
      if (!href) break;
      await this.page.goto(href);
      await waitForFullPageLoad(this.page);
    }

    throw new Error('Could not reach a product detail page after 3 levels of drill-down');
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get addToCartButton(): Locator {
    // AddToCartButton renders "Add to Cart" as visible text
    return this.page
      .getByRole('button', { name: /add to cart/i })
      .filter({ hasNot: this.page.locator('[disabled]') })
      .first();
  }

  get addToCartButtonAny(): Locator {
    return this.page.getByRole('button', { name: /add to cart/i }).first();
  }

  get cartDrawer(): Locator {
    return this.page.locator('[aria-labelledby="cart-drawer-title"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async addToCart(quantity = 1): Promise<void> {
    if (quantity > 1) {
      const qtyInput = this.page.locator('input[type="number"]#quantity');
      await qtyInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
    // Wait for cart drawer to open or cart count to update
    await this.page
      .locator('[aria-labelledby="cart-drawer-title"], [aria-label="cart"]')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {
        // Cart drawer may not open automatically on all product types
      });
  }

  async assertLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page.locator('main')).toBeVisible();
  }
}
