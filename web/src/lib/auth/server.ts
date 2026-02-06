import { cookies } from 'next/headers';
import { cache } from 'react';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
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

  console.log('[getServerAuth] Token:', token ? 'EXISTS' : 'MISSING');

  if (!token) {
    return { userId: null, user: null };
  }

  try {
    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
    
    console.log('[getServerAuth] Calling WordPress GraphQL...');
    
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
            }
          }
        `,
      }),
      next: {
        revalidate: 30, // Cache user data for 30 seconds
        tags: ['user-auth'],
      },
      cache: 'no-store', // DISABLE CACHE FOR DEBUGGING
    });

    console.log('[getServerAuth] Response status:', response.status);

    if (!response.ok) {
      console.error('[getServerAuth] WordPress returned error:', response.status);
      return { userId: null, user: null };
    }

    const { data, errors } = await response.json();
    
    console.log('[getServerAuth] GraphQL response:', { 
      hasData: !!data, 
      hasViewer: !!data?.viewer,
      hasErrors: !!errors,
      errors 
    });
    
    if (errors || !data?.viewer) {
      console.error('[getServerAuth] GraphQL errors or no viewer:', errors);
      return { userId: null, user: null };
    }

    const viewer = data.viewer;
    
    return {
      userId: String(viewer.databaseId),
      user: {
        id: String(viewer.databaseId),
        email: viewer.email || '',
        displayName: viewer.name || viewer.username || '',
        username: viewer.username || '',
      },
    };
  } catch (error) {
    console.error('Server auth error:', error);
    return { userId: null, user: null };
  }
});
