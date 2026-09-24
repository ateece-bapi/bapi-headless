/**
 * Integration Tests for Payment Intent Creation API
 *
 * Verifies that the Card and Bank Account tiles are scoped to exactly one
 * Stripe payment method type each, and that the API can never re-enable
 * other Dashboard-configured methods (e.g. Klarna, Crypto) via an
 * unrecognized/unspecified `paymentMethodType`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../create-intent/route';
import { NextRequest } from 'next/server';

const mockCreate = vi.fn();
const mockStripeInstance = {
  paymentIntents: {
    create: mockCreate,
  },
};

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      paymentIntents = {
        create: mockCreate,
      };
      constructor() {
        return mockStripeInstance;
      }
    },
  };
});

vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock');

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('Payment Intent Creation API - payment_method_types mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({
      id: 'pi_test123',
      client_secret: 'pi_test123_secret_abc',
    });
  });

  it("scopes Credit Card to ['card'] only", async () => {
    const response = await POST(buildRequest({ amount: 50, paymentMethodType: 'credit_card' }));

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['card'] })
    );
  });

  it("scopes Bank Account to ['us_bank_account'] only", async () => {
    const response = await POST(buildRequest({ amount: 50, paymentMethodType: 'bank_account' }));

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['us_bank_account'] })
    );
  });

  it('falls back to Card + Bank only when paymentMethodType is missing, never re-enabling other methods', async () => {
    const response = await POST(buildRequest({ amount: 50 }));

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['card', 'us_bank_account'] })
    );
  });

  it('falls back to Card + Bank only for an unrecognized paymentMethodType', async () => {
    const response = await POST(buildRequest({ amount: 50, paymentMethodType: 'klarna' }));

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['card', 'us_bank_account'] })
    );
  });

  it('never passes automatic_payment_methods, which would defer to Dashboard settings', async () => {
    await POST(buildRequest({ amount: 50, paymentMethodType: 'credit_card' }));

    const [params] = mockCreate.mock.calls[0];
    expect(params).not.toHaveProperty('automatic_payment_methods');
  });

  it('rejects a non-positive amount before calling Stripe', async () => {
    const response = await POST(buildRequest({ amount: 0, paymentMethodType: 'credit_card' }));

    expect(response.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
