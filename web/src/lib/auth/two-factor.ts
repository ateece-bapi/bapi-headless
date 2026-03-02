/**
 * Two-Factor Authentication Service
 * 
 * Provides TOTP (Time-based One-Time Password) functionality:
 * - Generate TOTP secrets and QR codes
 * - Verify 6-digit authentication codes
 * - Generate and hash backup codes
 * 
 * Standard: RFC 6238 (TOTP)
 * Algorithm: SHA-1 (most compatible with authenticator apps)
 * Digits: 6
 * Period: 30 seconds
 */

import { TOTP, Secret } from 'otpauth';
import QRCode from 'qrcode';

/**
 * TOTP Configuration
 */
const TOTP_CONFIG = {
  issuer: 'BAPI',
  algorithm: 'SHA1' as const,
  digits: 6,
  period: 30, // seconds
};

/**
 * Generate a new TOTP secret and QR code for user setup
 * 
 * @param username - User's username or email
 * @param label - Optional custom label (defaults to username)
 * @returns Object with secret (base32), uri, and qrCode (data URL)
 */
export async function generateTwoFactorSecret(
  username: string,
  label?: string
): Promise<{
  secret: string;
  uri: string;
  qrCode: string;
}> {
  // Generate random secret
  const secret = new Secret({ size: 20 }); // 160 bits = 32 base32 chars

  // Create TOTP instance
  const totp = new TOTP({
    issuer: TOTP_CONFIG.issuer,
    label: label || username,
    algorithm: TOTP_CONFIG.algorithm,
    digits: TOTP_CONFIG.digits,
    period: TOTP_CONFIG.period,
    secret,
  });

  // Get otpauth:// URI for QR code
  const uri = totp.toString();

  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(uri, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 1,
  });

  return {
    secret: secret.base32,
    uri,
    qrCode,
  };
}

/**
 * Verify a TOTP code against a secret
 * 
 * @param secret - The TOTP secret (base32 encoded)
 * @param token - The 6-digit code from authenticator app
 * @param window - Number of periods before/after to check (clock drift tolerance)
 * @returns true if valid, false otherwise
 */
export function verifyTwoFactorCode(
  secret: string,
  token: string,
  window: number = 1
): boolean {
  try {
    // Create TOTP instance from stored secret
    const totp = new TOTP({
      issuer: TOTP_CONFIG.issuer,
      algorithm: TOTP_CONFIG.algorithm,
      digits: TOTP_CONFIG.digits,
      period: TOTP_CONFIG.period,
      secret: Secret.fromBase32(secret),
    });

    // Validate token (returns delta or null)
    // delta = number of periods difference from current time
    // window = how many periods before/after to check
    const delta = totp.validate({
      token,
      window,
    });

    // Valid if delta is not null (within tolerance window)
    return delta !== null;
  } catch (error) {
    // Invalid secret format or other error
    return false;
  }
}

/**
 * Generate backup recovery codes
 * 
 * Format: 8 characters, alphanumeric uppercase
 * Example: A3B7K9Q2
 * 
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes (unhashed, display to user once)
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous: 0,O,1,I

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    codes.push(code);
  }

  return codes;
}

/**
 * Hash a backup code for secure storage
 * 
 * Uses browser-compatible hashing (SubtleCrypto API)
 * Note: In Node.js, crypto.subtle is available in Node 15+
 * 
 * @param code - The plain backup code
 * @returns Promise<string> Hex-encoded hash
 */
export async function hashBackupCode(code: string): Promise<string> {
  // Normalize code (uppercase, trim)
  const normalized = code.trim().toUpperCase();

  // Use SubtleCrypto for hashing (works in Node.js 15+ and browsers)
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Verify a backup code against its hash
 * 
 * @param code - The backup code entered by user
 * @param hash - The stored hash
 * @returns Promise<boolean> true if valid
 */
export async function verifyBackupCode(code: string, hash: string): Promise<boolean> {
  try {
    const codeHash = await hashBackupCode(code);
    return codeHash === hash;
  } catch (error) {
    return false;
  }
}

/**
 * Format backup code for display (adds hyphen for readability)
 * 
 * @param code - 8-character backup code
 * @returns Formatted code (e.g., A3B7-K9Q2)
 */
export function formatBackupCode(code: string): string {
  if (code.length === 8) {
    return `${code.slice(0, 4)}-${code.slice(4)}`;
  }
  return code;
}

/**
 * Get current TOTP for testing/debugging purposes
 * DO NOT expose this to production frontend
 * 
 * @param secret - The TOTP secret (base32 encoded)
 * @returns Current 6-digit TOTP code
 */
export function getCurrentTOTP(secret: string): string {
  const totp = new TOTP({
    issuer: TOTP_CONFIG.issuer,
    algorithm: TOTP_CONFIG.algorithm,
    digits: TOTP_CONFIG.digits,
    period: TOTP_CONFIG.period,
    secret: Secret.fromBase32(secret),
  });

  return totp.generate();
}

/**
 * Get time remaining until current TOTP expires
 * Useful for showing countdown timer in UI
 * 
 * @returns Seconds remaining in current period
 */
export function getTOTPTimeRemaining(): number {
  const now = Date.now() / 1000; // Convert to seconds
  const period = TOTP_CONFIG.period;
  const elapsed = now % period;
  const remaining = period - elapsed;

  return Math.floor(remaining);
}

/**
 * Validate TOTP setup by generating a code and verifying it
 * Used in tests to ensure TOTP implementation is working correctly
 * 
 * @param secret - The TOTP secret (base32 encoded)
 * @returns true if generated code verifies successfully
 */
export function validateTOTPSetup(secret: string): boolean {
  try {
    const code = getCurrentTOTP(secret);
    return verifyTwoFactorCode(secret, code);
  } catch {
    return false;
  }
}
