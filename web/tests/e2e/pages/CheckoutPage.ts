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

  /**
   * Fills the Stripe Payment Element's card fields with a Stripe test card.
   *
   * The Payment Element renders all fields inside a single combined iframe
   * (unlike the legacy Card Element's per-field iframes), located via the
   * `__privateStripeFrame` name prefix already used elsewhere in this suite.
   * Placeholder text matches the app's live Stripe appearance config.
   */
  async fillStripeTestCard(): Promise<void> {
    const stripeFrame = this.page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

    await stripeFrame.getByPlaceholder('1234 1234 1234 1234').fill('4242424242424242');
    await stripeFrame.getByPlaceholder('MM / YY').fill('12/34');
    await stripeFrame.getByPlaceholder('CVC').fill('123');

    // ZIP code is only shown for some billing-detail configurations
    const zipField = stripeFrame.getByPlaceholder('12345');
    if (await zipField.isVisible({ timeout: 500 }).catch(() => false)) {
      await zipField.fill('12345');
    }
  }

  /**
   * Selects Credit Card, completes the Stripe Payment Element with a test
   * card, and submits it — advancing to the Review step on success.
   *
   * Credit Card is the only payment tile whose flow can be fully automated
   * in E2E today: Bank Account requires linking a real/test bank account via
   * Stripe Financial Connections, which isn't practical to drive headlessly.
   */
  async continueToReview(): Promise<void> {
    const creditCardMethod = this.page.getByRole('button', { name: /credit card/i }).first();
    await expect(creditCardMethod).toBeVisible({ timeout: 10000 });
    await creditCardMethod.click();

    // Wait for the Stripe Payment Element iframe to mount
    const stripeFrameEl = this.page.locator('iframe[name^="__privateStripeFrame"]').first();
    await stripeFrameEl.waitFor({ state: 'attached', timeout: 15000 });

    await this.fillStripeTestCard();

    const payNowButton = this.page.getByRole('button', { name: /pay now/i });
    await expect(payNowButton).toBeVisible({ timeout: 10000 });
    await payNowButton.click();

    await expect(this.placeOrderButton).toBeVisible({ timeout: 20000 });
  }

  /**
   * Clicks "Place Order" and waits for the order-confirmation redirect.
   *
   * The Stripe card path confirms a real test-mode PaymentIntent client-side,
   * then the app's /api/payment/confirm call is intercepted here and a
   * conformant mock response is returned so the redirect doesn't depend on
   * hitting WooCommerce.
   *
   * Returns the order-confirmation URL the app navigated to.
   */
  async placeOrder(): Promise<string> {
    // Intercept Stripe confirm (fires once the client-side PaymentIntent is confirmed)
    await this.page.route('**/api/payment/confirm**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        // Shape must match what CheckoutPageClient reads:
        // result.order.id → used for redirect URL
        // result.clearCart → signals client to clear Zustand cart
        body: JSON.stringify({
          success: true,
          clearCart: true,
          order: {
            id: 'E2E-TEST-9999',
            orderNumber: 'E2E-TEST-9999',
            status: 'pending',
            total: '0.00',
            currency: 'USD',
            paymentMethod: 'stripe',
            transactionId: null,
          },
        }),
      });
    });

    // ReviewStep gates Place Order on its own Terms & Conditions / Privacy Policy checkbox
    const termsCheckbox = this.page.getByRole('checkbox').first();
    await expect(termsCheckbox).toBeVisible({ timeout: 10000 });
    await termsCheckbox.check();

    await this.placeOrderButton.click();

    // Wait for navigation to /order-confirmation/
    await this.page.waitForURL(/\/order-confirmation\//, { timeout: 20000 });
    return this.page.url();
  }

  /**
   * @deprecated Use placeOrder() instead.
   * Kept for backwards compatibility with older call sites.
   */
  async interceptAndPlaceOrder(): Promise<Record<string, unknown>> {
    await this.placeOrder();
    return {};
  }
}
