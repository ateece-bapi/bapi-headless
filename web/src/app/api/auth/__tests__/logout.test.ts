/**
 * Integration Tests for POST /api/auth/logout
 *
 * Tests cookie clearing behavior:
 * - Both cookies are deleted on success
 * - Success response shape
 * - Server error handling (500)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../logout/route';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockCookieDelete, mockCookies } = vi.hoisted(() => {
  const mockCookieDelete = vi.fn();
  const mockCookies = vi.fn(() => ({
    delete: mockCookieDelete,
    get: vi.fn(),
    set: vi.fn(),
  }));
  return { mockCookieDelete, mockCookies };
});

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with success: true', async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('deletes the auth_token cookie', async () => {
    await POST();
    expect(mockCookieDelete).toHaveBeenCalledWith('auth_token');
  });

  it('deletes the refresh_token cookie', async () => {
    await POST();
    expect(mockCookieDelete).toHaveBeenCalledWith('refresh_token');
  });

  it('deletes both cookies in a single request', async () => {
    await POST();
    const deletedNames = mockCookieDelete.mock.calls.map((c) => c[0]);
    expect(deletedNames).toContain('auth_token');
    expect(deletedNames).toContain('refresh_token');
    expect(mockCookieDelete).toHaveBeenCalledTimes(2);
  });

  it('returns 500 when cookies() throws', async () => {
    mockCookies.mockImplementationOnce(() => {
      throw new Error('Cookie store unavailable');
    });

    const res = await POST();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
