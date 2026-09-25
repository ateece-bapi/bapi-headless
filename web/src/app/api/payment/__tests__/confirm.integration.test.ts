/**
 * Integration Tests for Payment Confirmation API
 *
 * Tests the complete payment → order creation flow
 * Critical for revenue generation - any bugs block sales
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../confirm/route';
import { NextRequest } from 'next/server';

// Disable MSW for these tests - we're mocking fetch directly
vi.mock('../../../../../../test/msw/server', () => ({
  server: { listen: vi.fn(), close: vi.fn(), resetHandlers: vi.fn() },
}));

// Create mock Stripe instance that will be reused
const mockRetrieve = vi.fn();
const mockUpdate = vi.fn().mockResolvedValue({});
const mockStripeInstance = {
  paymentIntents: {
    retrieve: mockRetrieve,
    update: mockUpdate,
  },
};

// Mock Stripe as a constructor
vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      paymentIntents = {
        retrieve: mockRetrieve,
        update: mockUpdate,
      };
      constructor() {
        return mockStripeInstance;
      }
    },
  };
});

// Mock environment variables
vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock');
vi.stubEnv('NEXT_PUBLIC_WORDPRESS_GRAPHQL', 'https://test.com/graphql');
vi.stubEnv('WORDPRESS_API_USER', 'test_user');
vi.stubEnv('WORDPRESS_API_PASSWORD', 'test_password');

// Mock WooCommerce REST API
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('Payment Confirmation API - Integration Tests', () => {
  // Store original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    // clearAllMocks() doesn't reset implementations — without this, a prior test's
    // mockRejectedValue/mockResolvedValueOnce queue on mockUpdate would leak into the next.
    mockUpdate.mockReset();
    mockUpdate.mockResolvedValue({});
    // Set our mock fetch
    global.fetch = mockFetch as any;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('POST /api/payment/confirm', () => {
    it('should create WooCommerce order after successful Stripe payment', async () => {
      // Arrange: Mock Stripe payment intent
      mockRetrieve.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'card' },
      });

      // Mock WooCommerce order creation
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 421732,
          number: '421732',
          order_key: 'wc_order_test123',
          status: 'processing',
          total: '50.00',
          currency: 'USD',
          payment_method: 'stripe',
          transaction_id: 'pi_test123',
        }),
      } as any);

      // Create request
      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_test123',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            {
              id: 'prod-1',
              databaseId: 12345,
              name: 'Test Product',
              price: '50.00',
              quantity: 1,
            },
          ],
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('clearCart', true);
      expect(data).toHaveProperty('order');
      expect(data.order).toHaveProperty('id', 421732);
      expect(data.order).toHaveProperty('orderNumber', '421732');
      expect(data.order).toHaveProperty('status', 'processing');
      expect(mockRetrieve).toHaveBeenCalledWith('pi_test123', { expand: ['payment_method'] });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/wp-json/wc/v3/orders'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should mark a settled card payment as paid with the correct title', async () => {
      mockRetrieve.mockResolvedValue({
        id: 'pi_card123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'card' },
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 421733,
          number: '421733',
          status: 'processing',
          total: '50.00',
          currency: 'USD',
          payment_method: 'stripe',
          transaction_id: 'pi_card123',
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_card123',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.payment_method_title).toBe('Credit Card (Stripe)');
      expect(body.set_paid).toBe(true);
      expect(body.status).toBeUndefined();
      // Settled card orders don't need reconciliation via webhook
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should accept a processing ACH payment and hold the order until it settles', async () => {
      mockRetrieve.mockResolvedValue({
        id: 'pi_ach123',
        status: 'processing',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'us_bank_account' },
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 421734,
          number: '421734',
          status: 'on-hold',
          total: '50.00',
          currency: 'USD',
          payment_method: 'stripe',
          transaction_id: 'pi_ach123',
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_ach123',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: processing ACH intents are accepted, not rejected as incomplete payments
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.payment_method_title).toBe('Bank Account (ACH - Stripe)');
      expect(body.set_paid).toBe(false);
      expect(body.status).toBe('on-hold');

      // Unsettled ACH orders must be linked so the Stripe webhook can reconcile them later
      expect(mockUpdate).toHaveBeenCalledWith(
        'pi_ach123',
        expect.objectContaining({ metadata: expect.objectContaining({ wc_order_id: '421734' }) })
      );
    });

    it('should retry linking the PaymentIntent to the order if the first attempt fails', async () => {
      mockRetrieve.mockResolvedValue({
        id: 'pi_ach_retry',
        status: 'processing',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'us_bank_account' },
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 421999, number: '421999', status: 'on-hold' }),
      } as any);
      mockUpdate
        .mockRejectedValueOnce(new Error('transient Stripe error'))
        .mockResolvedValueOnce({});

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_ach_retry',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalledTimes(2);
      // Only the order-creation POST should have happened — no reconciliation-flag PUT needed
      // since the retry succeeded
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should flag the order for manual reconciliation if linking fails after all retries', async () => {
      mockRetrieve.mockResolvedValue({
        id: 'pi_ach_fail',
        status: 'processing',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'us_bank_account' },
      });
      mockFetch.mockImplementation(async (url: string) => {
        if (String(url).endsWith('/orders')) {
          return {
            ok: true,
            json: async () => ({ id: 422000, number: '422000', status: 'on-hold' }),
          } as any;
        }
        // The manual-reconciliation flag PUT to /orders/{id}
        return { ok: true, json: async () => ({}) } as any;
      });
      mockUpdate.mockRejectedValue(new Error('Stripe is unreachable'));

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_ach_fail',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);

      // The order was already created successfully — a linking failure must not surface as a
      // request failure (that would prompt a customer retry and a duplicate order)
      expect(response.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalledTimes(3);

      const flagCall = mockFetch.mock.calls.find(([url]) => String(url).endsWith('/orders/422000'));
      expect(flagCall).toBeDefined();
      const [, options] = flagCall!;
      const body = JSON.parse(options.body);
      expect(body.customer_note).toContain('pi_ach_fail');
      expect(body.customer_note).toContain('manual follow-up');
    });

    it('should return the existing order instead of creating a duplicate for an already-linked PaymentIntent', async () => {
      // A retry (lost response, refresh, client timeout) resubmits the same PaymentIntent,
      // which already carries wc_order_id from a prior successful call.
      mockRetrieve.mockResolvedValue({
        id: 'pi_already_linked',
        status: 'processing',
        amount: 5000,
        currency: 'usd',
        metadata: { wc_order_id: '421950' },
        payment_method: { type: 'us_bank_account' },
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 421950,
          number: '421950',
          status: 'on-hold',
          total: '50.00',
          currency: 'USD',
          payment_method: 'stripe',
          transaction_id: 'pi_already_linked',
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_already_linked',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.order.id).toBe(421950);
      // Only the existing-order GET should happen — never a new order POST
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [lookupUrl, lookupOptions] = mockFetch.mock.calls[0];
      expect(lookupUrl).toContain('/orders/421950');
      expect(lookupOptions?.method).not.toBe('POST');
    });

    it('should immediately mark the order paid if the ACH intent settles before the metadata link finishes', async () => {
      mockRetrieve
        .mockResolvedValueOnce({
          id: 'pi_ach_fast_settle',
          status: 'processing',
          amount: 5000,
          currency: 'usd',
          metadata: {},
          payment_method: { type: 'us_bank_account' },
        })
        // Re-checked immediately after linking metadata — settled in the meantime
        .mockResolvedValueOnce({
          id: 'pi_ach_fast_settle',
          status: 'succeeded',
        });

      mockFetch.mockImplementation(async (url: string) => {
        if (String(url).endsWith('/orders')) {
          return {
            ok: true,
            json: async () => ({ id: 422100, number: '422100', status: 'on-hold' }),
          } as any;
        }
        return { ok: true, json: async () => ({ id: 422100, status: 'processing' }) } as any;
      });

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_ach_fast_settle',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(mockRetrieve).toHaveBeenCalledTimes(2);

      const settleCall = mockFetch.mock.calls.find(([url]) => String(url).endsWith('/orders/422100'));
      expect(settleCall).toBeDefined();
      const [, options] = settleCall!;
      expect(JSON.parse(options.body)).toEqual({ set_paid: true, status: 'processing' });
    });

    it('should mark the order failed if the ACH intent fails before the metadata link finishes', async () => {
      mockRetrieve
        .mockResolvedValueOnce({
          id: 'pi_ach_fast_fail',
          status: 'processing',
          amount: 5000,
          currency: 'usd',
          metadata: {},
          payment_method: { type: 'us_bank_account' },
        })
        // Re-checked immediately after linking metadata — failed in the meantime
        .mockResolvedValueOnce({
          id: 'pi_ach_fast_fail',
          status: 'requires_payment_method',
        });

      mockFetch.mockImplementation(async (url: string) => {
        if (String(url).endsWith('/orders')) {
          return {
            ok: true,
            json: async () => ({ id: 422101, number: '422101', status: 'on-hold' }),
          } as any;
        }
        return { ok: true, json: async () => ({ id: 422101, status: 'failed' }) } as any;
      });

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_ach_fast_fail',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(mockRetrieve).toHaveBeenCalledTimes(2);

      const failCall = mockFetch.mock.calls.find(([url]) => String(url).endsWith('/orders/422101'));
      expect(failCall).toBeDefined();
      const [, options] = failCall!;
      expect(JSON.parse(options.body)).toEqual({ status: 'failed' });
    });

    it('should reject a mismatch between the cart total and the PaymentIntent amount', async () => {
      // A caller could reuse a valid/processing PaymentIntent while substituting a different,
      // more expensive cart — the order must be priced from server-validated data, not this.
      mockRetrieve.mockResolvedValue({
        id: 'pi_amount_mismatch',
        status: 'succeeded',
        amount: 5000, // $50.00
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'card' },
      });

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_amount_mismatch',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          // $999.00 cart against a $50.00 PaymentIntent
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '999.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should reject a resolved payment method that is neither card nor us_bank_account', async () => {
      // e.g. a PaymentIntent created directly against the Stripe API with Klarna, bypassing
      // the checkout UI's create-intent allow-list entirely
      mockRetrieve.mockResolvedValue({
        id: 'pi_klarna123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'klarna' },
      });

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_klarna123',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [
            { id: 'prod-1', databaseId: 12345, name: 'Test Product', price: '50.00', quantity: 1 },
          ],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return 400 if payment intent not found', async () => {
      // Arrange
      const Stripe = (await import('stripe')).default;
      const stripeInstance = new Stripe('test', { apiVersion: '2025-12-15.clover' });

      vi.mocked(stripeInstance.paymentIntents.retrieve).mockRejectedValue(
        new Error('Payment intent not found')
      );

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_invalid',
          cart: [],
          shippingAddress: {},
          billingAddress: {},
        }),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 400 if payment not succeeded', async () => {
      // Arrange
      const Stripe = (await import('stripe')).default;
      const stripeInstance = new Stripe('test', { apiVersion: '2025-12-15.clover' });

      vi.mocked(stripeInstance.paymentIntents.retrieve).mockResolvedValue({
        id: 'pi_test123',
        status: 'requires_payment_method',
        amount: 5000,
        currency: 'usd',
        metadata: {},
      } as any);

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_test123',
          cart: [],
          shippingAddress: {},
          billingAddress: {},
        }),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 500 if WooCommerce order creation fails', async () => {
      // Arrange
      mockRetrieve.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        metadata: {},
        payment_method: { type: 'card' },
      } as any);

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'WooCommerce API Error',
      } as any);

      const request = new NextRequest('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: 'pi_test123',
          orderData: {
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
              phone: '555-0123',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Test St',
              city: 'Test City',
              state: 'CA',
              postcode: '12345',
              country: 'US',
              email: 'test@example.com',
            },
          },
          cartItems: [{ databaseId: 12345, quantity: 1, price: '50.00', name: 'Test Product' }],
        }),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
