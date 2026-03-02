/**
 * Rate Limiting for Authentication
 *   * Prevents brute force attacks (response to November 2025 incident)
 * - In-memory storage for development/staging
 * - Redis recommended for production (multiple Next.js instances)
 * - Tracks failed login attempts by IP + username
 * - 5 attempts = 15-minute lockout
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

export interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  attemptsLeft?: number;
  message?: string;
  blockedUntil?: number;
}

// Configuration
const config: RateLimitConfig = {
  maxAttempts: 5, // Lock after 5 failed attempts
  windowMs: 5 * 60 * 1000, // 5-minute window
  blockDurationMs: 15 * 60 * 1000, // 15-minute lockout
};

// In-memory storage (use Redis in production)
// Key: `${username}_${ip}`, Value: RateLimitRecord
const attemptStore = new Map<string, RateLimitRecord>();

/**
 * Check if request is allowed based on rate limiting
 * @param identifier - Unique identifier (e.g., `username_ip`)
 * @returns RateLimitResult with allowed status and metadata
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = attemptStore.get(identifier);

  // Check if currently blocked
  if (record?.blockedUntil && now < record.blockedUntil) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Too many failed login attempts. Account locked for ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}. Please try again later.`,
      blockedUntil: record.blockedUntil,
    };
  }

  // Check if attempt window has expired (reset counter)
  if (record && now - record.firstAttempt > config.windowMs) {
    attemptStore.delete(identifier);
    return {
      allowed: true,
      attemptsLeft: config.maxAttempts,
    };
  }

  // Check if max attempts reached (trigger block)
  if (record && record.count >= config.maxAttempts) {
    const blockedUntil = now + config.blockDurationMs;
    record.blockedUntil = blockedUntil;
    attemptStore.set(identifier, record);

    const minutesLocked = Math.ceil(config.blockDurationMs / 60000);
    return {
      allowed: false,
      message: `Too many failed login attempts. Account locked for ${minutesLocked} minutes.`,
      blockedUntil,
    };
  }

  // Calculate remaining attempts
  const attemptsLeft = config.maxAttempts - (record?.count || 0);

  return {
    allowed: true,
    attemptsLeft,
  };
}

/**
 * Record a failed login attempt
 * @param identifier - Unique identifier (e.g., `username_ip`)
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = attemptStore.get(identifier);

  if (!record || now - record.firstAttempt > config.windowMs) {
    // Start new window
    attemptStore.set(identifier, {
      count: 1,
      firstAttempt: now,
    });
  } else {
    // Increment count in current window
    record.count++;
    attemptStore.set(identifier, record);

    // Trigger block if threshold reached
    if (record.count >= config.maxAttempts) {
      record.blockedUntil = now + config.blockDurationMs;
      attemptStore.set(identifier, record);
    }
  }
}

/**
 * Clear all attempts for identifier (on successful login)
 * @param identifier - Unique identifier (e.g., `username_ip`)
 */
export function clearAttempts(identifier: string): void {
  attemptStore.delete(identifier);
}

/**
 * Get current rate limit status for identifier
 * @param identifier - Unique identifier (e.g., `username_ip`)
 * @returns Current record or null
 */
export function getRateLimitStatus(identifier: string): RateLimitRecord | null {
  return attemptStore.get(identifier) || null;
}

/**
 * Reset all rate limiting data (use with caution, testing only)
 */
export function resetAllRateLimits(): void {
  attemptStore.clear();
}

/**
 * Get rate limiting statistics
 * @returns Object with current stats
 */
export function getRateLimitStats(): {
  totalTracked: number;
  currentlyBlocked: number;
  activeWindows: number;
} {
  const now = Date.now();
  let currentlyBlocked = 0;
  let activeWindows = 0;

  for (const record of attemptStore.values()) {
    if (record.blockedUntil && now < record.blockedUntil) {
      currentlyBlocked++;
    }
    if (now - record.firstAttempt <= config.windowMs) {
      activeWindows++;
    }
  }

  return {
    totalTracked: attemptStore.size,
    currentlyBlocked,
    activeWindows,
  };
}
