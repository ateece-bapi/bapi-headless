/**
 * Update Cart Item API Route
 *
 * PATCH /api/cart/update
 *
 * Updates quantity of cart item in WooCommerce
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/services/cart';
import { ERROR_MESSAGES, logError } from '@/lib/errors';
import { z } from 'zod';

// Request validation schema
const updateCartSchema = z.object({
  key: z.string().min(1),
  quantity: z.number().int().min(0), // 0 to remove
});

export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = updateCartSchema.parse(body);

    // Get WooCommerce session token from cookies
    const sessionToken = request.cookies.get('woocommerce-session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.UNAUTHORIZED.title,
          message: 'No cart session found.',
        },
        { status: 401 }
      );
    }

    // Update cart item via WooCommerce GraphQL
    const result = await CartService.updateQuantity(
      validatedData.key,
      validatedData.quantity,
      sessionToken
    );

    return NextResponse.json({
      success: true,
      cart: result.updateItemQuantities?.cart,
    });
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.VALIDATION_ERROR.title,
          message: error.errors.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    logError('cart.update_failed', error, { body: await request.json().catch(() => ({})) });

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.SERVER_ERROR.title,
        message: 'Unable to update cart. Please try again.',
      },
      { status: 500 }
    );
  }
}
