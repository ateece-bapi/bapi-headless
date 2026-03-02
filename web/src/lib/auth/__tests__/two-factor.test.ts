/**
 * Two-Factor Authentication Service Tests
 * Validates TOTP generation and verification
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateTwoFactorSecret,
  verifyTwoFactorCode,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode,
  formatBackupCode,
  getCurrentTOTP,
  getTOTPTimeRemaining,
  validateTOTPSetup,
} from '../two-factor';

describe('Two-Factor Authentication Service', () => {
  describe('generateTwoFactorSecret', () => {
    it('generates a valid TOTP secret', async () => {
      const result = await generateTwoFactorSecret('testuser@example.com');

      expect(result.secret).toBeTruthy();
      expect(result.secret).toMatch(/^[A-Z2-7]+$/); // Base32 format
      expect(result.secret.length).toBeGreaterThanOrEqual(32); // 160 bits minimum
    });

    it('generates a valid otpauth URI', async () => {
      const result = await generateTwoFactorSecret('testuser@example.com');

      expect(result.uri).toContain('otpauth://totp/');
      expect(result.uri).toContain('BAPI');
      expect(result.uri).toContain('testuser%40example.com'); // @ is URL-encoded as %40
      expect(result.uri).toContain(`secret=${result.secret}`);
    });

    it('generates a QR code data URL', async () => {
      const result = await generateTwoFactorSecret('testuser@example.com');

      expect(result.qrCode).toContain('data:image/png;base64,');
      expect(result.qrCode.length).toBeGreaterThan(100); // QR codes are large
    });

    it('uses custom label when provided', async () => {
      const result = await generateTwoFactorSecret('testuser@example.com', 'Custom Label');

      expect(result.uri).toContain('Custom%20Label');
    });

    it('generates unique secrets each time', async () => {
      const result1 = await generateTwoFactorSecret('user1@example.com');
      const result2 = await generateTwoFactorSecret('user2@example.com');

      expect(result1.secret).not.toBe(result2.secret);
      expect(result1.qrCode).not.toBe(result2.qrCode);
    });
  });

  describe('verifyTwoFactorCode', () => {
    it('verifies a valid TOTP code', async () => {
      // Generate secret
      const { secret } = await generateTwoFactorSecret('testuser@example.com');

      // Get current TOTP
      const code = getCurrentTOTP(secret);

      // Verify it
      const isValid = verifyTwoFactorCode(secret, code);
      expect(isValid).toBe(true);
    });

    it('rejects an invalid TOTP code', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');
      const isValid = verifyTwoFactorCode(secret, '000000');

      expect(isValid).toBe(false);
    });

    it('rejects codes with wrong length', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');

      expect(verifyTwoFactorCode(secret, '123')).toBe(false); // Too short
      expect(verifyTwoFactorCode(secret, '1234567')).toBe(false); // Too long
    });

    it('rejects codes with invalid format', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');

      expect(verifyTwoFactorCode(secret, 'ABCDEF')).toBe(false); // Letters
      expect(verifyTwoFactorCode(secret, '12-34-56')).toBe(false); // Special chars
    });

    it('handles clock drift with window parameter', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');
      const code = getCurrentTOTP(secret);

      // Should work with default window (1)
      expect(verifyTwoFactorCode(secret, code, 1)).toBe(true);

      // Should work with larger window
      expect(verifyTwoFactorCode(secret, code, 2)).toBe(true);
    });

    it('returns false for invalid secret format', () => {
      const isValid = verifyTwoFactorCode('INVALID_SECRET', '123456');
      expect(isValid).toBe(false);
    });
  });

  describe('generateBackupCodes', () => {
    it('generates the correct number of codes', () => {
      const codes = generateBackupCodes(5);
      expect(codes).toHaveLength(5);
    });

    it('generates default 10 codes when no count specified', () => {
      const codes = generateBackupCodes();
      expect(codes).toHaveLength(10);
    });

    it('generates 8-character codes', () => {
      const codes = generateBackupCodes(5);

      codes.forEach((code) => {
        expect(code).toHaveLength(8);
      });
    });

    it('generates alphanumeric uppercase codes', () => {
      const codes = generateBackupCodes(5);

      codes.forEach((code) => {
        expect(code).toMatch(/^[A-Z2-9]+$/); // Uppercase letters and numbers only
      });
    });

    it('generates unique codes', () => {
      const codes = generateBackupCodes(10);
      const uniqueCodes = new Set(codes);

      expect(uniqueCodes.size).toBe(10); // All codes should be unique
    });

    it('does not include ambiguous characters', () => {
      // Characters that should be excluded: 0, O, 1, I
      const codes = generateBackupCodes(100); // Generate many to increase confidence

      codes.forEach((code) => {
        expect(code).not.toContain('0');
        expect(code).not.toContain('O');
        expect(code).not.toContain('1');
        expect(code).not.toContain('I');
      });
    });
  });

  describe('hashBackupCode', () => {
    it('hashes a backup code to hex string', async () => {
      const code = 'A3B7K9Q2';
      const hash = await hashBackupCode(code);

      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^[a-f0-9]+$/); // Hex format
      expect(hash.length).toBe(64); // SHA-256 = 32 bytes = 64 hex chars
    });

    it('produces consistent hashes for same code', async () => {
      const code = 'A3B7K9Q2';
      const hash1 = await hashBackupCode(code);
      const hash2 = await hashBackupCode(code);

      expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different codes', async () => {
      const hash1 = await hashBackupCode('A3B7K9Q2');
      const hash2 = await hashBackupCode('B4C8L0R3');

      expect(hash1).not.toBe(hash2);
    });

    it('normalizes codes to uppercase', async () => {
      const hashUpper = await hashBackupCode('A3B7K9Q2');
      const hashLower = await hashBackupCode('a3b7k9q2');
      const hashMixed = await hashBackupCode('A3b7K9q2');

      expect(hashUpper).toBe(hashLower);
      expect(hashUpper).toBe(hashMixed);
    });

    it('normalizes codes by trimming whitespace', async () => {
      const hash1 = await hashBackupCode('A3B7K9Q2');
      const hash2 = await hashBackupCode('  A3B7K9Q2  ');

      expect(hash1).toBe(hash2);
    });
  });

  describe('verifyBackupCode', () => {
    it('verifies a correct backup code', async () => {
      const code = 'A3B7K9Q2';
      const hash = await hashBackupCode(code);
      const isValid = await verifyBackupCode(code, hash);

      expect(isValid).toBe(true);
    });

    it('rejects an incorrect backup code', async () => {
      const correctCode = 'A3B7K9Q2';
      const wrongCode = 'B4C8L0R3';
      const hash = await hashBackupCode(correctCode);
      const isValid = await verifyBackupCode(wrongCode, hash);

      expect(isValid).toBe(false);
    });

    it('is case-insensitive', async () => {
      const code = 'A3B7K9Q2';
      const hash = await hashBackupCode(code);

      expect(await verifyBackupCode('a3b7k9q2', hash)).toBe(true);
      expect(await verifyBackupCode('A3b7K9q2', hash)).toBe(true);
    });

    it('ignores leading/trailing whitespace', async () => {
      const code = 'A3B7K9Q2';
      const hash = await hashBackupCode(code);

      expect(await verifyBackupCode('  A3B7K9Q2  ', hash)).toBe(true);
    });

    it('returns false for invalid hash format', async () => {
      const isValid = await verifyBackupCode('A3B7K9Q2', 'invalid-hash');
      expect(isValid).toBe(false);
    });
  });

  describe('formatBackupCode', () => {
    it('formats 8-character code with hyphen', () => {
      const formatted = formatBackupCode('A3B7K9Q2');
      expect(formatted).toBe('A3B7-K9Q2');
    });

    it('returns code unchanged if not 8 characters', () => {
      expect(formatBackupCode('ABC')).toBe('ABC');
      expect(formatBackupCode('ABCDEFGHI')).toBe('ABCDEFGHI');
    });
  });

  describe('getCurrentTOTP', () => {
    it('generates a 6-digit code', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');
      const code = getCurrentTOTP(secret);

      expect(code).toMatch(/^\d{6}$/);
    });

    it('generates valid codes that verify', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');
      const code = getCurrentTOTP(secret);
      const isValid = verifyTwoFactorCode(secret, code);

      expect(isValid).toBe(true);
    });
  });

  describe('getTOTPTimeRemaining', () => {
    it('returns a number between 0 and 30', () => {
      const remaining = getTOTPTimeRemaining();

      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(remaining).toBeLessThanOrEqual(30);
    });

    it('returns an integer', () => {
      const remaining = getTOTPTimeRemaining();
      expect(Number.isInteger(remaining)).toBe(true);
    });
  });

  describe('validateTOTPSetup', () => {
    it('validates a correct TOTP setup', async () => {
      const { secret } = await generateTwoFactorSecret('testuser@example.com');
      const isValid = validateTOTPSetup(secret);

      expect(isValid).toBe(true);
    });

    it('returns false for invalid secret', () => {
      const isValid = validateTOTPSetup('INVALID_SECRET');
      expect(isValid).toBe(false);
    });
  });

  describe('Integration: Complete 2FA flow', () => {
    it('simulates complete user setup and verification', async () => {
      // Step 1: Generate secret and QR code
      const { secret, qrCode } = await generateTwoFactorSecret('user@example.com');
      expect(secret).toBeTruthy();
      expect(qrCode).toContain('data:image/png;base64,');

      // Step 2: User scans QR code and enters first code
      const firstCode = getCurrentTOTP(secret);
      const isValidSetup = verifyTwoFactorCode(secret, firstCode);
      expect(isValidSetup).toBe(true);

      // Step 3: Generate backup codes
      const backupCodes = generateBackupCodes(10);
      expect(backupCodes).toHaveLength(10);

      // Step 4: Hash backup codes for storage
      const hashedBackupCodes = await Promise.all(
        backupCodes.map((code) => hashBackupCode(code))
      );
      expect(hashedBackupCodes).toHaveLength(10);

      // Step 5: Verify backup codes work
      const isBackupValid = await verifyBackupCode(backupCodes[0], hashedBackupCodes[0]);
      expect(isBackupValid).toBe(true);

      // Step 6: Verify same backup code hashes correctly across calls
      const isBackupValidAgain = await verifyBackupCode(
        backupCodes[0],
        hashedBackupCodes[0]
      );
      expect(isBackupValidAgain).toBe(true);
    });
  });
});
