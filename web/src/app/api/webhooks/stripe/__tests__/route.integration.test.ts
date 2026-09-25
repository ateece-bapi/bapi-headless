/**
 * Integration Tests for Stripe Webhook Handler
 *
 * Verifies signature validation and the ACH settlement reconciliation path — the only
 * place a "processing" ACH PaymentIntent ever gets marked paid/failed after order creation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

const mockConstructEvent = vi.fn();
const mockRetrieve = vi.fn();
const mockStripeInstance = {
  webhooks: {
    constructEvent: mockConstructEvent,
  },
  paymentIntents: {
    retrieve: mockRetrieve,
  },
};

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      webhooks = {
        constructEvent: mockConstructEvent,
      };
      paymentIntents = {
        retrieve: mockRetrieve,
      };
      constructor() {
        return mockStripeInstance;
      }
    },
  };
});

vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock');
vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test_mock');
vi.stubEnv('NEXT_PUBLIC_WORDPRESS_GRAPHQL', 'https://test.com/graphql');
vi.stubEnv('WORDPRESS_API_USER', 'test_user');
vi.stubEnv('WORDPRESS_API_PASSWORD', 'test_password');

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

function buildRequest(body = '{}', signature: string | null = 't=1,v1=abc') {
  const headers: Record<string, string> = {};
  if (signature) {
    headers['stripe-signature'] = signature;
  }
  return new NextRequest('http://localhost:3000/api/webhooks/stripe', {
    method: 'POST',
    headers,
    body,
  });
}

function paymentIntentEvent(type: string, paymentIntent: Record<string, unknown>): any {
  return {
    type,
    data: { object: paymentIntent },
  };
}

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as any;
  });

  it('rejects requests with an invalid signature', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const response = await POST(buildRequest());

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects requests missing the stripe-signature header', async () => {
    const response = await POST(buildRequest('{}', null));

    expect(response.status).toBe(400);
    expect(mockConstructEvent).not.toHaveBeenCalled();
  });

  it('marks the order paid when a linked ACH PaymentIntent succeeds', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_ach123',
        metadata: { wc_order_id: '421734' },
      })
    );
    // Re-fetched fresh metadata (mirrors the event snapshot when nothing has drifted)
    mockRetrieve.mockResolvedValue({
      id: 'pi_ach123',
      status: 'succeeded',
      metadata: { wc_order_id: '421734' },
    });

    // GET order (ownership check) then PUT order (the update)
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421734, transaction_id: 'pi_ach123', status: 'on-hold' }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421734, status: 'processing' }),
      } as any);

    const response = await POST(buildRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ received: true });

    // GET to verify ownership
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/wp-json/wc/v3/orders/421734'),
      expect.objectContaining({ method: 'GET' })
    );
    // PUT to apply the update
    const [, putOptions] = mockFetch.mock.calls[1];
    expect(putOptions.method).toBe('PUT');
    expect(JSON.parse(putOptions.body)).toEqual({ set_paid: true, status: 'processing' });
  });

  it('marks the order failed when a linked ACH PaymentIntent fails', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.payment_failed', {
        id: 'pi_ach456',
        metadata: { wc_order_id: '421735' },
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_ach456',
      status: 'requires_payment_method',
      metadata: { wc_order_id: '421735' },
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421735, transaction_id: 'pi_ach456', status: 'on-hold' }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421735, status: 'failed' }),
      } as any);

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    const [, putOptions] = mockFetch.mock.calls[1];
    expect(JSON.parse(putOptions.body)).toEqual({ status: 'failed' });
  });

  it('does nothing when the PaymentIntent has no wc_order_id metadata', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_card123',
        metadata: {},
      })
    );
    mockRetrieve.mockResolvedValue({ id: 'pi_card123', metadata: {} });

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    // No order lookup/update should be attempted — card orders are already marked paid
    // synchronously in /api/payment/confirm and never carry a wc_order_id
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('refuses to update an order whose transaction_id does not match the PaymentIntent', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_attacker123',
        // Forged/mismatched wc_order_id pointing at someone else's order
        metadata: { wc_order_id: '999999' },
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_attacker123',
      status: 'succeeded',
      metadata: { wc_order_id: '999999' },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 999999, transaction_id: 'pi_legitimate_owner', status: 'on-hold' }),
    } as any);

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    // Only the ownership-check GET should have been made — never the PUT
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][1]).toEqual(expect.objectContaining({ method: 'GET' }));
  });

  it('returns 500 (so Stripe retries) when the WooCommerce update fails', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_ach789',
        metadata: { wc_order_id: '421736' },
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_ach789',
      status: 'succeeded',
      metadata: { wc_order_id: '421736' },
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421736, transaction_id: 'pi_ach789', status: 'on-hold' }),
      } as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'WooCommerce API Error',
      } as any);

    const response = await POST(buildRequest());

    expect(response.status).toBe(500);
  });

  it('reconciles using freshly re-fetched metadata, not the (possibly stale) event snapshot', async () => {
    // The event snapshot has no wc_order_id — it was emitted before /api/payment/confirm's
    // linkPaymentIntentToOrder finished attaching it. Stripe won't redeliver this event, so
    // the fresh retrieve() call is the only way to still find it.
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_race_condition',
        metadata: {},
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_race_condition',
      status: 'succeeded',
      metadata: { wc_order_id: '421999' },
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421999, transaction_id: 'pi_race_condition', status: 'on-hold' }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 421999, status: 'processing' }),
      } as any);

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    expect(mockRetrieve).toHaveBeenCalledWith('pi_race_condition');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('ignores a stale failed event when the intent has since succeeded', async () => {
    // A retried ACH attempt can succeed after an earlier failure event for the same intent
    // was already queued for delivery — acting on the stale failure would wrongly mark a
    // now-paid order as failed.
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.payment_failed', {
        id: 'pi_stale_failure',
        metadata: { wc_order_id: '422200' },
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_stale_failure',
      status: 'succeeded',
      metadata: { wc_order_id: '422200' },
    });

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('ignores a stale succeeded event when the intent has since failed', async () => {
    mockConstructEvent.mockReturnValue(
      paymentIntentEvent('payment_intent.succeeded', {
        id: 'pi_stale_success',
        metadata: { wc_order_id: '422201' },
      })
    );
    mockRetrieve.mockResolvedValue({
      id: 'pi_stale_success',
      status: 'requires_payment_method',
      metadata: { wc_order_id: '422201' },
    });

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('ignores unrelated event types', async () => {
    mockConstructEvent.mockReturnValue(paymentIntentEvent('payment_intent.created', { id: 'pi_x' }));

    const response = await POST(buildRequest());

    expect(response.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
