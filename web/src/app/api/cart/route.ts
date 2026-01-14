/**
 * Get Cart API Route
 * 
 * GET /api/cart
 * 
 * Returns current WooCommerce cart with items, totals, and shipping
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/services/cart';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    // Get WooCommerce session token from cookies
    const sessionToken = request.cookies.get('woocommerce-session')?.value;
    
    // Fetch cart from WooCommerce
    const result = await CartService.getCart(sessionToken);
    
    return NextResponse.json({
      success: true,
      cart: result.cart,
    });
    
  } catch (error) {
    logError('cart.fetch_failed', error);
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to load cart. Please try again.',
    }, { status: 500 });
  }
}
