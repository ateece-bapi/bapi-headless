/**
 * Integration tests for 2FA API routes
 * 
 * Tests the complete 2FA flow:
 * 1. Setup (generate QR code and backup codes)
 * 2. Verify setup (enable 2FA with first code)
 * 3. Login with 2FA (verify during authentication)
 * 4. Use backup code
 * 5. Disable 2FA
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST as setupPOST } from '../setup/route';
import { POST as verifySetupPOST } from '../verify-setup/route';
import { POST as verifyLoginPOST } from '../verify-login/route';
import { POST as disablePOST } from '../disable/route';
import { POST as loginPOST } from '../../login/route';
import { getCurrentTOTP } from '@/lib/auth/two-factor';
import type { NextRequest } from 'next/server';

/**
 * Mock fetch for WordPress GraphQL calls
 */
const createMockFetch = () => {
  const mockData: Record<string, any> = {
    secret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['ABCD1234', 'EFGH5678'],
    twoFactorEnabled: false,
  };

  return vi.fn((url: string, options?: RequestInit) => {
    const body = JSON.parse(options?.body as string || '{}');
    const query = body.query as string;

    // Login mutation
    if (query.includes('mutation Login')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              login: {
                authToken: 'mock-auth-token',
                refreshToken: 'mock-refresh-token',
                user: {
                  id: 'user-1',
                  databaseId: 1,
                  email: 'test@example.com',
                  name: 'Test User',
                  username: 'testuser',
                  twoFactorEnabled: mockData.twoFactorEnabled,
                },
              },
            },
          }),
      });
    }

    // Get current user (viewer query)
    if (query.includes('query GetCurrentUser') || query.includes('viewer')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              viewer: {
                id: 'user-1',
                databaseId: 1,
                email: 'test@example.com',
                name: 'Test User',
                username: 'testuser',
                twoFactorEnabled: mockData.twoFactorEnabled,
                twoFactorSecret: mockData.secret,
                roles: { nodes: [{ name: 'customer' }] },
              },
            },
          }),
      });
    }

    // Get user 2FA data
    if (query.includes('query GetUserTwoFactor')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              user: {
                id: 'user-1',
                twoFactorSecret: mockData.secret,
                twoFactorEnabled: mockData.twoFactorEnabled,
              },
            },
          }),
      });
    }

    // Update 2FA secret
    if (query.includes('mutation UpdateTwoFactorSecret')) {
      mockData.secret = body.variables.secret;
      mockData.backupCodes = body.variables.backupCodes;
      mockData.twoFactorEnabled = body.variables.enabled;
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              updateTwoFactorSecret: {
                success: true,
                message: '2FA secret updated',
              },
            },
          }),
      });
    }

    // Use backup code
    if (query.includes('mutation UseTwoFactorBackupCode')) {
      const isValidCode = mockData.backupCodes.includes(body.variables.code);
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              useTwoFactorBackupCode: {
                valid: isValidCode,
                message: isValidCode ? 'Code accepted' : 'Invalid code',
              },
            },
          }),
      });
    }

    // Disable 2FA
    if (query.includes('mutation DisableTwoFactor')) {
      mockData.twoFactorEnabled = false;
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              disableTwoFactor: {
                success: true,
                message: '2FA disabled',
              },
            },
          }),
      });
    }

    // Password verification (for disable)
    if (query.includes('mutation VerifyPassword')) {
      const validPassword = body.variables.password === 'correct-password';
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: validPassword ? { login: { authToken: 'temp-token' } } : null,
            errors: validPassword ? null : [{ message: 'Invalid password' }],
          }),
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({ errors: [{ message: 'Unknown query' }] }),
    });
  });
};

/**
 * Create mock NextRequest
 */
const createMockRequest = (body: any, cookies: Record<string, string> = {}): NextRequest => {
  const mockCookies = {
    get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined),
  };

  return {
    json: () => Promise.resolve(body),
    cookies: mockCookies,
    headers: new Headers({
      'x-forwarded-for': '127.0.0.1',
    }),
  } as unknown as NextRequest;
};

