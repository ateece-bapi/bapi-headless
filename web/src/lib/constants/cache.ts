/**
 * Cache revalidation time constants for Next.js caching
 *
 * Values are in seconds (Next.js revalidate format).
 * Tune these based on content freshness requirements vs API load.
 */

export const CACHE_REVALIDATION = {
  /**
   * Products catalog listing
   * Revalidate: 1 hour (3600 seconds)
   */
  PRODUCTS: 3600,

  /**
   * Product categories
   * Revalidate: 2 hours (7200 seconds)
   * Categories change less frequently than products
   */
  CATEGORIES: 7200,

  /**
   * Individual product detail pages
   * Revalidate: 1 hour (3600 seconds)
   */
  PRODUCT_DETAIL: 3600,

  /**
   * Default GraphQL cache
   * Revalidate: 1 hour (3600 seconds)
   */
  DEFAULT: 3600,
} as const;

/**
 * Helper to convert seconds to human-readable duration
 */
export function formatCacheDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
