/**
 * Rate Limiting Tests
 * Validates brute force attack prevention
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getRateLimitStatus,
  resetAllRateLimits,
  getRateLimitStats,
} from '../rate-limit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset all rate limits before each test
    resetAllRateLimits();
    // Reset timers
    vi.useRealTimers();
  });

  describe('checkRateLimit', () => {
    it('allows request on first attempt', () => {
      const result = checkRateLimit('testuser_192.168.1.1');
      
      expect(result.allowed).toBe(true);
      expect(result.attemptsLeft).toBe(5);
    });

    it('tracks attempts correctly', () => {
      const identifier = 'testuser_192.168.1.1';
      
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      
      const result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
      expect(result.attemptsLeft).toBe(3); // 5 - 2 = 3
    });

    it('blocks after max attempts', () => {
      const identifier = 'attacker_10.0.0.1';
      
      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      const result = checkRateLimit(identifier);
      expect(result.allowed).toBe(false);
      expect(result.message).toContain('locked for 15 minutes');
      expect(result.blockedUntil).toBeDefined();
    });

    it('returns minutes remaining when blocked', () => {
      const identifier = 'blocked_192.168.1.100';
      
      // Trigger lockout
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      const result = checkRateLimit(identifier);
      expect(result.message).toMatch(/locked for \d+ minutes?/);
    });

    it('allows request after lockout expires', () => {
      vi.useFakeTimers();
      const identifier = 'expired_192.168.1.50';
      
      // Trigger lockout
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      // Should be blocked
      let result = checkRateLimit(identifier);
      expect(result.allowed).toBe(false);
      
      // Fast-forward 16 minutes (past 15-minute lockout)
      vi.advanceTimersByTime(16 * 60 * 1000);
      
      // Should be allowed now
      result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
      
      vi.useRealTimers();
    });

    it('resets counter after window expires', () => {
      vi.useFakeTimers();
      const identifier = 'windowtest_192.168.1.75';
      
      // Record 3 failed attempts
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      
      // Should have 2 attempts left
      let result = checkRateLimit(identifier);
      expect(result.attemptsLeft).toBe(2);
      
      // Fast-forward 6 minutes (past 5-minute window)
      vi.advanceTimersByTime(6 * 60 * 1000);
      
      // Counter should reset
      result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
      expect(result.attemptsLeft).toBe(5);
      
      vi.useRealTimers();
    });
  });

  describe('recordFailedAttempt', () => {
    it('creates new record on first failure', () => {
      const identifier = 'newuser_192.168.1.200';
      
      recordFailedAttempt(identifier);
      
      const status = getRateLimitStatus(identifier);
      expect(status).not.toBeNull();
      expect(status?.count).toBe(1);
    });

    it('increments count on subsequent failures', () => {
      const identifier = 'repeatuser_192.168.1.201';
      
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      
      const status = getRateLimitStatus(identifier);
      expect(status?.count).toBe(3);
    });

    it('sets blockedUntil after max attempts', () => {
      const identifier = 'maxuser_192.168.1.202';
      
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      const status = getRateLimitStatus(identifier);
      expect(status?.blockedUntil).toBeDefined();
      expect(status?.blockedUntil).toBeGreaterThan(Date.now());
    });
  });

  describe('clearAttempts', () => {
    it('removes all attempts for identifier', () => {
      const identifier = 'clearuser_192.168.1.300';
      
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      
      let status = getRateLimitStatus(identifier);
      expect(status?.count).toBe(2);
      
      clearAttempts(identifier);
      
      status = getRateLimitStatus(identifier);
      expect(status).toBeNull();
    });

    it('allows fresh start after clearing', () => {
      const identifier = 'freshuser_192.168.1.301';
      
      // Build up failed attempts
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt(identifier);
      }
      
      // Clear and check
      clearAttempts(identifier);
      
      const result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
      expect(result.attemptsLeft).toBe(5);
    });
  });

  describe('getRateLimitStats', () => {
    it('returns correct statistics', () => {
      // Create some tracked users
      recordFailedAttempt('user1_192.168.1.1');
      recordFailedAttempt('user2_192.168.1.2');
      
      // Block one user
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt('blocked_192.168.1.3');
      }
      
      const stats = getRateLimitStats();
      
      expect(stats.totalTracked).toBe(3);
      expect(stats.currentlyBlocked).toBe(1);
      expect(stats.activeWindows).toBe(3);
    });

    it('returns zero stats when empty', () => {
      const stats = getRateLimitStats();
      
      expect(stats.totalTracked).toBe(0);
      expect(stats.currentlyBlocked).toBe(0);
      expect(stats.activeWindows).toBe(0);
    });
  });

  describe('Real-world scenarios', () => {
    it('handles multiple users independently', () => {
      const user1 = 'alice_192.168.1.10';
      const user2 = 'bob_192.168.1.11';
      
      // Alice fails 3 times
      recordFailedAttempt(user1);
      recordFailedAttempt(user1);
      recordFailedAttempt(user1);
      
      // Bob fails 5 times (gets blocked)
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(user2);
      }
      
      // Alice should still have attempts
      const aliceResult = checkRateLimit(user1);
      expect(aliceResult.allowed).toBe(true);
      expect(aliceResult.attemptsLeft).toBe(2);
      
      // Bob should be blocked
      const bobResult = checkRateLimit(user2);
      expect(bobResult.allowed).toBe(false);
    });

    it('handles same user from different IPs', () => {
      const user1IP1 = 'attacker_192.168.1.100';
      const user1IP2 = 'attacker_10.0.0.1';
      
      // Max out attempts from first IP
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(user1IP1);
      }
      
      // Should be blocked from first IP
      let result = checkRateLimit(user1IP1);
      expect(result.allowed).toBe(false);
      
      // Should still be allowed from second IP (fresh attempts)
      result = checkRateLimit(user1IP2);
      expect(result.allowed).toBe(true);
      expect(result.attemptsLeft).toBe(5);
    });

    it('simulates brute force attack prevention', () => {
      vi.useFakeTimers();
      const attacker = 'hacker_127.0.0.1';
      
      // Attempt brute force (10 attempts over 1 minute)
      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(attacker);
        
        if (i < 5) {
          expect(result.allowed).toBe(true);
          recordFailedAttempt(attacker);
        } else {
          // After 5 attempts, should be blocked
          expect(result.allowed).toBe(false);
        }
        
        // Simulate 6-second intervals
        vi.advanceTimersByTime(6000);
      }
      
      // Verify attacker is blocked
      const status = getRateLimitStatus(attacker);
      expect(status?.count).toBe(5);
      expect(status?.blockedUntil).toBeDefined();
      
      vi.useRealTimers();
    });
  });
});
