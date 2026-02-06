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
