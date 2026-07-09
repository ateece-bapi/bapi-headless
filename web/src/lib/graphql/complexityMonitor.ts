/**
 * GraphQL Query Complexity Monitoring
 *
 * Reads the `X-GraphQL-Complexity` response header set by WPGraphQL Smart Cache
 * and alerts via Sentry when complexity exceeds 80% of the configured WordPress limit.
 *
 * WordPress limits (set in WPGraphQL settings):
 *   - Max depth: 20
 *   - Max complexity: 2000
 *
 * Alert threshold: 1500 (75% of 2000 — conservative to catch creeping complexity)
 *
 * @module lib/graphql/complexityMonitor
 */

import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

const COMPLEXITY_HEADER = 'x-graphql-complexity';

/** Alert when query complexity reaches this fraction of the WordPress max (2000) */
const COMPLEXITY_ALERT_THRESHOLD = 1500;

/**
 * Creates a fetch wrapper that reads `X-GraphQL-Complexity` from every GraphQL
 * response and fires Sentry alerts when the threshold is exceeded.
 *
 * Pass the returned function as the `fetch` option on `GraphQLClient`:
 *
 * ```ts
 * new GraphQLClient(endpoint, { fetch: createComplexityAwareFetch() })
 * ```
 *
 * The wrapper is transparent: it forwards all arguments (including Next.js
 * extended `{ next: { revalidate, tags } }` options) to the native fetch and
 * returns the original `Response` unchanged.
 */
export function createComplexityAwareFetch(): typeof fetch {
  return async function complexityAwareFetch(
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ): Promise<Response> {
    let response: Response;

    try {
      response = await fetch(input, init);
    } catch (error) {
      // Network-level failure — could be a timeout or DNS issue.
      Sentry.captureException(error, {
        tags: { type: 'graphql_network_error' },
        extra: {
          url: typeof input === 'string' ? input : (input as Request).url,
        },
      });
      throw error;
    }

    const rawComplexity = response.headers.get(COMPLEXITY_HEADER);
    if (rawComplexity !== null) {
      const complexity = parseInt(rawComplexity, 10);

      if (!isNaN(complexity)) {
        logger.info('GraphQL query complexity', { complexity });

        if (complexity >= COMPLEXITY_ALERT_THRESHOLD) {
          const url =
            typeof input === 'string' ? input : (input as Request).url;

          logger.warn('GraphQL complexity threshold exceeded', {
            complexity,
            threshold: COMPLEXITY_ALERT_THRESHOLD,
            url,
          });

          Sentry.captureMessage(
            `GraphQL complexity alert: ${complexity} (threshold: ${COMPLEXITY_ALERT_THRESHOLD})`,
            {
              level: 'warning',
              tags: { type: 'graphql_complexity' },
              extra: {
                complexity,
                threshold: COMPLEXITY_ALERT_THRESHOLD,
                url,
              },
            }
          );
        }
      }
    }

    return response;
  };
}
