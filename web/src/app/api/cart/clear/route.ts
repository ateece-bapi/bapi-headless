/**
 * Empty Cart API Route
 * 
 * DELETE /api/cart/clear
 * 
 * Removes all items from WooCommerce cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/services/cart';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

export async function DELETE(request: NextRequest) {
  try {
    // Get WooCommerce session token from cookies
    const sessionToken = request.cookies.get('woocommerce-session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({
        error: ERROR_MESSAGES.UNAUTHORIZED.title,
        message: 'No cart session found.',
      }, { status: 401 });
    }
    
    // Empty cart via WooCommerce GraphQL
    const result = await CartService.emptyCart(sessionToken);
    
    return NextResponse.json({
      success: true,
      cart: result.emptyCart?.cart,
    });
    
  } catch (error) {
    logError('cart.clear_failed', error);
    
    return NextResponse.json({
      error: ERROR_MESSAGES.SERVER_ERROR.title,
      message: 'Unable to clear cart. Please try again.',
    }, { status: 500 });
  }
}
