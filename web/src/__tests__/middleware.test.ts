/**
 * Middleware auth gating and routing tests
 *
 * Covers:
 * - Protected route redirect to sign-in (with ?redirect= param, correct locale)
 * - Admin route redirect to sign-in
 * - Protected route with valid cookie passes through
 * - Already-authenticated users redirected away from sign-in
 * - Legacy category redirects (/categories/* → /products/*)
 * - Short category slug redirects (/products/temperature → /products/temperature-sensors)
 * - Subcategory slug redirects
 * - CDN cache headers on public routes
 * - No cache headers on protected / authenticated routes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ─────────────────────────────────────────────────────────

const { mockIntlMiddleware } = vi.hoisted(() => ({
  mockIntlMiddleware: vi.fn(),
}));

vi.mock('next-intl/middleware', () => ({
  default: () => mockIntlMiddleware,
}));

vi.mock('@root/src/i18n', () => ({
  routing: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'],
  },
}));

// Import after mocks
import middleware from '@root/middleware';
import { NextResponse } from 'next/server';

// ─── Helpers ──────────────────────────────────────────────────────────────

function makeRequest(pathname: string, opts: { cookie?: string; method?: string } = {}) {
  const url = `http://localhost${pathname}`;
  const headers: Record<string, string> = {};
  if (opts.cookie) headers['cookie'] = opts.cookie;
  return new NextRequest(url, {
    method: opts.method ?? 'GET',
    headers,
  });
}

const WITH_AUTH = { cookie: 'auth_token=valid-jwt-token' };
const NO_AUTH = {};

/** Simulates next-intl returning a plain next response */
function setupIntlPass() {
  mockIntlMiddleware.mockImplementation((req: NextRequest) => NextResponse.next());
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('Middleware: Protected route auth gating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  const protectedPaths = [
    '/account',
    '/en/account',
    '/de/account',
    '/en/account/profile',
    '/en/account/orders',
    '/en/account/favorites',
    '/en/account/quotes',
    '/en/account/settings',
  ];

  for (const path of protectedPaths) {
    it(`redirects unauthenticated request to sign-in for ${path}`, () => {
      const req = makeRequest(path, NO_AUTH);
      const res = middleware(req);
      expect(res.status).toBe(307);
      const location = res.headers.get('location')!;
      expect(location).toMatch(/\/sign-in/);
    });
  }

  it('includes ?redirect= with the original path', () => {
    const req = makeRequest('/en/account/orders', NO_AUTH);
    const res = middleware(req);
    const location = new URL(res.headers.get('location')!);
    expect(location.searchParams.get('redirect')).toBe('/en/account/orders');
  });

  it('uses correct locale in sign-in redirect for /de/account', () => {
    const req = makeRequest('/de/account', NO_AUTH);
    const res = middleware(req);
    const location = res.headers.get('location')!;
    expect(location).toContain('/de/sign-in');
  });

  it('uses default locale when no locale prefix present', () => {
    const req = makeRequest('/account', NO_AUTH);
    const res = middleware(req);
    const location = res.headers.get('location')!;
    expect(location).toContain('/en/sign-in');
  });

  it('does NOT redirect when auth_token cookie is present', () => {
    const req = makeRequest('/en/account', WITH_AUTH);
    middleware(req);
    // intlMiddleware should be called (pass-through)
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });

  it('passes through deep account sub-routes when authenticated', () => {
    const req = makeRequest('/en/account/orders/12345', WITH_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware: Admin route auth gating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  it('redirects unauthenticated request to /admin', () => {
    const req = makeRequest('/en/admin', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toMatch(/\/sign-in/);
  });

  it('redirects unauthenticated /admin/chat-analytics', () => {
    const req = makeRequest('/en/admin/chat-analytics', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(307);
  });

  it('passes through admin with valid token', () => {
    const req = makeRequest('/en/admin', WITH_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware: Authenticated user on sign-in page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  it('redirects /en/sign-in to /en/account when authenticated', () => {
    const req = makeRequest('/en/sign-in', WITH_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/en/account');
  });

  it('redirects /de/sign-in to /de/account when authenticated', () => {
    const req = makeRequest('/de/sign-in', WITH_AUTH);
    const res = middleware(req);
    expect(res.headers.get('location')).toContain('/de/account');
  });

  it('does NOT redirect /en/sign-in when unauthenticated', () => {
    const req = makeRequest('/en/sign-in', NO_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware: Legacy category redirects (/categories → /products)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  it('redirects /en/categories/temperature-sensors → /en/products/temperature-sensors (301)', () => {
    const req = makeRequest('/en/categories/temperature-sensors', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/en/products/temperature-sensors');
  });

  it('preserves sub-path in /categories redirect', () => {
    const req = makeRequest('/en/categories/humidity-sensors/room-wall', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/en/products/humidity-sensors/room-wall');
  });

  it('redirects /de/categories/... using correct locale', () => {
    const req = makeRequest('/de/categories/pressure-sensors', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/de/products/pressure-sensors');
  });
});

describe('Middleware: Short category slug redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  const shortSlugCases: [string, string][] = [
    ['/en/products/temperature', '/en/products/temperature-sensors'],
    ['/en/products/humidity', '/en/products/humidity-sensors'],
    ['/en/products/pressure', '/en/products/pressure-sensors'],
    ['/en/products/air-quality', '/en/products/air-quality-sensors'],
    ['/en/products/wireless', '/en/products/bluetooth-wireless'],
  ];

  for (const [from, to] of shortSlugCases) {
    it(`301 redirects ${from} → ${to}`, () => {
      const req = makeRequest(from, NO_AUTH);
      const res = middleware(req);
      expect(res.status).toBe(301);
      expect(res.headers.get('location')).toContain(to);
    });
  }

  it('preserves sub-path when redirecting short slug', () => {
    const req = makeRequest('/en/products/temperature/room-wall', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/en/products/temperature-sensors/room-wall');
  });

  it('does NOT redirect an already-correct slug', () => {
    const req = makeRequest('/en/products/temperature-sensors', NO_AUTH);
    middleware(req);
    // Should not be a redirect — intlMiddleware runs
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware: Subcategory slug redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  it('redirects /en/products/{category}/temp-room-temp → /en/products/{category}/temp-room (301)', () => {
    const req = makeRequest('/en/products/temperature-sensors/temp-room-temp', NO_AUTH);
    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toContain('/en/products/temperature-sensors/temp-room');
  });

  it('does NOT redirect correct subcategory slug', () => {
    const req = makeRequest('/en/products/temperature-sensors/temp-room', NO_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware: CDN cache headers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  const publicRoutes = [
    '/',
    '/en',
    '/de',
    '/en/products/temperature-sensors',
    '/en/products/temperature-sensors/room-wall',
    '/en/company/about',
    '/en/support/faq',
    '/en/resources/downloads',
  ];

  for (const route of publicRoutes) {
    it(`sets Cache-Control header on public route ${route}`, () => {
      const req = makeRequest(route, NO_AUTH);
      const res = middleware(req);
      const cc = res.headers.get('cache-control');
      expect(cc).toContain('public');
      expect(cc).toContain('s-maxage=3600');
    });
  }

  it('does NOT set Cache-Control on protected route even when accessed with auth', () => {
    const req = makeRequest('/en/account', WITH_AUTH);
    const res = middleware(req);
    expect(res.headers.get('cache-control')).toBeNull();
  });

  it('does NOT set Cache-Control when authenticated (personalized)', () => {
    const req = makeRequest('/en/products/temperature-sensors', WITH_AUTH);
    const res = middleware(req);
    expect(res.headers.get('cache-control')).toBeNull();
  });

  it('does NOT set Cache-Control on POST requests', () => {
    const req = makeRequest('/en/products/temperature-sensors', { ...NO_AUTH, method: 'POST' });
    const res = middleware(req);
    expect(res.headers.get('cache-control')).toBeNull();
  });

  it('sets Vary header on cached public routes', () => {
    const req = makeRequest('/en/products/temperature-sensors', NO_AUTH);
    const res = middleware(req);
    const vary = res.headers.get('vary');
    expect(vary).toContain('Accept-Language');
  });
});

describe('Middleware: Public routes pass through without redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupIntlPass();
  });

  it('does not redirect unauthenticated access to /en/products', () => {
    const req = makeRequest('/en/products/temperature-sensors', NO_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });

  it('does not redirect unauthenticated access to /en/company/about', () => {
    const req = makeRequest('/en/company/about', NO_AUTH);
    middleware(req);
    expect(mockIntlMiddleware).toHaveBeenCalled();
  });
});
