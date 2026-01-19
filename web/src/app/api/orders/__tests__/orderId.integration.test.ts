/**
 * Integration Tests for Order Details API
 * 
 * Tests the GET /api/orders/[orderId] endpoint which fetches
 * order details from WooCommerce REST API.
 * 
 * Test Coverage:
 * - Success: Valid order ID returns order details
 * - Validation: Missing/invalid order ID returns 400
 * - Not Found: Non-existent order returns 404
 * - Authentication: Tests Basic Auth with WordPress credentials
 * - Error Handling: WooCommerce API failures return 500
 * - Data Transformation: WC order data mapped to our format
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from '../[orderId]/route';
import { NextRequest } from 'next/server';

// Disable MSW to avoid conflicts with direct fetch mocking
vi.mock('../../../../../../test/msw/server', () => ({
  server: {
    listen: vi.fn(),
    close: vi.fn(),
    resetHandlers: vi.fn(),
  },
}));

describe('Order Details API - Integration Tests', () => {
  // Mock fetch
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as any;
    
    // Set required environment variables
    vi.stubEnv('NEXT_PUBLIC_WORDPRESS_GRAPHQL', 'https://test.kinsta.cloud/graphql');
    vi.stubEnv('WORDPRESS_API_USER', 'test_user');
    vi.stubEnv('WORDPRESS_API_PASSWORD', 'test_password');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  describe('GET /api/orders/[orderId]', () => {
    it('should fetch order details for valid order ID', async () => {
      // Mock WooCommerce REST API response
      const mockWcOrder = {
        id: 421732,
        number: '421732',
        status: 'processing',
        date_created: '2026-01-19T12:00:00',
        total: '169.97',
        total_tax: '15.00',
        shipping_total: '10.00',
        discount_total: '0.00',
        currency: 'USD',
        payment_method: 'stripe',
        payment_method_title: 'Credit Card (Stripe)',
        transaction_id: 'pi_test123',
        line_items: [
          {
            id: 1,
            product_id: 12345,
            name: 'Temperature Sensor',
            quantity: 2,
            total: '99.98',
            subtotal: '99.98',
            image: {
              src: 'https://example.com/image.jpg',
            },
          },
          {
            id: 2,
            product_id: 67890,
            name: 'Humidity Sensor',
            quantity: 1,
            total: '59.99',
            subtotal: '59.99',
            image: null,
          },
        ],
        shipping: {
          first_name: 'John',
          last_name: 'Doe',
          address_1: '123 Main St',
          address_2: 'Apt 4',
          city: 'Minneapolis',
          state: 'MN',
          postcode: '55401',
          country: 'US',
        },
        billing: {
          first_name: 'John',
          last_name: 'Doe',
          address_1: '123 Main St',
          address_2: 'Apt 4',
          city: 'Minneapolis',
          state: 'MN',
          postcode: '55401',
          country: 'US',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWcOrder,
      });

      // Create request
      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      // Call API
      const response = await GET(request, { params });
      const data = await response.json();

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toBe('/wp-json/wc/v3/orders/421732');
      expect(fetchCall[1].headers.Authorization).toContain('Basic ');

      // Verify Basic Auth header is correctly encoded
      const authHeader = fetchCall[1].headers.Authorization;
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString();
      expect(credentials).toBe('test_user:test_password');

      // Verify response structure
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.order).toBeDefined();

      // Verify order transformation
      expect(data.order.id).toBe(421732);
      expect(data.order.orderNumber).toBe('421732');
      expect(data.order.status).toBe('processing');
      expect(data.order.total).toBe('169.97');
      expect(data.order.subtotal).toBe('159.97'); // Calculated from line items
      expect(data.order.currency).toBe('USD');
      expect(data.order.paymentMethod).toBe('stripe');
      expect(data.order.transactionId).toBe('pi_test123');

      // Verify items transformation
      expect(data.order.items).toHaveLength(2);
      expect(data.order.items[0]).toMatchObject({
        id: '1',
        name: 'Temperature Sensor',
        quantity: 2,
        price: '$99.98',
        image: 'https://example.com/image.jpg',
      });
      expect(data.order.items[1]).toMatchObject({
        id: '2',
        name: 'Humidity Sensor',
        quantity: 1,
        price: '$59.99',
        image: null,
      });

      // Verify lineItems transformation
      expect(data.order.lineItems).toHaveLength(2);
      expect(data.order.lineItems[0]).toMatchObject({
        id: 1,
        productId: 12345,
        quantity: 2,
        total: '99.98',
        subtotal: '99.98',
        product: {
          id: 12345,
          name: 'Temperature Sensor',
          image: 'https://example.com/image.jpg',
        },
      });

      // Verify addresses transformation
      expect(data.order.shippingAddress).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4',
        city: 'Minneapolis',
        state: 'MN',
        postcode: '55401',
        country: 'US',
      });
      expect(data.order.billingAddress).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4',
        city: 'Minneapolis',
        state: 'MN',
        postcode: '55401',
        country: 'US',
      });
    });

    it('should return 400 if order ID is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/orders/');
      const params = Promise.resolve({ orderId: '' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing Order ID');
      expect(data.message).toBe('Order ID is required');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return 400 if order ID is not a valid number', async () => {
      const request = new NextRequest('http://localhost:3000/api/orders/invalid-id');
      const params = Promise.resolve({ orderId: 'invalid-id' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid Order ID');
      expect(data.message).toBe('Order ID must be a valid number');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return 404 if order does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ code: 'woocommerce_rest_shop_order_invalid_id' }),
      });

      const request = new NextRequest('http://localhost:3000/api/orders/999999');
      const params = Promise.resolve({ orderId: '999999' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Order Not Found');
      expect(data.message).toBe('Order with ID 999999 was not found');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if WooCommerce API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' }),
        text: async () => 'Internal Server Error',
      });

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Server Error');
      expect(data.message).toBe('Unable to fetch order details. Please try again later.');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Server Error');
      expect(data.message).toBe('Unable to fetch order details. Please try again later.');
    });

    it('should handle missing environment variables gracefully', async () => {
      vi.unstubAllEnvs();

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      // This should throw when trying to construct auth header
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Server Error');
    });

    it('should correctly calculate subtotal from line items', async () => {
      const mockWcOrder = {
        id: 421732,
        number: '421732',
        status: 'processing',
        date_created: '2026-01-19T12:00:00',
        total: '279.96',
        total_tax: '25.00',
        shipping_total: '15.00',
        discount_total: '10.00',
        currency: 'USD',
        payment_method: 'stripe',
        payment_method_title: 'Credit Card',
        transaction_id: null,
        line_items: [
          { id: 1, product_id: 1, name: 'Item 1', quantity: 1, total: '100.00', subtotal: '100.00', image: null },
          { id: 2, product_id: 2, name: 'Item 2', quantity: 2, total: '80.00', subtotal: '80.00', image: null },
          { id: 3, product_id: 3, name: 'Item 3', quantity: 1, total: '69.96', subtotal: '69.96', image: null },
        ],
        shipping: {},
        billing: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWcOrder,
      });

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      const response = await GET(request, { params });
      const data = await response.json();

      // Subtotal should be sum of line item subtotals: 100 + 80 + 69.96 = 249.96
      // Note: Floating point precision issue, so we check if it rounds to correct value
      expect(parseFloat(data.order.subtotal).toFixed(2)).toBe('249.96');
      expect(data.order.total).toBe('279.96');
      expect(data.order.tax).toBe('25.00');
      expect(data.order.shipping).toBe('15.00');
      expect(data.order.discount).toBe('10.00');
    });

    it('should handle orders with no transaction ID', async () => {
      const mockWcOrder = {
        id: 421732,
        number: '421732',
        status: 'pending',
        date_created: '2026-01-19T12:00:00',
        total: '100.00',
        total_tax: '0.00',
        shipping_total: '0.00',
        discount_total: '0.00',
        currency: 'USD',
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        transaction_id: '', // Empty transaction ID
        line_items: [
          { id: 1, product_id: 1, name: 'Test Product', quantity: 1, total: '100.00', subtotal: '100.00', image: null },
        ],
        shipping: {},
        billing: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWcOrder,
      });

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.order.transactionId).toBeNull();
      expect(data.order.paymentMethod).toBe('cod');
    });

    it('should handle orders with missing optional address fields', async () => {
      const mockWcOrder = {
        id: 421732,
        number: '421732',
        status: 'processing',
        date_created: '2026-01-19T12:00:00',
        total: '100.00',
        total_tax: '0.00',
        shipping_total: '0.00',
        discount_total: '0.00',
        currency: 'USD',
        payment_method: 'stripe',
        payment_method_title: 'Credit Card',
        transaction_id: 'pi_test123',
        line_items: [
          { id: 1, product_id: 1, name: 'Test Product', quantity: 1, total: '100.00', subtotal: '100.00', image: null },
        ],
        shipping: {
          first_name: 'John',
          last_name: 'Doe',
          address_1: '123 Main St',
          // address_2 missing
          city: 'Minneapolis',
          state: 'MN',
          postcode: '55401',
          // country missing
        },
        billing: {
          first_name: 'Jane',
          last_name: 'Smith',
          address_1: '456 Oak Ave',
          address_2: '',
          city: 'St Paul',
          state: 'MN',
          postcode: '55102',
          country: 'US',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWcOrder,
      });

      const request = new NextRequest('http://localhost:3000/api/orders/421732');
      const params = Promise.resolve({ orderId: '421732' });

      const response = await GET(request, { params });
      const data = await response.json();

      // Verify missing fields default to empty strings or 'US'
      expect(data.order.shippingAddress.address2).toBe('');
      expect(data.order.shippingAddress.country).toBe('US');
      expect(data.order.billingAddress.address2).toBe('');
    });
  });
});
