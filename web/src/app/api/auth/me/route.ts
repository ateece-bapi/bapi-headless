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

    // Process customer groups from ACF fields (customer_group1/2/3)
    // Filter out null, empty strings, and "NO ACCESS" values
    const customerGroups = [
      viewer.customerGroup1,
      viewer.customerGroup2,
      viewer.customerGroup3,
    ]
      .filter((group): group is string => {
        return (
          typeof group === 'string' &&
          group.trim().length > 0 &&
          group.toUpperCase() !== 'NO ACCESS'
        );
      })
      .map(group => group.trim());

    // Default to 'END USER' if no valid groups (matches legacy WordPress behavior)
    const finalCustomerGroups = customerGroups.length > 0 ? customerGroups : ['END USER'];

    return NextResponse.json({
      user: {
        id: String(viewer.databaseId),
        email: viewer.email,
        displayName: viewer.name,
        username: viewer.username,
        twoFactorEnabled: viewer.twoFactorEnabled,
        customerGroups: finalCustomerGroups,
        roles,
      },
    });
  } catch (error) {
    logger.error('Auth check error', { error });
    return NextResponse.json({ error: 'Server error', user: null }, { status: 500 });
  }
}
