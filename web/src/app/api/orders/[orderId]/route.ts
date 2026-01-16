/**
 * Order Details API Route
 * 
 * GET /api/orders/[orderId]
 * 
 * Fetches order details from WooCommerce by order ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL?.replace('/graphql', '') || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        {
          error: 'Missing Order ID',
          message: 'Order ID is required',
        },
        { status: 400 }
      );
    }

    // Convert to number for database ID query
    const databaseId = parseInt(orderId, 10);
    
    if (isNaN(databaseId)) {
      return NextResponse.json(
        {
          error: 'Invalid Order ID',
          message: 'Order ID must be a valid number',
        },
        { status: 400 }
      );
    }

    // Fetch order from WooCommerce REST API
    const auth = Buffer.from(
      `${process.env.WORDPRESS_API_USER}:${process.env.WORDPRESS_API_PASSWORD}`
    ).toString('base64');

    const wcResponse = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders/${databaseId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!wcResponse.ok) {
      if (wcResponse.status === 404) {
        return NextResponse.json(
          {
            error: 'Order Not Found',
            message: `Order with ID ${orderId} was not found`,
          },
          { status: 404 }
        );
      }
      throw new Error(`WooCommerce API error: ${wcResponse.status}`);
    }

    const wcOrder = await wcResponse.json();

    // Transform WooCommerce order to match our expected format
    const order = {
      id: wcOrder.id,
      orderNumber: wcOrder.number,
      status: wcOrder.status,
      date: wcOrder.date_created,
      total: wcOrder.total,
      subtotal: wcOrder.line_items.reduce((sum: number, item: any) => sum + parseFloat(item.subtotal), 0).toString(),
      totalTax: wcOrder.total_tax,
      shippingTotal: wcOrder.shipping_total,
      discountTotal: wcOrder.discount_total,
      currency: wcOrder.currency,
      paymentMethod: wcOrder.payment_method,
      paymentMethodTitle: wcOrder.payment_method_title,
      transactionId: wcOrder.transaction_id || null,
      billing: wcOrder.billing,
      shipping: wcOrder.shipping,
      // Map items for OrderItems component
      items: wcOrder.line_items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        quantity: item.quantity,
        price: `$${parseFloat(item.total).toFixed(2)}`,
        image: item.image?.src || null,
      })),
      lineItems: wcOrder.line_items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        total: item.total,
        subtotal: item.subtotal,
        product: {
          id: item.product_id,
          name: item.name,
          image: item.image?.src || null,
        },
      })),
      // Map addresses for display
      shippingAddress: {
        firstName: wcOrder.shipping.first_name || '',
        lastName: wcOrder.shipping.last_name || '',
        address1: wcOrder.shipping.address_1 || '',
        address2: wcOrder.shipping.address_2 || '',
        city: wcOrder.shipping.city || '',
        state: wcOrder.shipping.state || '',
        postcode: wcOrder.shipping.postcode || '',
        country: wcOrder.shipping.country || 'US',
      },
      billingAddress: {
        firstName: wcOrder.billing.first_name || '',
        lastName: wcOrder.billing.last_name || '',
        address1: wcOrder.billing.address_1 || '',
        address2: wcOrder.billing.address_2 || '',
        city: wcOrder.billing.city || '',
        state: wcOrder.billing.state || '',
        postcode: wcOrder.billing.postcode || '',
        country: wcOrder.billing.country || 'US',
      },
      shipping: wcOrder.shipping_total,
      tax: wcOrder.total_tax,
      createdAt: wcOrder.date_created,
      metaData: wcOrder.meta_data,
    };

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    logError('orders.fetch_failed', error);
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to fetch order details. Please try again later.',
    }, { status: 500 });
  }
}
