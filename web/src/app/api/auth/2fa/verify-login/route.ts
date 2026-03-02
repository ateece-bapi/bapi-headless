/**
 * POST /api/auth/2fa/verify-login
 * 
 * Verify TOTP code or backup code during login to complete authentication
 * Body: { tempToken: string, code: string, useBackupCode?: boolean }
 * Returns: { success: boolean, authToken?: string, refreshToken?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { verifyTwoFactorCode } from '@/lib/auth/two-factor';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limit';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

interface TempTokenPayload {
  userId: string;
  username: string;
  authToken: string;
  refreshToken: string;
  iat?: number; // JWT issued at
  exp?: number; // JWT expiration
}

/**
 * Verify cryptographically signed temporary token from initial login
 */
function verifyTempToken(token: string): TempTokenPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      return null;
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, jwtSecret) as TempTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Temp token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid temp token signature');
    }
    return null;
  }
}

/**
 * Handle POST request to verify 2FA code during login
 */
export async function POST(request: NextRequest) {
  try {
    const { tempToken, code, useBackupCode } = await request.json();

    if (!tempToken || !code) {
      return NextResponse.json(
        { error: 'Missing parameters', message: 'Token and code are required' },
        { status: 400 }
      );
    }

    // Rate limiting check (prevent 2FA brute force)
    // Use tempToken as identifier (5 failed attempts = lockout)
    const rateLimitIdentifier = `2fa_verify_${tempToken.substring(0, 20)}`;
    const rateLimitCheck = checkRateLimit(rateLimitIdentifier);
    
    if (!rateLimitCheck.allowed) {
      logger.warn('2FA verification rate limit exceeded', { ...rateLimitCheck });
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: rateLimitCheck.message || 'Too many failed verification attempts',
        },
        { status: 429 }
      );
    }

    // Verify temporary token
    const tokenPayload = verifyTempToken(tempToken);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          error: 'Invalid token',
          message: 'Login session expired. Please start login again.',
        },
        { status: 401 }
      );
    }

    // Get user's 2FA secret from WordPress
    const getUserQuery = `
      query GetUserTwoFactor($userId: Int!) {
        user(id: $userId, idType: DATABASE_ID) {
          id
          twoFactorSecret
          twoFactorEnabled
        }
      }
    `;

    const queryResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenPayload.authToken}`, // Use token from temp payload
      },
      body: JSON.stringify({
        query: getUserQuery,
        variables: {
          userId: parseInt(tokenPayload.userId),
        },
      }),
    });

    const { data: queryData, errors: queryErrors } = await queryResponse.json();

    if (queryErrors || !queryData?.user) {
      logger.error('Failed to retrieve user 2FA data', { queryErrors });
      return NextResponse.json(
        { error: 'Verification failed', message: 'Unable to verify 2FA' },
        { status: 500 }
      );
    }

    const { twoFactorSecret, twoFactorEnabled } = queryData.user;

    if (!twoFactorEnabled || !twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA not enabled', message: '2FA is not enabled for this account' },
        { status: 400 }
      );
    }

    let isValid = false;

    if (useBackupCode) {
      // Verify and consume backup code via GraphQL mutation
      const useBackupCodeMutation = `
        mutation UseTwoFactorBackupCode($code: String!, $userId: Int!) {
          useTwoFactorBackupCode(
            input: {
              code: $code
              userId: $userId
            }
          ) {
            valid
            message
          }
        }
      `;

      const backupResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenPayload.authToken}`,
        },
        body: JSON.stringify({
          query: useBackupCodeMutation,
          variables: {
            code,
            userId: parseInt(tokenPayload.userId),
          },
        }),
      });

      const { data: backupData } = await backupResponse.json();
      isValid = backupData?.useTwoFactorBackupCode?.valid || false;

      if (isValid) {
        logger.info('2FA backup code used', {
          userId: tokenPayload.userId,
          username: tokenPayload.username,
        });
      }
    } else {
      // Verify TOTP code
      isValid = verifyTwoFactorCode(twoFactorSecret, code);

      if (isValid) {
        logger.info('2FA TOTP verified', {
          userId: tokenPayload.userId,
          username: tokenPayload.username,
        });
      }
    }

    if (!isValid) {
      // Record failed attempt for rate limiting
      recordFailedAttempt(rateLimitIdentifier);
      
      logger.warn('Invalid 2FA code during login', {
        userId: tokenPayload.userId,
        useBackupCode,
      });

      return NextResponse.json(
        {
          error: 'Invalid code',
          message: useBackupCode
            ? 'Invalid backup code. Please try again.'
            : 'Invalid authentication code. Please try again.',
        },
        { status: 401 }
      );
    }

    // Clear rate limit on successful verification
    clearAttempts(rateLimitIdentifier);

    // Code is valid - complete login by setting auth cookies
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
    };

    const cookieStore = await cookies();
    cookieStore.set('auth_token', tokenPayload.authToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set('refresh_token', tokenPayload.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    logger.info('2FA login completed', {
      userId: tokenPayload.userId,
      username: tokenPayload.username,
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });
  } catch (error) {
    logger.error('2FA verify-login error', { error });
    return NextResponse.json(
      { error: 'Server error', message: 'Unable to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
