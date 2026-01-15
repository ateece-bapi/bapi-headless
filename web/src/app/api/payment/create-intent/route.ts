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
    const { amount, currency = 'usd', metadata = {} } = body;

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

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    logError('payment.create_intent_failed', error);
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to create payment intent. Please try again.',
    }, { status: 500 });
  }
}
