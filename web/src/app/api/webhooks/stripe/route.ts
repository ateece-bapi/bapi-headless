/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * ACH (us_bank_account) orders are created "on-hold" in /api/payment/confirm because the
 * transfer hasn't settled yet — this webhook is the only thing that later marks them paid
 * once Stripe reports the PaymentIntent as settled (or failed), using the `wc_order_id`
 * stashed in the PaymentIntent metadata at order-creation time.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import logger from '@/lib/logger';
import { logError } from '@/lib/errors';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL?.replace('/graphql', '') || '';

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

async function updateWooCommerceOrder(orderId: string, data: Record<string, unknown>) {
  const auth = Buffer.from(
    `${process.env.WORDPRESS_API_USER}:${process.env.WORDPRESS_API_PASSWORD}`
  ).toString('base64');

  const response = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce order update failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function getWooCommerceOrder(orderId: string) {
  const auth = Buffer.from(
    `${process.env.WORDPRESS_API_USER}:${process.env.WORDPRESS_API_PASSWORD}`
  ).toString('base64');

  const response = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}`, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce order fetch failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Applies `updateData` to the order linked via PaymentIntent metadata, but only after
 * confirming the order's own `transaction_id` (set server-side in /api/payment/confirm,
 * never client-controlled) matches this exact PaymentIntent — a signed webhook event still
 * shouldn't let a forged/mismatched `wc_order_id` update an unrelated order.
 */
async function reconcileOrderForPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  updateData: Record<string, unknown>,
  successLogMessage: string
) {
  const wcOrderId = paymentIntent.metadata?.wc_order_id;
  if (!wcOrderId) {
    return;
  }

  const order = await getWooCommerceOrder(wcOrderId);

  if (order.transaction_id !== paymentIntent.id) {
    logger.error('[Stripe Webhook] wc_order_id/transaction_id mismatch — refusing to update order', {
      orderId: wcOrderId,
      expectedTransactionId: paymentIntent.id,
      actualTransactionId: order.transaction_id,
    });
    return;
  }

  await updateWooCommerceOrder(wcOrderId, updateData);
  logger.info(`[Stripe Webhook] ${successLogMessage}`, {
    orderId: wcOrderId,
    paymentIntentId: paymentIntent.id,
  });
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  // Signature verification requires the raw, unparsed request body
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }
    const stripe = getStripeInstance();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    logError('stripe_webhook.signature_verification_failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Card orders are already marked paid synchronously in /api/payment/confirm; only
        // orders left "on-hold" (ACH awaiting settlement) carry a wc_order_id here.
        await reconcileOrderForPaymentIntent(
          paymentIntent,
          { set_paid: true, status: 'processing' },
          'Marked order paid after ACH settlement'
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await reconcileOrderForPaymentIntent(
          paymentIntent,
          { status: 'failed' },
          'Marked order failed after ACH settlement failure'
        );
        break;
      }
      default:
        // Ignore other event types — Stripe requires a 2xx response for any subscribed event
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError('stripe_webhook.processing_failed', error);
    // Non-2xx tells Stripe to retry delivery later
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
