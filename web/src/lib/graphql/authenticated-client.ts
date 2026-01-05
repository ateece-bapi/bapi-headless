import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
const wpUser = process.env.WORDPRESS_API_USER || '';
const wpPassword = process.env.WORDPRESS_API_PASSWORD || '';

/**
 * Authenticated GraphQL client for customer data queries
 * Uses WordPress application password for authentication
 */
export const authenticatedGraphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
    ...(wpUser && wpPassword
      ? {
          Authorization: `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`,
        }
      : {}),
  },
});