describe('2FA API Routes - Integration Tests', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = createMockFetch() as any;

    // Mock getCurrentUser to return authenticated user
    vi.mock('@/lib/auth/server', () => ({
      getCurrentUser: vi.fn(() =>
        Promise.resolve({
          id: '1',
          email: 'test@example.com',
          displayName: 'Test User',
          username: 'testuser',
        })
      ),
    }));

    // Mock cookies() from next/headers
    vi.mock('next/headers', () => ({
      cookies: vi.fn(() => ({
        set: vi.fn(),
        get: vi.fn((name: string) =>
          name === 'auth_token' ? { value: 'mock-auth-token' } : undefined
        ),
      })),
    }));
  });

  describe('POST /api/auth/2fa/setup', () => {
    it('generates QR code and backup codes for authenticated user', async () => {
      const request = createMockRequest({}, { auth_token: 'mock-auth-token' });
      const response = await setupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('qrCode');
      expect(data).toHaveProperty('secret');
      expect(data).toHaveProperty('uri');
      expect(data).toHaveProperty('backupCodes');
      expect(data.backupCodes).toHaveLength(10);
      expect(data.qrCode).toMatch(/^data:image\/png;base64,/);
      expect(data.uri).toMatch(/^otpauth:\/\/totp\//);
    });

    it('returns 401 if user is not authenticated', async () => {
      // Mock getCurrentUser to return null
      vi.mocked(await import('@/lib/auth/server')).getCurrentUser = vi.fn(() =>
        Promise.resolve(null)
      );

      const request = createMockRequest({});
      const response = await setupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });
  });

  describe('POST /api/auth/2fa/verify-setup', () => {
    it('enables 2FA when valid code is provided', async () => {
      // First, setup 2FA to get a secret
      const setupRequest = createMockRequest({}, { auth_token: 'mock-auth-token' });
      const setupResponse = await setupPOST(setupRequest);
      const setupData = await setupResponse.json();
      const { secret } = setupData;

      // Generate valid TOTP code
      const validCode = getCurrentTOTP(secret);

      // Verify setup with valid code
      const verifyRequest = createMockRequest(
        { code: validCode },
        { auth_token: 'mock-auth-token' }
      );
      const verifyResponse = await verifySetupPOST(verifyRequest);
      const verifyData = await verifyResponse.json();

      expect(verifyResponse.status).toBe(200);
      expect(verifyData.success).toBe(true);
    });

    it('rejects invalid code format', async () => {
      const request = createMockRequest(
        { code: '123' }, // Too short
        { auth_token: 'mock-auth-token' }
      );
      const response = await verifySetupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid code format');
    });

    it('rejects incorrect TOTP code', async () => {
      const request = createMockRequest(
        { code: '000000' }, // Wrong code
        { auth_token: 'mock-auth-token' }
      );
      const response = await verifySetupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Invalid|verification failed/i);
    });
  });

  describe('POST /api/auth/login (with 2FA)', () => {
    it('returns requires2FA=true and tempToken for 2FA-enabled user', async () => {
      // Enable 2FA in mock
      const mockFetch = createMockFetch();
      global.fetch = mockFetch as any;

      // Set 2FA enabled
      (mockFetch as any).mockData = { twoFactorEnabled: true };

      const request = createMockRequest({
        username: 'testuser',
        password: 'correct-password',
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.requires2FA).toBe(true);
      expect(data).toHaveProperty('tempToken');
      expect(data.tempToken).toBeTruthy();
    });

    it('completes login normally for non-2FA user', async () => {
      const request = createMockRequest({
        username: 'testuser',
        password: 'correct-password',
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/auth/2fa/verify-login', () => {
    it('completes login with valid TOTP code', async () => {
      // Generate temp token
      const tempToken = Buffer.from(
        JSON.stringify({
          userId: '1',
          username: 'testuser',
          authToken: 'mock-auth-token',
          refreshToken: 'mock-refresh-token',
          exp: Date.now() + 5 * 60 * 1000,
        })
      ).toString('base64');

      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = getCurrentTOTP(secret);

      const request = createMockRequest({
        tempToken,
        code: validCode,
        useBackupCode: false,
      });

      const response = await verifyLoginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('completes login with valid backup code', async () => {
      const tempToken = Buffer.from(
        JSON.stringify({
          userId: '1',
          username: 'testuser',
          authToken: 'mock-auth-token',
          refreshToken: 'mock-refresh-token',
          exp: Date.now() + 5 * 60 * 1000,
        })
      ).toString('base64');

      const request = createMockRequest({
        tempToken,
        code: 'ABCD1234', // Valid backup code from mock
        useBackupCode: true,
      });

      const response = await verifyLoginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('rejects expired temp token', async () => {
      const expiredToken = Buffer.from(
        JSON.stringify({
          userId: '1',
          username: 'testuser',
          authToken: 'mock-auth-token',
          refreshToken: 'mock-refresh-token',
          exp: Date.now() - 1000, // Expired
        })
      ).toString('base64');

      const request = createMockRequest({
        tempToken: expiredToken,
        code: '123456',
      });

      const response = await verifyLoginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('rejects invalid TOTP code', async () => {
      const tempToken = Buffer.from(
        JSON.stringify({
          userId: '1',
          username: 'testuser',
          authToken: 'mock-auth-token',
          refreshToken: 'mock-refresh-token',
          exp: Date.now() + 5 * 60 * 1000,
        })
      ).toString('base64');

      const request = createMockRequest({
        tempToken,
        code: '000000', // Invalid code
        useBackupCode: false,
      });

      const response = await verifyLoginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid code');
    });
  });

  describe('POST /api/auth/2fa/disable', () => {
    it('disables 2FA with valid password and code', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = getCurrentTOTP(secret);

      const request = createMockRequest(
        {
          password: 'correct-password',
          code: validCode,
        },
        { auth_token: 'mock-auth-token' }
      );

      const response = await disablePOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('rejects invalid password', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = getCurrentTOTP(secret);

      const request = createMockRequest(
        {
          password: 'wrong-password',
          code: validCode,
        },
        { auth_token: 'mock-auth-token' }
      );

      const response = await disablePOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid password');
    });

    it('rejects invalid TOTP code', async () => {
      const request = createMockRequest(
        {
          password: 'correct-password',
          code: '000000', // Invalid
        },
        { auth_token: 'mock-auth-token' }
      );

      const response = await disablePOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid code');
    });

    it('requires authentication', async () => {
      const request = createMockRequest({
        password: 'correct-password',
        code: '123456',
      }); // No auth cookie

      const response = await disablePOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });
  });

  describe('Complete 2FA Flow', () => {
    it('completes full setup → login → disable flow', async () => {
      // 1. Setup
      const setupRequest = createMockRequest({}, { auth_token: 'mock-auth-token' });
      const setupResponse = await setupPOST(setupRequest);
      const setupData = await setupResponse.json();

      expect(setupResponse.status).toBe(200);
      expect(setupData.success).toBe(true);

      const { secret, backupCodes } = setupData;

      // 2. Verify setup
      const verifyCode = getCurrentTOTP(secret);
      const verifySetupRequest = createMockRequest(
        { code: verifyCode },
        { auth_token: 'mock-auth-token' }
      );
      const verifySetupResponse = await verifySetupPOST(verifySetupRequest);
      const verifySetupData = await verifySetupResponse.json();

      expect(verifySetupResponse.status).toBe(200);
      expect(verifySetupData.success).toBe(true);

      // 3. Login (should require 2FA)
      const mockFetch = createMockFetch();
      global.fetch = mockFetch as any;
      (mockFetch as any).mockData = { twoFactorEnabled: true, secret };

      const loginRequest = createMockRequest({
        username: 'testuser',
        password: 'correct-password',
      });
      const loginResponse = await loginPOST(loginRequest);
      const loginData = await loginResponse.json();

      expect(loginResponse.status).toBe(200);
      expect(loginData.requires2FA).toBe(true);
      expect(loginData.tempToken).toBeTruthy();

      // 4. Verify login with TOTP
      const loginCode = getCurrentTOTP(secret);
      const verifyLoginRequest = createMockRequest({
        tempToken: loginData.tempToken,
        code: loginCode,
        useBackupCode: false,
      });
      const verifyLoginResponse = await verifyLoginPOST(verifyLoginRequest);
      const verifyLoginData = await verifyLoginResponse.json();

      expect(verifyLoginResponse.status).toBe(200);
      expect(verifyLoginData.success).toBe(true);

      // 5. Disable 2FA
      const disableCode = getCurrentTOTP(secret);
      const disableRequest = createMockRequest(
        {
          password: 'correct-password',
          code: disableCode,
        },
        { auth_token: 'mock-auth-token' }
      );
      const disableResponse = await disablePOST(disableRequest);
      const disableData = await disableResponse.json();

      expect(disableResponse.status).toBe(200);
      expect(disableData.success).toBe(true);
    });
  });
});
