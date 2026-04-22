import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';
import { GET_CURRENT_USER_QUERY, type GetCurrentUserResponse } from '@/lib/auth/queries';
import { slugifyArray } from '@/lib/utils/slugify';

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

    // Process customer groups from ACF fields (customerInformation.customerGroup1/2/3)
    // Schema: These are LIST types (arrays of strings)
    // Filter out null, empty strings, and "NO ACCESS" values
    // Then slugify to match WordPress taxonomy slugs ("END USER" → "end-user")
    const customerInfo = viewer.customerInformation;
    const rawCustomerGroups = [
      ...(customerInfo?.customerGroup1 || []),
      ...(customerInfo?.customerGroup2 || []),
      ...(customerInfo?.customerGroup3 || []),
    ]
      .filter((group): group is string => typeof group === 'string')
      .map((group) => group.trim())
      .filter((group) => group.length > 0 && group.toUpperCase() !== 'NO ACCESS');

    // Slugify groups to match taxonomy slugs ("END USER" → "end-user")
    const slugifiedGroups = slugifyArray(rawCustomerGroups);

    // Default to 'end-user' if no valid groups (matches legacy WordPress behavior)
    const finalCustomerGroups = slugifiedGroups.length > 0 ? slugifiedGroups : ['end-user'];

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
