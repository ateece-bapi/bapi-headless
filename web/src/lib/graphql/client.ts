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
 * GraphQL client for server-side requests with caching and GET method support
 * 
 * Performance optimizations:
 * - Uses GET requests for read queries (CDN cacheable)
 * - Adds cache-control headers for WordPress Smart Cache
 * - Next.js 15+ caching with ISR
 * 
 * @param tags - Cache tags for on-demand revalidation
 * @param useGetMethod - Use GET instead of POST for CDN caching (default: true for read queries)
 * @param customHeaders - Additional headers (e.g., WooCommerce session token)
 */
export const getGraphQLClient = (
  tags?: string[], 
  useGetMethod: boolean = true,
  customHeaders?: Record<string, string>
) => {
  return new GraphQLClient(getEndpoint(), {
    headers: {
      'Content-Type': 'application/json',
      // Cache-control header for WordPress caching plugins
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      // Spread custom headers (e.g., woocommerce-session)
      ...customHeaders,
    },
    // Use GET method for read queries to enable CDN caching
    // GET requests can be cached by Kinsta CDN, POST cannot
    method: useGetMethod ? 'GET' : 'POST',
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
