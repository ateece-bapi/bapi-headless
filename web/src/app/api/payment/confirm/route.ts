/**
 * Stripe Payment Confirmation API Route
 * 
 * POST /api/payment/confirm
 * 
 * Confirms payment and creates WooCommerce order
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

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
    const { paymentIntentId, orderData } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        {
          error: 'Missing Payment Intent',
          message: 'Payment intent ID is required',
        },
        { status: 400 }
      );
    }

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        {
          error: 'Payment Not Completed',
          message: 'Payment has not been confirmed yet',
        },
        { status: 400 }
      );
    }

    // TODO: Create WooCommerce order with GraphQL mutation
    // For now, return mock order data
    const order = {
      id: Math.floor(Math.random() * 100000),
      status: 'processing',
      total: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency.toUpperCase(),
      paymentMethod: 'stripe',
      transactionId: paymentIntent.id,
      ...orderData,
    };

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    logError('payment.confirm_failed', error);
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to confirm payment. Please contact support.',
    }, { status: 500 });
  }
}
