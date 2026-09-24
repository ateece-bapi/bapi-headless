/**
 * Stripe Payment Confirmation API Route
 *
 * POST /api/payment/confirm
 *
 * Confirms payment and creates WooCommerce order via GraphQL checkout mutation
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import logger from '@/lib/logger';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

// WooCommerce REST API credentials
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;
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

/**
 * Links a settling PaymentIntent to its WooCommerce order (via metadata) so the Stripe
 * webhook can find and reconcile it later. Retries a few times before giving up, since
 * Stripe won't redeliver a successfully-acknowledged settlement event just because the
 * metadata arrives late — a permanently unlinked order would otherwise stay on-hold forever.
 */
async function linkPaymentIntentToOrder(
  stripe: Stripe,
  paymentIntent: Stripe.PaymentIntent,
  orderId: number,
  maxAttempts = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { ...paymentIntent.metadata, wc_order_id: String(orderId) },
      });
      return true;
    } catch (linkError) {
      logError('payment.confirm_ach_link_attempt_failed', linkError, {
        orderId,
        paymentIntentId: paymentIntent.id,
        attempt,
      });
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
      }
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeInstance();
    const body = await request.json();
    const { paymentIntentId, orderData, cartItems } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          error: 'Missing Payment Intent',
          message: 'Payment intent ID is required',
        },
        { status: 400 }
      );
    }

    if (!orderData || !orderData.shippingAddress || !orderData.billingAddress) {
      return NextResponse.json(
        {
          error: 'Missing Order Data',
          message: 'Shipping and billing addresses are required',
        },
        { status: 400 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        {
          error: 'Empty Cart',
          message: 'Cart items are required',
        },
        { status: 400 }
      );
    }

    // Retrieve payment intent (expanded to get the actual PaymentMethod used, not just the
    // list of allowed types) to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method'],
    });

    // ACH (us_bank_account) settles asynchronously and stays "processing" for 1-4 business days —
    // that's an expected, valid state for creating the order, not a failure.
    if (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'processing') {
      return NextResponse.json(
        {
          error: 'Payment Not Completed',
          message: 'Payment has not been confirmed yet',
        },
        { status: 400 }
      );
    }

    const isSettled = paymentIntent.status === 'succeeded';
    // payment_method_types lists every type the intent *allowed*, not the one actually used
    // (e.g. the unscoped fallback allows both card and us_bank_account) — the resolved
    // PaymentMethod object is the only reliable source for which one the customer used.
    const paymentMethodType =
      typeof paymentIntent.payment_method === 'object' && paymentIntent.payment_method
        ? paymentIntent.payment_method.type
        : paymentIntent.payment_method_types?.[0];

    // Only Card and Bank Account are offered by the checkout UI — reject anything else
    // (e.g. a PaymentIntent created directly against the Stripe API with Klarna/crypto/etc.)
    // rather than silently recording it as a card order.
    if (paymentMethodType !== 'card' && paymentMethodType !== 'us_bank_account') {
      return NextResponse.json(
        {
          error: 'Unsupported Payment Method',
          message: 'This payment method is not supported for checkout.',
        },
        { status: 400 }
      );
    }

    const isBankTransfer = paymentMethodType === 'us_bank_account';
    const paymentMethodTitle = isBankTransfer ? 'Bank Account (ACH - Stripe)' : 'Credit Card (Stripe)';

    logger.debug('[Payment Confirm] Creating WooCommerce order via REST API', {
      itemCount: cartItems.length,
    });

    // Create order using WooCommerce REST API
    const wcOrderData = {
      payment_method: 'stripe',
      payment_method_title: paymentMethodTitle,
      set_paid: isSettled,
      // ACH orders stay "on-hold" until the bank transfer clears (WooCommerce's BACS convention)
      ...(isSettled ? {} : { status: 'on-hold' }),
      transaction_id: paymentIntent.id,
      billing: {
        first_name: orderData.billingAddress.firstName,
        last_name: orderData.billingAddress.lastName,
        address_1: orderData.billingAddress.address1,
        address_2: orderData.billingAddress.address2 || '',
        city: orderData.billingAddress.city,
        state: orderData.billingAddress.state,
        postcode: orderData.billingAddress.zipCode,
        country: orderData.billingAddress.country || 'US',
        email: orderData.billingAddress.email,
        phone: orderData.billingAddress.phone || '',
      },
      shipping: {
        first_name: orderData.shippingAddress.firstName,
        last_name: orderData.shippingAddress.lastName,
        address_1: orderData.shippingAddress.address1,
        address_2: orderData.shippingAddress.address2 || '',
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postcode: orderData.shippingAddress.zipCode,
        country: orderData.shippingAddress.country || 'US',
      },
      line_items: cartItems.map((item: any) => ({
        product_id: Number(item.databaseId),
        quantity: item.quantity,
      })),
      customer_note: orderData.orderNotes || '',
      meta_data: [
        {
          key: '_stripe_payment_intent_id',
          value: paymentIntent.id,
        },
        {
          key: '_stripe_charge_id',
          value: (paymentIntent.latest_charge as string) || '',
        },
      ],
    };

    // Use WordPress Application Password for authentication
    const auth = Buffer.from(
      `${process.env.WORDPRESS_API_USER}:${process.env.WORDPRESS_API_PASSWORD}`
    ).toString('base64');

    const wcResponse = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(wcOrderData),
    });

    if (!wcResponse.ok) {
      const errorText = await wcResponse.text();
      logger.error('[Payment Confirm] WooCommerce API error', { error: errorText });
      throw new Error(`WooCommerce order creation failed: ${wcResponse.status}`);
    }

    const order = await wcResponse.json();
    logger.info('[Payment Confirm] Order created successfully', { orderId: order.id });

    if (!isSettled) {
      // Link the PaymentIntent to this order so the Stripe webhook (payment_intent.succeeded)
      // can mark it paid once the ACH transfer actually clears — otherwise the order would
      // stay "on-hold" forever, since nothing else re-checks it after this request.
      // The order was already created successfully at this point, so a transient failure here
      // must not surface as a request failure (that would strand the order and risk the
      // customer retrying and creating a duplicate).
      const linked = await linkPaymentIntentToOrder(stripe, paymentIntent, order.id);

      if (!linked) {
        // All retries exhausted — persist a visible flag on the order itself (not just logs)
        // so support/ops can find and manually reconcile it; the webhook has no other way to
        // locate this order once wc_order_id metadata couldn't be attached.
        logError(
          'payment.confirm_ach_link_failed',
          new Error('Exhausted retries linking PaymentIntent to order'),
          { orderId: order.id, paymentIntentId: paymentIntent.id }
        );

        try {
          await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders/${order.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              customer_note: [
                orderData.orderNotes,
                `[SYSTEM] ACH reconciliation link failed for PaymentIntent ${paymentIntent.id} — requires manual follow-up to mark this order paid once the bank transfer settles.`,
              ]
                .filter(Boolean)
                .join('\n'),
            }),
          });
        } catch (noteError) {
          logError('payment.confirm_ach_link_flag_failed', noteError, {
            orderId: order.id,
            paymentIntentId: paymentIntent.id,
          });
        }
      }
    }

    // Return order details with clearCart flag
    return NextResponse.json({
      success: true,
      clearCart: true, // Signal to client to clear cart
      order: {
        id: order.id,
        orderNumber: order.number,
        status: order.status,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.payment_method,
        transactionId: order.transaction_id,
      },
    });
  } catch (error) {
    logError('payment.confirm_failed', error);

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.SERVER_ERROR.title,
        message: 'Unable to confirm payment and create order. Please contact support.',
      },
      { status: 500 }
    );
  }
}
