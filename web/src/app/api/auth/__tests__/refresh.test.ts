/**
 * Integration Tests for POST /api/auth/refresh
 *
 * Tests silent token refresh with coverage of:
 * - No refresh cookie → 401
 * - WordPress refresh failure → 401 + cookies cleared
 * - Successful refresh: new auth_token set with correct httpOnly flags
 * - Server error handling (500)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '../refresh/route';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockCookieGet, mockCookieSet, mockCookieDelete, mockCookies } = vi.hoisted(() => {
  const mockCookieGet = vi.fn();
  const mockCookieSet = vi.fn();
  const mockCookieDelete = vi.fn();
  const mockCookies = vi.fn(() => ({
    get: mockCookieGet,
    set: mockCookieSet,
    delete: mockCookieDelete,
  }));
  return { mockCookieGet, mockCookieSet, mockCookieDelete, mockCookies };
});

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRequest(): NextRequest {
  return new NextRequest('http://localhost/api/auth/refresh', { method: 'POST' });
}

describe('POST /api/auth/refresh', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;

    // Default: refresh_token cookie is present
    mockCookieGet.mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh-token' } : undefined,
    );

    // Default: WordPress returns new auth token
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            refreshJwtAuthToken: {
              authToken: 'new-auth-token-456',
            },
          },
        }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ─── Auth guard ──────────────────────────────────────────────────────────────

  it('returns 401 when refresh_token cookie is absent', async () => {
    mockCookieGet.mockReturnValue(undefined);

    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('No refresh token');
  });

  it('does not call WordPress when no refresh cookie is present', async () => {
    mockCookieGet.mockReturnValue(undefined);

    await POST(makeRequest());
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // ─── Token refresh failure ───────────────────────────────────────────────────

  it('returns 401 when WordPress returns errors', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: { refreshJwtAuthToken: { authToken: null } },
          errors: [{ message: 'Invalid refresh token' }],
        }),
    });

    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Token refresh failed');
  });

  it('clears both cookies when refresh fails', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: { refreshJwtAuthToken: { authToken: null } },
          errors: [{ message: 'Expired' }],
        }),
    });

    await POST(makeRequest());
    expect(mockCookieDelete).toHaveBeenCalledWith('auth_token');
    expect(mockCookieDelete).toHaveBeenCalledWith('refresh_token');
  });

  // ─── Successful refresh ───────────────────────────────────────────────────────

  it('returns 200 with success: true on successful refresh', async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('sets the new auth_token cookie with httpOnly flag', async () => {
    await POST(makeRequest());

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall).toBeDefined();
    expect(authTokenCall[1]).toBe('new-auth-token-456');
    expect(authTokenCall[2]).toMatchObject({ httpOnly: true });
  });

  it('sets sameSite: lax on refreshed auth_token (CSRF protection)', async () => {
    await POST(makeRequest());

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall[2]).toMatchObject({ sameSite: 'lax' });
  });

  it('sets 7-day maxAge on the new auth_token', async () => {
    await POST(makeRequest());

    const authTokenCall = mockCookieSet.mock.calls.find((call) => call[0] === 'auth_token');
    expect(authTokenCall[2].maxAge).toBe(60 * 60 * 24 * 7);
  });

  it('sends the refresh token to WordPress in request body', async () => {
    await POST(makeRequest());

    const fetchCall = mockFetch.mock.calls[0];
    const body = JSON.parse(fetchCall[1].body as string);
    expect(body.variables.token).toBe('valid-refresh-token');
  });

  // ─── Server errors ───────────────────────────────────────────────────────────

  it('returns 500 when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Server error');
  });
});
