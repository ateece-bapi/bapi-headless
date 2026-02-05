import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
}

/**
 * Server-side authentication helper
 * 
 * Replaces Clerk's auth() and currentUser() functions.
 * Validates JWT token from httpOnly cookie and returns user info via GraphQL.
 */
export async function getServerAuth(): Promise<{ userId: string | null; user: User | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { userId: null, user: null };
  }

  try {
    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
    
    // Use GraphQL viewer query to validate token and get user
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
}
