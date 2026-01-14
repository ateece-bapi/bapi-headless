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
    
    // Validate input
    const validatedData = addToCartSchema.parse(body);
    
    // Get WooCommerce session token from cookies
    const sessionToken = request.cookies.get('woocommerce-session')?.value;
    
    // Add to cart via WooCommerce GraphQL
    const result = await CartService.addToCart(
      validatedData.productId,
      validatedData.quantity,
      validatedData.variationId,
      sessionToken
    );
    
    // Extract new session token from response headers (if provided by WooCommerce)
    const newSessionToken = result.addToCart?.cart
      ? request.cookies.get('woocommerce-session')?.value
      : undefined;
    
    // Return cart data
    const response = NextResponse.json({
      success: true,
      cart: result.addToCart?.cart,
      cartItem: result.addToCart?.cartItem,
    });
    
    // Set session cookie if new token provided
    if (newSessionToken) {
      response.cookies.set('woocommerce-session', newSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    
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
