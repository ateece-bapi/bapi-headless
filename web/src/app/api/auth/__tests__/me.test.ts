/**
 * Integration Tests for GET /api/auth/me
 *
 * Tests current user fetch from WordPress JWT token with coverage of:
 * - No auth cookie → 401
 * - Invalid/expired token, no refresh token → 401 + cookies cleared
 * - Invalid/expired token, valid refresh token → silent refresh → 200
 * - Silent refresh fails → 401 + cookies cleared
 * - Successful fetch: user shape, roles, customer group processing
 * - Customer group slugification (e.g. "END USER" → "end-user")
 * - Default customer group fallback when none present
 * - "NO ACCESS" values are filtered out
 * - Server error handling (500)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET } from '../me/route';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockCookieGet, mockCookieDelete, mockCookieSet, mockCookies } = vi.hoisted(() => {
  const mockCookieGet = vi.fn();
  const mockCookieDelete = vi.fn();
  const mockCookieSet = vi.fn();
  const mockCookies = vi.fn(() => ({
    get: mockCookieGet,
    delete: mockCookieDelete,
    set: mockCookieSet,
  }));
  return { mockCookieGet, mockCookieDelete, mockCookieSet, mockCookies };
});

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRequest(): NextRequest {
  return new NextRequest('http://localhost/api/auth/me', { method: 'GET' });
}

function makeViewerResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      viewer: {
        id: 'dXNlcjox',
        databaseId: 42,
        email: 'test@bapi.com',
        name: 'Test User',
        username: 'testuser',
        customerInformation: {
          customerGroup1: ['END USER'],
          customerGroup2: null,
          customerGroup3: null,
        },
        roles: {
          nodes: [{ name: 'subscriber' }],
        },
        ...overrides,
      },
    },
  };
}

function makeExpiredTokenResponse() {
  return { data: { viewer: null }, errors: [{ message: 'Expired token' }] };
}

function makeRefreshSuccessResponse(authToken = 'new-auth-token') {
  return { data: { refreshJwtAuthToken: { authToken } } };
}

function makeRefreshFailResponse() {
  return { data: { refreshJwtAuthToken: null }, errors: [{ message: 'Invalid refresh token' }] };
}

describe('GET /api/auth/me', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;

    // Default: auth cookie present, no refresh token
    mockCookieGet.mockImplementation((name: string) => {
      if (name === 'auth_token') return { value: 'valid-token' };
      return undefined;
    });

    // Default: WordPress returns a valid viewer
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(makeViewerResponse()),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ─── Auth guard ──────────────────────────────────────────────────────────────

  it('returns 401 when auth_token cookie is absent', async () => {
    mockCookieGet.mockReturnValue(undefined);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.user).toBeNull();
  });

  it('does not call WordPress when no cookie is present', async () => {
    mockCookieGet.mockReturnValue(undefined);

    await GET(makeRequest());
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // ─── Token validation failure (no refresh token) ─────────────────────────────

  it('returns 401 when WordPress returns errors and no refresh token is available', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(makeExpiredTokenResponse()),
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.user).toBeNull();
  });

  it('clears both cookies when token is invalid and no refresh token exists', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(makeExpiredTokenResponse()),
    });

    await GET(makeRequest());
    expect(mockCookieDelete).toHaveBeenCalledWith('auth_token');
    expect(mockCookieDelete).toHaveBeenCalledWith('refresh_token');
  });

  // ─── Silent refresh ───────────────────────────────────────────────────────────

  it('silently refreshes and returns user when auth token is expired but refresh token is valid', async () => {
    // auth_token present, refresh_token also present
    mockCookieGet.mockImplementation((name: string) => {
      if (name === 'auth_token') return { value: 'expired-token' };
      if (name === 'refresh_token') return { value: 'valid-refresh-token' };
      return undefined;
    });

    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeExpiredTokenResponse()) }) // viewer with expired token
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeRefreshSuccessResponse()) }) // refresh mutation
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeViewerResponse()) }); // viewer retry

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe('test@bapi.com');
  });

  it('sets a new auth_token cookie after successful silent refresh', async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === 'auth_token') return { value: 'expired-token' };
      if (name === 'refresh_token') return { value: 'valid-refresh-token' };
      return undefined;
    });

    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeExpiredTokenResponse()) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeRefreshSuccessResponse('brand-new-token')) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeViewerResponse()) });

    await GET(makeRequest());
    expect(mockCookieSet).toHaveBeenCalledWith(
      'auth_token',
      'brand-new-token',
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('does not clear cookies when silent refresh succeeds', async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === 'auth_token') return { value: 'expired-token' };
      if (name === 'refresh_token') return { value: 'valid-refresh-token' };
      return undefined;
    });

    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeExpiredTokenResponse()) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeRefreshSuccessResponse()) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeViewerResponse()) });

    await GET(makeRequest());
    expect(mockCookieDelete).not.toHaveBeenCalled();
  });

  it('clears cookies and returns 401 when refresh token is also invalid', async () => {
    mockCookieGet.mockImplementation((name: string) => {
      if (name === 'auth_token') return { value: 'expired-token' };
      if (name === 'refresh_token') return { value: 'expired-refresh-token' };
      return undefined;
    });

    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeExpiredTokenResponse()) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(makeRefreshFailResponse()) });

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    expect(mockCookieDelete).toHaveBeenCalledWith('auth_token');
    expect(mockCookieDelete).toHaveBeenCalledWith('refresh_token');
  });

  // ─── Successful fetch ────────────────────────────────────────────────────────

  it('returns 200 with user shape on success', async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.id).toBe('42');
    expect(body.user.email).toBe('test@bapi.com');
    expect(body.user.username).toBe('testuser');
    expect(body.user.displayName).toBe('Test User');
  });

  it('sends the Bearer token to WordPress', async () => {
    await GET(makeRequest());
    const fetchCall = mockFetch.mock.calls[0];
    const headers = fetchCall[1].headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer valid-token');
  });

  // ─── Customer group processing ───────────────────────────────────────────────

  it('slugifies customer groups ("END USER" → "end-user")', async () => {
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.customerGroups).toContain('end-user');
  });

  it('returns ["end-user"] when customerInformation is null', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(makeViewerResponse({ customerInformation: null })),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.customerGroups).toEqual(['end-user']);
  });

  it('returns ["end-user"] when all groups are empty strings', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makeViewerResponse({
            customerInformation: {
              customerGroup1: [''],
              customerGroup2: [],
              customerGroup3: null,
            },
          }),
        ),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.customerGroups).toEqual(['end-user']);
  });

  it('filters out "NO ACCESS" values from customer groups', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makeViewerResponse({
            customerInformation: {
              customerGroup1: ['NO ACCESS'],
              customerGroup2: ['END USER'],
              customerGroup3: null,
            },
          }),
        ),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.customerGroups).not.toContain('no-access');
    expect(body.user.customerGroups).toContain('end-user');
  });

  it('merges groups from all three customerGroup fields', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makeViewerResponse({
            customerInformation: {
              customerGroup1: ['END USER'],
              customerGroup2: ['MFG'],
              customerGroup3: ['HUMIDPRES'],
            },
          }),
        ),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.customerGroups).toContain('end-user');
    expect(body.user.customerGroups).toContain('mfg');
    expect(body.user.customerGroups).toContain('humidpres');
  });

  // ─── Roles ───────────────────────────────────────────────────────────────────

  it('returns roles array from WordPress', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makeViewerResponse({
            roles: { nodes: [{ name: 'administrator' }, { name: 'subscriber' }] },
          }),
        ),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.roles).toEqual(['administrator', 'subscriber']);
  });

  it('returns empty roles array when no roles present', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(makeViewerResponse({ roles: { nodes: [] } })),
    });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.user.roles).toEqual([]);
  });

  // ─── Server errors ───────────────────────────────────────────────────────────

  it('returns 500 when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.user).toBeNull();
    expect(body.error).toBe('Server error');
  });
});
