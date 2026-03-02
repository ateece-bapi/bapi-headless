/**
 * POST /api/auth/2fa/disable
 * 
 * Disable two-factor authentication for the current user
 * Body: { password: string, code: string }
 * Returns: { success: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyTwoFactorCode } from '@/lib/auth/two-factor';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * Get current authenticated user
 */
async function getCurrentUser(authToken: string) {
  const query = `
    query GetCurrentUser {
      viewer {
        id
        databaseId
        username
        email
        twoFactorEnabled
        twoFactorSecret
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const { data, errors } = await response.json();

  if (errors || !data?.viewer) {
    throw new Error('User not authenticated');
  }

  return data.viewer;
}

/**
 * Verify user's password
 */
async function verifyPassword(username: string, password: string): Promise<boolean> {
  const mutation = `
    mutation VerifyPassword($username: String!, $password: String!) {
      login(input: {
        username: $username
        password: $password
      }) {
        authToken
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: { username, password },
      }),
    });

    const { data, errors } = await response.json();
    return !errors && !!data?.login?.authToken;
  } catch {
    return false;
  }
}

/**
 * Handle POST request to disable 2FA for the current user
 */
export async function POST(request: NextRequest) {
  try {
    const { password, code } = await request.json();

    // Validate required fields
    if (!password || !code) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          message: 'Password and current 2FA code are required',
        },
        { status: 400 }
      );
    }

    // Validate code format is 6 digits
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format', message: 'Code must be 6 digits' },
        { status: 400 }
      );
    }

    // Get auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated', message: 'Please log in first' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await getCurrentUser(authToken);

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Not enabled', message: '2FA is not enabled for your account' },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user.username, password);
    
    if (!isPasswordValid) {
      logger.warn('Invalid password during 2FA disable', {
        userId: user.databaseId,
        username: user.username,
      });

      return NextResponse.json(
        { error: 'Invalid password', message: 'Password is incorrect' },
        { status: 401 }
      );
    }

    // Verify TOTP code
    const isCodeValid = verifyTwoFactorCode(user.twoFactorSecret, code);
    
    if (!isCodeValid) {
      logger.warn('Invalid 2FA code during disable', {
        userId: user.databaseId,
        username: user.username,
      });

      return NextResponse.json(
        {
          error: 'Invalid code',
          message: 'Authentication code is incorrect',
        },
        { status: 401 }
      );
    }

    // Both password and code are valid - disable 2FA
    const disableMutation = `
      mutation DisableTwoFactor($userId: Int!) {
        disableTwoFactor(
          input: {
            userId: $userId
          }
        ) {
          success
          message
        }
      }
    `;

    const disableResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: disableMutation,
        variables: {
          userId: user.databaseId,
        },
      }),
    });

    const { data: disableData, errors: disableErrors } = await disableResponse.json();

    if (disableErrors || !disableData?.disableTwoFactor?.success) {
      logger.error('Failed to disable 2FA in WordPress', {
        userId: user.databaseId,
        errors: disableErrors,
      });

      return NextResponse.json(
        {
          error: 'Disable failed',
          message: 'Unable to disable 2FA. Please try again.',
        },
        { status: 500 }
      );
    }

    logger.info('2FA disabled', {
      userId: user.databaseId,
      username: user.username,
    });

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication has been disabled',
    });
  } catch (error) {
    logger.error('2FA disable error', { error });
    return NextResponse.json(
      {
        error: 'Server error',
        message: 'Unable to disable 2FA. Please try again.',
      },
      { status: 500 }
    );
  }
}
