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
          cartItems: [{ databaseId: 12345, quantity: 1, price: '75.00', name: 'Test Product' }],
        }),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
