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

    logger.debug('[Payment Confirm] Creating WooCommerce order via REST API', { 
      itemCount: cartItems.length 
    });
    
    // Create order using WooCommerce REST API
    const wcOrderData = {
      payment_method: 'stripe',
      payment_method_title: 'Credit Card (Stripe)',
      set_paid: true,
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
          value: paymentIntent.latest_charge as string || '',
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
        'Authorization': `Basic ${auth}`,
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
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to confirm payment and create order. Please contact support.',
    }, { status: 500 });
  }
}
