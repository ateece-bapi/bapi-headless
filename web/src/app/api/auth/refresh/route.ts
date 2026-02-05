import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * POST /api/auth/refresh
 * 
 * Refreshes JWT auth token using refresh token.
 * Implements silent refresh pattern for seamless user experience.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token', message: 'Please sign in again' },
        { status: 401 }
      );
    }

    // Refresh auth token with WPGraphQL JWT
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($token: String!) {
            refreshJwtAuthToken(input: { jwtRefreshToken: $token }) {
              authToken
            }
          }
        `,
        variables: { token: refreshToken },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.refreshJwtAuthToken?.authToken) {
      logger.error('Token refresh failed', { errors });
      
      // Clear invalid tokens
      cookieStore.delete('auth_token');
      cookieStore.delete('refresh_token');
      
      return NextResponse.json(
        { 
          error: 'Token refresh failed', 
          message: 'Session expired. Please sign in again.' 
        },
        { status: 401 }
      );
    }

    const { authToken } = data.refreshJwtAuthToken;
    
    // Update auth token cookie with new token
    cookieStore.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    logger.debug('Token refreshed successfully');

    return NextResponse.json({
      success: true,
      message: 'Token refreshed',
    });
  } catch (error) {
    logger.error('Token refresh error', { error });
    return NextResponse.json(
      { error: 'Server error', message: 'Unable to refresh token' },
      { status: 500 }
    );
  }
}
