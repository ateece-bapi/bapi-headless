import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

/**
 * POST /api/auth/logout
 *
 * Clears both auth_token and refresh_token cookies.
 * Returns success status for client-side handling.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear both authentication cookies
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');

    logger.debug('User logged out successfully');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
        message: 'Unable to log out. Please try again.',
      },
      { status: 500 }
    );
  }
}
