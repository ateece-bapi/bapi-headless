/**
 * GraphQL Query Complexity Monitoring
 *
 * Reads the `X-GraphQL-Complexity` response header set by WPGraphQL Smart Cache
 * and alerts via Sentry when complexity exceeds 75% of the configured WordPress limit.
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

/** Alert when query complexity reaches or exceeds this absolute value (75% of the WordPress max of 2000) */
const COMPLEXITY_ALERT_THRESHOLD = 1500;

/**
 * Normalise the three valid `fetch` input types to a plain string URL for logging.
 *
 * Query params are stripped before logging/capturing to avoid leaking GraphQL
 * query text or user-supplied variables that graphql-request encodes into the
 * URL when using GET requests.
 */
function inputToUrl(input: Parameters<typeof fetch>[0]): string {
  let raw: string;
  if (typeof input === 'string') raw = input;
  else if (input instanceof URL) raw = input.toString();
  else raw = (input as Request).url;

  try {
    const parsed = new URL(raw);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    // Fallback for relative URLs or unparseable strings
    return raw.split('?')[0];
  }
}

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
        extra: { url: inputToUrl(input) },
      });
      throw error;
    }

    const rawComplexity = response.headers.get(COMPLEXITY_HEADER);
    if (rawComplexity !== null) {
      const complexity = parseInt(rawComplexity, 10);

      if (!isNaN(complexity)) {
        logger.info('GraphQL query complexity', { complexity });

        if (complexity >= COMPLEXITY_ALERT_THRESHOLD) {
          const url = inputToUrl(input);

          logger.warn('GraphQL complexity threshold exceeded', {
            complexity,
            threshold: COMPLEXITY_ALERT_THRESHOLD,
            url,
          });

          // Use a stable message so all high-complexity alerts group into a
          // single Sentry issue. Exact values go into `extra` for triage.
          Sentry.captureMessage('GraphQL complexity threshold exceeded', {
            level: 'warning',
            tags: { type: 'graphql_complexity' },
            extra: {
              complexity,
              threshold: COMPLEXITY_ALERT_THRESHOLD,
              url,
            },
          });
        }
      }
    }

    return response;
  };
}
