/**
 * Remove from Cart API Route
 *
 * DELETE /api/cart/remove
 *
 * Removes item from WooCommerce cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/services/cart';
import { ERROR_MESSAGES, logError } from '@/lib/errors';
import { z } from 'zod';

// Request validation schema
const removeFromCartSchema = z.object({
  key: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = removeFromCartSchema.parse(body);

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

    // Remove from cart via WooCommerce GraphQL
    const result = await CartService.removeItem(validatedData.key, sessionToken);

    return NextResponse.json({
      success: true,
      cart: result.removeItemsFromCart?.cart,
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

    logError('cart.remove_failed', error, { body: await request.json().catch(() => ({})) });

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.SERVER_ERROR.title,
        message: 'Unable to remove item. Please try again.',
      },
      { status: 500 }
    );
  }
}
