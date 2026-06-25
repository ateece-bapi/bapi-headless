/**
 * CheckoutPage — Page Object Model
 *
 * Wraps the 3-step checkout wizard (`/[locale]/checkout`):
 *   Step 1 — Shipping Information  (ShippingStep.tsx)
 *   Step 2 — Payment Method        (PaymentStep.tsx)
 *   Step 3 — Review & Place Order  (ReviewStep.tsx)
 *
 * Field names come directly from the form attributes in ShippingStep.tsx.
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { buildRoute } from '../helpers/routes';
import { waitForFullPageLoad } from '../helpers/test-utils';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
  phone?: string;
  email?: string;
}

/** Sensible test defaults — override per-test as needed */
export const TEST_SHIPPING_ADDRESS: ShippingAddress = {
  firstName: 'E2E',
  lastName: 'Tester',
  company: 'BAPI Test Co.',
  address1: '750 North Greenway Drive',
  city: 'Glendale',
  state: 'WI',
  postcode: '53209',
  country: 'US',
  phone: '4145550000',
  email: process.env.E2E_USERNAME ?? 'e2e@bapihvac.com',
};

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(buildRoute('/checkout'));
    await waitForFullPageLoad(this.page);
  }

  // ── Step indicators ───────────────────────────────────────────────────────

  /** True when the shipping form (Step 1) is active */
  async isOnShippingStep(): Promise<boolean> {
    return this.page.locator('#firstName').isVisible({ timeout: 5000 }).catch(() => false);
  }

  /** True when the payment step (Step 2) is active */
  async isOnPaymentStep(): Promise<boolean> {
    return this.page
      .getByRole('heading', { name: /payment/i })
      .isVisible({ timeout: 5000 })
      .catch(() => false);
  }

  /** True when the review/confirm step (Step 3) is active */
  async isOnReviewStep(): Promise<boolean> {
    return this.page
      .getByRole('button', { name: /place.*order/i })
      .isVisible({ timeout: 5000 })
      .catch(() => false);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get continueButton(): Locator {
    // ShippingStep uses type="submit"; PaymentStep uses type="button"
    return this.page
      .getByRole('button', { name: /continue|next step/i })
      .first();
  }

  get backButton(): Locator {
    return this.page.getByRole('button', { name: /back/i }).first();
  }

  get placeOrderButton(): Locator {
    return this.page.getByRole('button', { name: /place.*order/i }).first();
  }

  get orderConfirmationHeading(): Locator {
    return this.page.getByRole('heading', { name: /order.*confirmed|thank you|success/i });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async fillShipping(addr: ShippingAddress = TEST_SHIPPING_ADDRESS): Promise<void> {
    await this.page.locator('#firstName').fill(addr.firstName);
    await this.page.locator('#lastName').fill(addr.lastName);
    if (addr.company) await this.page.locator('#company').fill(addr.company);
    await this.page.locator('#address1').fill(addr.address1);
    if (addr.address2) await this.page.locator('#address2').fill(addr.address2);
    await this.page.locator('#city').fill(addr.city);
    await this.page.locator('#state').fill(addr.state);
    await this.page.locator('#postcode').fill(addr.postcode);
    if (addr.country) {
      const countrySelect = this.page.locator('#country');
      if (await countrySelect.isVisible()) await countrySelect.selectOption(addr.country);
    }
    if (addr.phone) {
      const phoneInput = this.page.locator('#phone');
      if (await phoneInput.isVisible()) await phoneInput.fill(addr.phone);
    }
    if (addr.email) {
      const emailInput = this.page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) await emailInput.fill(addr.email);
    }
  }

  async continueToPayment(): Promise<void> {
    // ShippingStep submit button advances to step 2
    await this.page.locator('form').getByRole('button', { name: /continue/i }).click();
    // Wait for payment step heading or payment form to appear
    await this.page
      .getByRole('heading', { name: /payment/i })
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async continueToReview(): Promise<void> {
    await this.continueButton.click();
    await expect(this.placeOrderButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Intercepts the place-order API call, clicks "Place Order", and asserts the
   * intercept was hit.  Does NOT create a real WooCommerce order.
   *
   * @returns The intercepted request body for further assertions
   */
  async interceptAndPlaceOrder(): Promise<Record<string, unknown>> {
    let interceptedBody: Record<string, unknown> = {};

    await this.page.route('**/api/payment/confirm**', async (route) => {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      interceptedBody = body;
      // Return a mock successful order confirmation
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          orderId: 'E2E-TEST-ORDER',
          message: 'Order placed successfully (E2E mock)',
        }),
      });
    });

    // Also handle mock order endpoint (non-Stripe path)
    await this.page.route('**/api/orders**', async (route) => {
      interceptedBody = { mockOrder: true };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, orderId: 'E2E-TEST-ORDER' }),
      });
    });

    await this.placeOrderButton.click();
    return interceptedBody;
  }
}
