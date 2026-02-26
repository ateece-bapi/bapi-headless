import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';
import { GET_CURRENT_USER_QUERY, type GetCurrentUserResponse } from '@/lib/auth/queries';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * GET /api/auth/me
 *
 * Returns current authenticated user from WordPress JWT token.
 * Uses WPGraphQL JWT Authentication viewer query.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated', user: null }, { status: 401 });
    }

    // Query current user with GraphQL
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_CURRENT_USER_QUERY,
      }),
    });

    const { data, errors }: { data: GetCurrentUserResponse; errors?: any[] } =
      await response.json();

    if (errors || !data?.viewer) {
      logger.debug('Token validation failed', { errors });

      // Clear invalid token
      cookieStore.delete('auth_token');
      cookieStore.delete('refresh_token');

      return NextResponse.json({ error: 'Invalid token', user: null }, { status: 401 });
    }

    const { viewer } = data;

    // Extract role names from the GraphQL response
    const roles = viewer.roles?.nodes?.map((role: { name: string }) => role.name) || [];

    return NextResponse.json({
      user: {
        id: String(viewer.databaseId),
        email: viewer.email,
        displayName: viewer.name,
        username: viewer.username,
        roles,
      },
    });
  } catch (error) {
    logger.error('Auth check error', { error });
    return NextResponse.json({ error: 'Server error', user: null }, { status: 500 });
  }
}
