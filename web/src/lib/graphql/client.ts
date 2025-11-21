import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_WORDPRESS_GRAPHQL environment variable is not set');
}

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * GraphQL client for server-side requests with caching
 */
export const getGraphQLClient = () => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js 15+ caching
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });
};

/**
 * GraphQL client for client-side requests
 */
export const clientGraphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});
