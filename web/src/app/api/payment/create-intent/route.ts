/**
 * Stripe Payment Intent API Route
 *
 * POST /api/payment/create-intent
 *
 * Creates a Stripe Payment Intent for checkout
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

// Initialize Stripe (server-side only)
function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeInstance();
    const body = await request.json();
    const { amount, currency = 'usd', paymentMethodType } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid Amount',
          message: 'Amount must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Scope the intent to the tile the customer picked, falling back to both when unspecified.
    // Restrict to Card + Bank (ACH) only, per accounting feedback — Klarna/Crypto/etc. are excluded.
    type AllowedPaymentMethodType = 'card' | 'us_bank_account';
    const ALLOWED_PAYMENT_METHOD_TYPES: Record<string, AllowedPaymentMethodType[]> = {
      credit_card: ['card'],
      bank_account: ['us_bank_account'],
    };
    const paymentMethodTypes: AllowedPaymentMethodType[] =
      ALLOWED_PAYMENT_METHOD_TYPES[paymentMethodType] ?? ['card', 'us_bank_account'];

    // Create Payment Intent
    // metadata is fixed server-side (never taken from the request body) — the webhook trusts
    // wc_order_id in PaymentIntent metadata to reconcile ACH settlement, so a client-controlled
    // metadata field here would let a caller redirect that reconciliation to an arbitrary order.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { checkoutFlow: 'bapi-headless' },
      payment_method_types: paymentMethodTypes,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logError('payment.create_intent_failed', error);

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.SERVER_ERROR.title,
        message: 'Unable to create payment intent. Please try again.',
      },
      { status: 500 }
    );
  }
}
