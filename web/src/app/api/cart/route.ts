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
    // Get WooCommerce session token from cookies (try multiple cookie names)
    const sessionToken = request.cookies.get('woo-session')?.value || 
                        request.cookies.get('woocommerce-session')?.value;
    
    console.log('[API /cart GET] Session token:', sessionToken ? 'Present' : 'Missing');
    
    // Fetch cart from WooCommerce
    const result = await CartService.getCart(sessionToken);
    
    console.log('[API /cart GET] Cart:', JSON.stringify(result.cart, null, 2));
    
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
