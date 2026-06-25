/**
 * CartPage — Page Object Model
 *
 * Encapsulates interactions with the full-page cart (`/[locale]/cart`).
 * Keeps selectors out of individual specs so cart UI changes only require
 * updating this one file.
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { routes } from '../helpers/routes';
import { waitForFullPageLoad } from '../helpers/test-utils';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(routes.cart());
    await waitForFullPageLoad(this.page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get emptyMessage(): Locator {
    return this.page.locator('text=/your cart is empty|no items/i').first();
  }

  /** All line-item rows in the cart table */
  get itemRows(): Locator {
    return this.page.locator('[data-testid="cart-item"], .cart-item, [aria-label*="item"]');
  }

  /** "Proceed to Checkout" CTA in the cart summary panel */
  get proceedToCheckoutButton(): Locator {
    return this.page
      .getByRole('button', { name: /proceed.*checkout|checkout/i })
      .first();
  }

  get couponInput(): Locator {
    return this.page.locator('input[name*="coupon" i], input[placeholder*="coupon" i]').first();
  }

  get applyCouponButton(): Locator {
    return this.page.getByRole('button', { name: /apply|coupon/i }).first();
  }

  // ── State queries ─────────────────────────────────────────────────────────

  async isEmpty(): Promise<boolean> {
    return this.emptyMessage.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Returns the number of distinct line items (not total quantity).
   */
  async lineItemCount(): Promise<number> {
    // Prefer aria-based rows; fall back to any row that contains a price
    const rows = this.page.locator(
      '[data-cart-item], li:has([aria-label*="Remove"]), article:has(button[aria-label*="Remove"])'
    );
    const count = await rows.count();
    if (count > 0) return count;

    // Second heuristic: count "Remove" buttons (one per line item)
    return this.page.getByRole('button', { name: /remove/i }).count();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedToCheckoutButton).toBeVisible({ timeout: 10000 });
    await this.proceedToCheckoutButton.click();
    // Wait until we land on the checkout page
    await this.page.waitForURL(/\/checkout/, { timeout: 15000 });
  }

  async removeItem(productName: string): Promise<void> {
    const row = this.page.locator(`text=${productName}`).locator('..').locator('..');
    await row.getByRole('button', { name: /remove/i }).click();
  }

  async assertNotEmpty(): Promise<void> {
    await expect(this.proceedToCheckoutButton).toBeVisible({ timeout: 15000 });
  }
}
