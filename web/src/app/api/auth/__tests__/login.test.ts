/**
 * Integration Tests for POST /api/auth/login
 *
 * Tests WordPress JWT authentication with full coverage of:
 * - Missing credentials validation (400)
 * - Rate limiting behavior (429)
 * - WordPress GraphQL failure / bad credentials (401)
 * - Successful login: response body, httpOnly cookie flags, token storage
 * - Server error handling (500)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '../login/route';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks (vi.mock is hoisted, so fns must be declared via vi.hoisted) ─
const { mockCookieSet, mockCookies, mockCheckRateLimit, mockRecordFailedAttempt, mockClearAttempts } =
  vi.hoisted(() => {
    const mockCookieSet = vi.fn();
    const mockCookies = vi.fn(() => ({
      set: mockCookieSet,
      get: vi.fn(),
      delete: vi.fn(),
    }));
    return {
      mockCookieSet,
      mockCookies,
      mockCheckRateLimit: vi.fn(),
      mockRecordFailedAttempt: vi.fn(),
      mockClearAttempts: vi.fn(),
    };
  });

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/auth/rate-limit', () => ({
  checkRateLimit: mockCheckRateLimit,
  recordFailedAttempt: mockRecordFailedAttempt,
  clearAttempts: mockClearAttempts,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const MOCK_SUCCESS_RESPONSE = {
  data: {
    login: {
      authToken: 'mock-auth-token-abc123',
      refreshToken: 'mock-refresh-token-xyz789',
      user: {
        id: 'dXNlcjox',
        databaseId: 1,
        email: 'test@bapi.com',
        name: 'Test User',
        username: 'testuser',
      },
    },
  },
};

describe('POST /api/auth/login', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;

    // Default: rate limit allows the request
    mockCheckRateLimit.mockReturnValue({ allowed: true });

    // Default: WordPress returns success
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(MOCK_SUCCESS_RESPONSE),
    });

    // Reset cookie mock
    mockCookies.mockReturnValue({ set: mockCookieSet, get: vi.fn(), delete: vi.fn() });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ─── Input validation ────────────────────────────────────────────────────────

  it('returns 400 when username is missing', async () => {
    const res = await POST(makeRequest({ password: 'secret' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing credentials');
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ username: 'testuser' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing credentials');
  });

  it('returns 400 when both credentials are missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  // ─── Rate limiting ───────────────────────────────────────────────────────────

  it('returns 429 when rate limit is exceeded', async () => {
    mockCheckRateLimit.mockReturnValue({
      allowed: false,
      message: 'Too many failed login attempts. Try again in 15 minutes.',
    });

    const res = await POST(makeRequest({ username: 'testuser', password: 'wrong' }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe('Rate limit exceeded');
  });

  it('does not call WordPress when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, message: 'Rate limited' });

    await POST(makeRequest({ username: 'testuser', password: 'wrong' }));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // ─── Authentication failure ──────────────────────────────────────────────────

  it('returns 401 when WordPress returns GraphQL errors', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: null,
          errors: [{ message: 'Invalid username or password' }],
        }),
    });

    const res = await POST(makeRequest({ username: 'testuser', password: 'wrong' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Authentication failed');
  });

  it('returns 401 when WordPress response has no authToken', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: { login: { authToken: null, refreshToken: null, user: null } },
        }),
    });

    const res = await POST(makeRequest({ username: 'testuser', password: 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('records a failed attempt on authentication failure', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ errors: [{ message: 'Bad credentials' }] }),
    });

    await POST(makeRequest({ username: 'testuser', password: 'wrong' }));
    expect(mockRecordFailedAttempt).toHaveBeenCalledOnce();
  });

  // ─── Successful login ────────────────────────────────────────────────────────

  it('returns 200 with user data on success', async () => {
    const res = await POST(makeRequest({ username: 'testuser', password: 'correct' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user.email).toBe('test@bapi.com');
    expect(body.user.username).toBe('testuser');
    expect(body.user.id).toBe('1');
  });

  it('does not expose tokens in the response body', async () => {
    const res = await POST(makeRequest({ username: 'testuser', password: 'correct' }));
    const body = await res.json();
    expect(body.authToken).toBeUndefined();
    expect(body.refreshToken).toBeUndefined();
    expect(body.token).toBeUndefined();
  });

  it('sets auth_token as an httpOnly cookie', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall).toBeDefined();
    expect(authTokenCall[1]).toBe('mock-auth-token-abc123');
    expect(authTokenCall[2]).toMatchObject({ httpOnly: true });
  });

  it('sets refresh_token as an httpOnly cookie', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));

    const refreshTokenCall = mockCookieSet.mock.calls.find(
      (call) => call[0] === 'refresh_token',
    );
    expect(refreshTokenCall).toBeDefined();
    expect(refreshTokenCall[1]).toBe('mock-refresh-token-xyz789');
    expect(refreshTokenCall[2]).toMatchObject({ httpOnly: true });
  });

  it('sets sameSite: lax on cookies (CSRF protection)', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall[2]).toMatchObject({ sameSite: 'lax' });
  });

  it('sets auth_token with 7-day expiry', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall[2].maxAge).toBe(60 * 60 * 24 * 7);
  });

  it('sets refresh_token with 30-day expiry', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));

    const refreshTokenCall = mockCookieSet.mock.calls.find(
      (call) => call[0] === 'refresh_token',
    );
    expect(refreshTokenCall[2].maxAge).toBe(60 * 60 * 24 * 30);
  });

  it('clears failed attempts on successful login', async () => {
    await POST(makeRequest({ username: 'testuser', password: 'correct' }));
    expect(mockClearAttempts).toHaveBeenCalledOnce();
  });

  // ─── Server errors ───────────────────────────────────────────────────────────

  it('returns 500 when fetch throws (network error)', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const res = await POST(makeRequest({ username: 'testuser', password: 'correct' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Server error');
  });
});
