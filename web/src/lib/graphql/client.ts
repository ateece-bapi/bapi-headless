import { GraphQLClient } from 'graphql-request';
import { AppError } from '@/lib/errors';
import { CACHE_REVALIDATION } from '@/lib/constants/cache';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

function getEndpoint(): string {
  if (!endpoint) {
    throw new AppError(
      'NEXT_PUBLIC_WORDPRESS_GRAPHQL environment variable is not set',
      'The application is not configured correctly. Please contact support.',
      'GRAPHQL_CONFIG_ERROR',
      500
    );
  }
  return endpoint;
}

export const graphqlClient = new GraphQLClient(endpoint || 'https://placeholder.local/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * GraphQL client for server-side requests with caching
 * @param tags - Cache tags for on-demand revalidation
 */
export const getGraphQLClient = (tags?: string[]) => {
  return new GraphQLClient(getEndpoint(), {
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js 15+ caching
    next: {
      revalidate: CACHE_REVALIDATION.DEFAULT,
      tags: tags || ['graphql'], // Default tag if none provided
    },
  });
};

/**
 * GraphQL client for client-side requests
 */
export const clientGraphQLClient = new GraphQLClient(endpoint || 'https://placeholder.local/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});
