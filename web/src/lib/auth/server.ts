import { cookies } from 'next/headers';
import { cache } from 'react';
import { isAdmin } from './roles';
import logger from '@/lib/logger';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  roles?: string[];
}

/**
 * Server-side authentication helper with React cache
 * 
 * Validates JWT token from httpOnly cookie and returns user info via GraphQL.
 * Uses React cache() to deduplicate requests across Server Components.
 * 
 * This prevents multiple GraphQL calls when the same user check happens
 * multiple times in a single render (e.g., layout + page components).
 */
export const getServerAuth = cache(async (): Promise<{ userId: string | null; user: User | null }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { userId: null, user: null };
  }

  try {
    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
    
    // Use GraphQL viewer query to validate token and get user
    // Cached for 30 seconds to reduce WordPress load
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query GetCurrentUser {
            viewer {
              id
              databaseId
              email
              name
              username
              roles {
                nodes {
                  name
                }
              }
            }
          }
        `,
      }),
      next: {
        revalidate: 30, // Cache user data for 30 seconds
        tags: ['user-auth'],
      },
    });

    if (!response.ok) {
      return { userId: null, user: null };
    }

    const { data, errors } = await response.json();
    
    if (errors || !data?.viewer) {
      return { userId: null, user: null };
    }

    const viewer = data.viewer;
    
    // Extract role names from the GraphQL response
    const roles = viewer.roles?.nodes?.map((role: { name: string }) => role.name) || [];
    
    return {
      userId: String(viewer.databaseId),
      user: {
        id: String(viewer.databaseId),
        email: viewer.email || '',
        displayName: viewer.name || viewer.username || '',
        username: viewer.username || '',
        roles,
      },
    };
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Server auth error:', error);
    }
    return { userId: null, user: null };
  }
});

/**
 * Get current authenticated user (non-cached version for API routes)
 * Use this in API routes where you need fresh data
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query GetCurrentUser {
            viewer {
              id
              databaseId
              email
              name
              username
              roles {
                nodes {
                  name
                }
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const { data, errors } = await response.json();
    
    if (errors || !data?.viewer) {
      logger.debug('Token validation failed in getCurrentUser', { errors });
      return null;
    }

    const viewer = data.viewer;
    const roles = viewer.roles?.nodes?.map((role: { name: string }) => role.name) || [];

    return {
      id: String(viewer.databaseId),
      email: viewer.email || '',
      displayName: viewer.name || viewer.username || '',
      username: viewer.username || '',
      roles,
    };
  } catch (error) {
    logger.error('getCurrentUser error', { error });
    return null;
  }
}

/**
 * Verify that current user is an admin
 * Returns user if admin, throws error with 401/403 status if not
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  if (!isAdmin(user)) {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

/**
 * Verify that current user is authenticated
 * Returns user if authenticated, throws error with 401 status if not
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  return user;
}