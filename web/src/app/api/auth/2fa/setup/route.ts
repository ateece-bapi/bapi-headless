/**
 * POST /api/auth/2fa/setup
 * 
 * Generate TOTP secret and QR code for 2FA setup
 * Requires: User must be authenticated
 * Returns: QR code, secret (for manual entry), backup codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { generateTwoFactorSecret, generateBackupCodes } from '@/lib/auth/two-factor';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * Handle POST request to initiate 2FA setup
 */
export async function POST(request: NextRequest) {
  try {
    // Must be authenticated
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated', message: 'Please sign in to enable 2FA' },
        { status: 401 }
      );
    }

    // Check if user already has 2FA enabled
    // Query WordPress for current 2FA status
    const checkQuery = `
      query CheckTwoFactorStatus {
        viewer {
          twoFactorEnabled
        }
      }
    `;

    const checkResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.cookies.get('auth_token')?.value}`,
      },
      body: JSON.stringify({ query: checkQuery }),
    });

    const { data: checkData } = await checkResponse.json();

    if (checkData?.viewer?.twoFactorEnabled) {
      return NextResponse.json(
        {
          error: '2FA already enabled',
          message: 'Two-factor authentication is already active. Disable it first to re-setup.',
        },
        { status: 400 }
      );
    }

    // Generate TOTP secret and QR code
    const { secret, qrCode, uri } = await generateTwoFactorSecret(
      user.email || user.username,
      user.displayName || user.username
    );

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);

    // Store secret in WordPress (NOT enabled yet - requires verification)
    const updateSecretMutation = `
      mutation UpdateTwoFactorSecret($secret: String!, $enabled: Boolean!, $backupCodes: [String!]) {
        updateTwoFactorSecret(
          input: {
            secret: $secret
            enabled: $enabled
            backupCodes: $backupCodes
          }
        ) {
          success
          message
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.cookies.get('auth_token')?.value}`,
      },
      body: JSON.stringify({
        query: updateSecretMutation,
        variables: {
          secret,
          enabled: false, // Not enabled until user verifies first code
          backupCodes,
        },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.updateTwoFactorSecret?.success) {
      logger.error('Failed to store 2FA secret in WordPress', { errors });
      return NextResponse.json(
        {
          error: 'Setup failed',
          message: 'Failed to store 2FA configuration. Please try again.',
        },
        { status: 500 }
      );
    }

    logger.info('2FA setup initiated', { userId: user.id, email: user.email });

    // Return setup data to user
    return NextResponse.json({
      success: true,
      qrCode, // Data URL for QR code image
      secret, // For manual entry in authenticator app
      uri, // otpauth:// URI
      backupCodes, // Display once, user must save
    });
  } catch (error) {
    logger.error('2FA setup error', { error });
    return NextResponse.json(
      { error: 'Server error', message: 'Unable to setup 2FA. Please try again later.' },
      { status: 500 }
    );
  }
}
