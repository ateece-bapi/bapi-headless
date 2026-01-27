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
const mockStripeInstance = {
  paymentIntents: {
    retrieve: mockRetrieve,
  },
};

// Mock Stripe as a constructor
vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      paymentIntents = {
        retrieve: mockRetrieve,
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
      expect(mockRetrieve).toHaveBeenCalledWith('pi_test123');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/wp-json/wc/v3/orders'),
        expect.objectContaining({
          method: 'POST',
        })
      );
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
