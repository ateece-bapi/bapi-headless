/**
 * POST /api/auth/2fa/verify-setup
 * 
 * Verify TOTP code to complete 2FA setup and enable it
 * Requires: User must be authenticated with pending 2FA setup
 * Body: { code: string }
 * Returns: { success: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { verifyTwoFactorCode } from '@/lib/auth/two-factor';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code', message: 'Please enter a valid 6-digit code' },
        { status: 400 }
      );
    }

    // Must be authenticated
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated', message: 'Please sign in to verify 2FA'  },
        { status: 401 }
      );
    }

    // Get stored secret from WordPress (via GraphQL)
    const getUserQuery = `
      query GetUserTwoFactor {
        viewer {
          twoFactorSecret
          twoFactorEnabled
        }
      }
    `;

    const queryResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.cookies.get('auth_token')?.value}`,
      },
      body: JSON.stringify({
        query: getUserQuery,
      }),
    });

    const { data: queryData, errors: queryErrors } = await queryResponse.json();

    if (queryErrors || !queryData?.viewer?.twoFactorSecret) { 
      logger.error('Failed to retrieve 2FA secret', { queryErrors });
      return NextResponse.json(
        {
          error: 'Setup incomplete',
          message: 'No 2FA setup found. Please start setup process first.',
        },
        { status: 400 }
      );
    }

    const { twoFactorSecret, twoFactorEnabled } = queryData.viewer;

    // Check if already enabled
    if (twoFactorEnabled) {
      return NextResponse.json(
        {
          error: 'Already enabled',
          message: '2FA is already enabled for your account',
        },
        { status: 400 }
      );
    }

    // Verify code
    const isValid = verifyTwoFactorCode(twoFactorSecret, code);

    if (!isValid) {
      logger.warn('Invalid 2FA verification code', { userId: user.id });
      return NextResponse.json(
        {
          error: 'Invalid code',
          message: 'The code you entered is incorrect. Please try again.',
        },
        { status: 400 }
      );
    }

    // Code is valid - enable 2FA in WordPress
    const enableMutation = `
      mutation EnableTwoFactor {
        updateTwoFactorSecret(
          input: {
            enabled: true
          }
        ) {
          success
          message
          user {
            twoFactorEnabled
          }
        }
      }
    `;

    const enableResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.cookies.get('auth_token')?.value}`,
      },
      body: JSON.stringify({
        query: enableMutation,
      }),
    });

    const { data: enableData, errors: enableErrors } = await enableResponse.json();

    if (enableErrors || !enableData?.updateTwoFactorSecret?.success) {
      logger.error('Failed to enable 2FA in WordPress', { enableErrors });
      return NextResponse.json(
        {
          error: 'Enable failed',
          message: 'Failed to enable 2FA. Please try again.',
        },
        { status: 500 }
      );
    }

    logger.info('2FA enabled successfully', { userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication has been enabled successfully',
    });
  } catch (error) {
    logger.error('2FA verify-setup error', { error });
    return NextResponse.json(
      { error: 'Server error', message: 'Unable to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
