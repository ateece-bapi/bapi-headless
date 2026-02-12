/**
 * Rate limiting configuration constants
 *
 * Defines request limits and time windows for API endpoints.
 * Adjust based on expected traffic patterns and abuse prevention needs.
 */

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Rate limit configurations per API endpoint
 */
export const RATE_LIMITS = {
  /**
   * Preview API (content preview mode)
   * 10 requests per minute per IP
   * Higher limit for editors who frequently preview changes
   */
  PREVIEW_API: {
    limit: 10,
    windowMs: 60000, // 1 minute
  } as RateLimitConfig,

  /**
   * Revalidate API (cache invalidation)
   * 5 requests per minute per IP
   * Lower limit since this triggers expensive cache rebuilds
   */
  REVALIDATE_API: {
    limit: 5,
    windowMs: 60000, // 1 minute
  } as RateLimitConfig,

  /**
   * Default time window
   * 1 minute (60000 milliseconds)
   */
  DEFAULT_WINDOW_MS: 60000,

  /**
   * Cleanup interval for expired rate limit entries
   * 5 minutes (300000 milliseconds)
   * Runs in background to prevent memory leaks
   */
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000,
} as const;

/**
 * Convert milliseconds to human-readable duration
 */
export function formatRateLimitWindow(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0 && seconds > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}
