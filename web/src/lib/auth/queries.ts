/**
 * Centralized GraphQL queries/mutations for WordPress JWT Authentication
 *
 * NOTE: These are raw GraphQL strings instead of .graphql files because
 * the schema.json doesn't include WPGraphQL JWT Authentication plugin types.
 * Once the schema is updated (via WordPress introspection with JWT plugin enabled),
 * these should be moved to auth.graphql and generated via codegen.
 *
 * TODO (Post-Launch): Migrate to codegen pipeline
 * ===================================================
 * 1. Run GraphQL introspection against WordPress with JWT Auth plugin enabled
 *    - Verify WPGraphQL JWT Authentication plugin is installed
 *    - Run: npm run download-schema (or similar script)
 * 2. Create auth.graphql with these queries/mutations
 * 3. Run: npm run codegen to generate TypeScript types
 * 4. Update all imports to use generated types from generated.ts
 * 5. Remove manual type definitions (LoginResponse, GetCurrentUserResponse, etc.)
 * 6. Test all auth flows thoroughly (login, logout, refresh, protected routes)
 *
 * Severity: Low (tech debt, not a bug)
 * Tracks: Consistency with product queries which use codegen pipeline
 */

/**
 * Login mutation - authenticates user with WordPress
 * Returns: authToken (7 days), refreshToken (30 days), user data
 */
export const LOGIN_MUTATION = `
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
`;

/**
 * GetCurrentUser query - validates JWT token and returns user data
 * Used in: /api/auth/me, lib/auth/server.ts
 */
export const GET_CURRENT_USER_QUERY = `
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
`;

/**
 * RefreshToken mutation - refreshes expired authToken using refreshToken
 * Returns: new authToken (7 days)
 */
export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $token }) {
      authToken
    }
  }
`;

// Type definitions for responses (manual until codegen supports JWT Auth)
export interface LoginResponse {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      id: string;
      databaseId: number;
      email: string;
      name: string;
      username: string;
    };
  };
}

export interface GetCurrentUserResponse {
  viewer: {
    id: string;
    databaseId: number;
    email: string;
    name: string;
    username: string;
    roles: {
      nodes: Array<{
        name: string;
      }>;
    };
  };
}

export interface RefreshTokenResponse {
  refreshJwtAuthToken: {
    authToken: string;
  };
}
