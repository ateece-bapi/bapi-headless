/**
 * Simple in-memory rate limiter using sliding window
 * For production multi-instance deployments, consider Redis-backed solution
 */

import { RATE_LIMITS } from '@/lib/constants/rate-limits';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const limitMap = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limitMap.entries()) {
    if (now > entry.resetTime) {
      limitMap.delete(key);
    }
  }
}, RATE_LIMITS.CLEANUP_INTERVAL_MS);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds (default: 60000 = 1 minute) */
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if the request is within rate limits
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Result object with rate limit status
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowMs = RATE_LIMITS.DEFAULT_WINDOW_MS } = config;
  const now = Date.now();
  const key = `${identifier}:${config.limit}:${config.windowMs}`;

  let entry = limitMap.get(key);

  // Create new entry or reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    limitMap.set(key, entry);
  }

  // Increment count
  entry.count++;

  const success = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);
  const reset = Math.ceil(entry.resetTime / 1000);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}

/**
 * Get IP address from Next.js request
 * Checks x-forwarded-for header (common in proxies/CDNs) first
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a generic identifier if no IP is available
  return 'unknown';
}
