import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * POST /api/auth/login
 * 
 * Authenticates user with WordPress using WPGraphQL JWT Authentication.
 * Token is stored in httpOnly cookie for security.
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials', message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with WPGraphQL JWT
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(input: { username: $username, password: $password }) {
              authToken
              refreshToken
              user {
                id
                databaseId
                email
                name
                username
              }
            }
          }
        `,
        variables: { username, password },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.login?.authToken) {
      logger.error('WordPress authentication failed', { errors });
      
      return NextResponse.json(
        { 
          error: 'Authentication failed', 
          message: errors?.[0]?.message || 'Invalid username or password' 
        },
        { status: 401 }
      );
    }

    const { authToken, refreshToken, user } = data.login;
    
    // Enhanced cookie options with BFF pattern security
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,           // Prevent XSS attacks
      secure: isProd,            // HTTPS only in production
      sameSite: 'lax' as const, // CSRF protection
      path: '/',
    };
    
    // Set httpOnly cookies with JWT tokens
    const cookieStore = await cookies();
    cookieStore.set('auth_token', authToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    logger.debug('User authenticated successfully', { 
      userId: user.databaseId,
      email: user.email 
    });

    return NextResponse.json({
      success: true,
      user: {
        id: String(user.databaseId),
        email: user.email,
        displayName: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    logger.error('Login error', { error });
    return NextResponse.json(
      { error: 'Server error', message: 'Unable to process login request' },
      { status: 500 }
    );
  }
}
