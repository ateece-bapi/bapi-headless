/**
 * Add to Cart API Route
 * 
 * POST /api/cart/add
 * 
 * Adds item to WooCommerce cart with session persistence
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/services/cart';
import { ERROR_MESSAGES, logError } from '@/lib/errors';
import { z } from 'zod';

// Request validation schema
const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
  variationId: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    console.log('[API /cart/add] Request:', body);
    
    // Validate input
    const validatedData = addToCartSchema.parse(body);
    
    console.log('[API /cart/add] Validated:', validatedData);
    
    // Get WooCommerce session token from cookies (try multiple names)
    const sessionToken = request.cookies.get('woo-session')?.value ||
                        request.cookies.get('woocommerce-session')?.value;
    
    console.log('[API /cart/add] Session token:', sessionToken ? 'Present' : 'Missing');
    
    // Add to cart via WooCommerce GraphQL
    const result = await CartService.addToCart(
      validatedData.productId,
      validatedData.quantity,
      validatedData.variationId,
      sessionToken
    );
    
    console.log('[API /cart/add] Result:', JSON.stringify(result, null, 2));
    
    // Extract cart key if available (WooCommerce sometimes returns this)
    const cartKey = result.addToCart?.cartItem?.key;
    
    // Return cart data
    const response = NextResponse.json({
      success: true,
      cart: result.addToCart?.cart,
      cartItem: result.addToCart?.cartItem,
      cartKey: cartKey,
    });
    
    // If we got a cart key, store it in a cookie for future requests
    if (cartKey) {
      response.cookies.set('woo-cart-key', cartKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      console.log('[API /cart/add] Cart key stored:', cartKey);
    }
    
    console.log('[API /cart/add] Success');
    
    return response;
    
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: ERROR_MESSAGES.VALIDATION_ERROR.title,
        message: error.errors.map(e => e.message).join(', '),
      }, { status: 400 });
    }
    
    // GraphQL or network error
    logError('cart.add_failed', error, { body: await request.json().catch(() => ({})) });
    
    return NextResponse.json({
      error: ERROR_MESSAGES.ADD_TO_CART_ERROR.title,
      message: ERROR_MESSAGES.ADD_TO_CART_ERROR.message,
    }, { status: 500 });
  }
}
