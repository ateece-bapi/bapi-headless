/**
 * useAuth hook tests
 *
 * Uses vi.spyOn(global, 'fetch') to intercept calls before Node.js URL
 * parsing (which rejects relative URLs). MSW remains active for other tests.
 *
 * Covers:
 * - Initial state: user null, isLoaded false, isSignedIn false
 * - 200 response → user populated, isSignedIn true
 * - 401/403 response → user null, isSignedIn false, isLoaded true
 * - Network error → graceful fallback, isLoaded true
 * - No state update after unmount
 *
 * signIn: success, body passthrough, server error, network failure
 * signOut: POSTs to logout endpoint, redirects to /
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, signIn, signOut } from '../useAuth';

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── Setup ───────────────────────────────────────────────────────────────────

let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, 'fetch'>>;
let locationDescriptor: PropertyDescriptor | undefined;

beforeEach(() => {
  vi.clearAllMocks();
  fetchSpy = vi.spyOn(global, 'fetch');
  locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { reload: vi.fn(), href: '' },
  });
});

afterEach(() => {
  fetchSpy.mockRestore();
  if (locationDescriptor) {
    Object.defineProperty(window, 'location', locationDescriptor);
  }
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 'user-1',
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  username: 'janedoe',
  customerGroups: ['reseller'],
};

// ─── useAuth ─────────────────────────────────────────────────────────────────

describe('useAuth', () => {
  it('starts with loading state: user null, isLoaded false, isSignedIn false', () => {
    fetchSpy.mockImplementation(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
  });

  it('sets user and isSignedIn true on 200 response', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({ user: MOCK_USER }));
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.user).toEqual(MOCK_USER);
    expect(result.current.isSignedIn).toBe(true);
  });

  it('sets isSignedIn false on 401 response', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 401 }));
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.user).toBeNull();
    expect(result.current.isSignedIn).toBe(false);
  });

  it('sets isSignedIn false on 403 response', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 403 }));
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.user).toBeNull();
    expect(result.current.isSignedIn).toBe(false);
  });

  it('sets isLoaded true and user null on network error', async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.user).toBeNull();
    expect(result.current.isSignedIn).toBe(false);
  });

  it('does not update state after unmount', async () => {
    let resolveRequest!: (r: Response) => void;
    fetchSpy.mockImplementationOnce(
      () => new Promise<Response>((res) => { resolveRequest = res; })
    );
    const { result, unmount } = renderHook(() => useAuth());
    unmount();
    resolveRequest(makeJsonResponse({ user: MOCK_USER }));
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.isLoaded).toBe(false); // unchanged after unmount
  });
});

// ─── signIn ──────────────────────────────────────────────────────────────────

describe('signIn', () => {
  it('returns success: true on 200 response', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({ token: 'abc' }));
    const result = await signIn('janedoe', 'password123');
    expect(result.success).toBe(true);
  });

  it('sends username and password in request body', async () => {
    let capturedBody: unknown;
    fetchSpy.mockImplementationOnce((_url: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return Promise.resolve(makeJsonResponse({ token: 'abc' }));
    });
    await signIn('janedoe', 'pass123');
    expect(capturedBody).toEqual({ username: 'janedoe', password: 'pass123' });
  });

  it('calls /api/auth/login with POST', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({ token: 'abc' }));
    await signIn('janedoe', 'pass123');
    expect(fetchSpy).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }));
  });

  it('returns success: false with server error message', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({ message: 'Invalid credentials' }, 401));
    const result = await signIn('janedoe', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  it('returns success: false with fallback when no message in response', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({}, 401));
    const result = await signIn('janedoe', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns success: false with Network error on fetch failure', async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const result = await signIn('janedoe', 'password');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('reloads window on success', async () => {
    fetchSpy.mockResolvedValueOnce(makeJsonResponse({ token: 'abc' }));
    await signIn('janedoe', 'password123');
    expect(window.location.reload).toHaveBeenCalledOnce();
  });
});

// ─── signOut ─────────────────────────────────────────────────────────────────

describe('signOut', () => {
  it('POSTs to /api/auth/logout', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 200 }));
    await signOut();
    expect(fetchSpy).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }));
  });

  it('sets window.location.href to / after logout', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 200 }));
    await signOut();
    expect(window.location.href).toBe('/');
  });
});
