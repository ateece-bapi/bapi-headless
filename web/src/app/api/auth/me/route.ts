import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';
import {
  GET_CURRENT_USER_QUERY,
  REFRESH_TOKEN_MUTATION,
  type GetCurrentUserResponse,
  type RefreshTokenResponse,
} from '@/lib/auth/queries';
import { slugifyArray } from '@/lib/utils/slugify';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * Build a NextResponse with the authenticated user shape from a viewer object.
 */
function buildUserResponse(viewer: NonNullable<GetCurrentUserResponse['viewer']>): NextResponse {
  const roles = viewer.roles?.nodes?.map((role: { name: string }) => role.name) || [];

  const customerInfo = viewer.customerInformation;
  const rawCustomerGroups = [
    ...(customerInfo?.customerGroup1 || []),
    ...(customerInfo?.customerGroup2 || []),
    ...(customerInfo?.customerGroup3 || []),
  ]
    .filter((group): group is string => typeof group === 'string')
    .map((group) => group.trim())
    .filter((group) => group.length > 0 && group.toUpperCase() !== 'NO ACCESS');

  const slugifiedGroups = slugifyArray(rawCustomerGroups);
  const finalCustomerGroups = slugifiedGroups.length > 0 ? slugifiedGroups : ['end-user'];

  // NOTE: 2FA will be implemented in Phase 2
  // Phase 1 uses standard JWT authentication only
  return NextResponse.json({
    user: {
      id: String(viewer.databaseId),
      email: viewer.email,
      displayName: viewer.name,
      username: viewer.username,
      customerGroups: finalCustomerGroups,
      roles,
    },
  });
}

/**
 * Fetch the current viewer from WordPress using a JWT bearer token.
 */
async function fetchViewer(
  token: string,
): Promise<{ data: GetCurrentUserResponse; errors?: unknown[] }> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: GET_CURRENT_USER_QUERY }),
  });
  return response.json();
}

/**
 * GET /api/auth/me
 *
 * Returns current authenticated user from WordPress JWT token.
 * Uses WPGraphQL JWT Authentication viewer query.
 *
 * Silent refresh: if the auth token is expired but a valid refresh token exists,
 * the token is silently renewed and the viewer query is retried — no sign-in
 * prompt for the user.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated', user: null }, { status: 401 });
    }

    // Primary viewer fetch
    const { data, errors } = await fetchViewer(token);

    if (!errors?.length && data?.viewer) {
      return buildUserResponse(data.viewer);
    }

    // ── Silent refresh ──────────────────────────────────────────────────────
    // Token is expired or invalid. Try the refresh token before giving up.
    logger.debug('Auth token invalid — attempting silent refresh', { errors });

    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (refreshToken) {
      const refreshResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: REFRESH_TOKEN_MUTATION,
          variables: { token: refreshToken },
        }),
      });
      const {
        data: refreshData,
        errors: refreshErrors,
      }: { data: RefreshTokenResponse; errors?: unknown[] } = await refreshResponse.json();

      const newAuthToken = refreshData?.refreshJwtAuthToken?.authToken;
      if (!refreshErrors && newAuthToken) {
        // Persist the new auth token and retry
        cookieStore.set('auth_token', newAuthToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        const { data: retryData, errors: retryErrors } = await fetchViewer(newAuthToken);
        if (!retryErrors?.length && retryData?.viewer) {
          logger.debug('Silent token refresh succeeded');
          return buildUserResponse(retryData.viewer);
        }
        logger.debug('Silent refresh: viewer retry failed after token refresh', { retryErrors });
      } else {
        logger.debug('Silent token refresh failed', { refreshErrors });
      }
    }

    // Both tokens exhausted — clear cookies and require sign-in
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');
    return NextResponse.json({ error: 'Invalid token', user: null }, { status: 401 });
  } catch (error) {
    logger.error('Auth check error', { error });
    return NextResponse.json({ error: 'Server error', user: null }, { status: 500 });
  }
}
