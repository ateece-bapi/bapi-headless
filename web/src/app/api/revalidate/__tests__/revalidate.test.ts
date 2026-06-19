/**
 * Integration Tests for POST /api/revalidate
 *
 * Tests on-demand cache revalidation with coverage of:
 * - Missing secret → 401
 * - Wrong secret → 401
 * - Rate limiting → 429 with Retry-After header
 * - Missing tag → 400
 * - Invalid / non-whitelisted tag → 400
 * - Allowed static tags (products, categories, graphql, product-list)
 * - Dynamic product-{slug} tags
 * - Successful revalidation: response body + revalidateTag called
 * - Server error handling (500)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../route';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockRevalidateTag, mockCheckRateLimit, mockGetClientIP } = vi.hoisted(() => ({
  mockRevalidateTag: vi.fn(),
  mockCheckRateLimit: vi.fn(),
  mockGetClientIP: vi.fn(() => '127.0.0.1'),
}));

vi.mock('next/cache', () => ({
  revalidateTag: mockRevalidateTag,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: mockCheckRateLimit,
  getClientIP: mockGetClientIP,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const VALID_SECRET = 'test-revalidate-secret';

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('REVALIDATE_SECRET', VALID_SECRET);

    // Default: rate limit allows the request
    mockCheckRateLimit.mockReturnValue({ success: true, limit: 10, remaining: 9, reset: 0 });
  });

  // ─── Secret validation ────────────────────────────────────────────────────────

  it('returns 401 when secret is missing', async () => {
    const res = await POST(makeRequest({ tag: 'products' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 401 when secret is wrong', async () => {
    const res = await POST(makeRequest({ secret: 'wrong-secret', tag: 'products' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('does not call revalidateTag when secret is invalid', async () => {
    await POST(makeRequest({ secret: 'wrong-secret', tag: 'products' }));
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  // ─── Rate limiting ───────────────────────────────────────────────────────────

  it('returns 429 when rate limited', async () => {
    const futureReset = Math.floor(Date.now() / 1000) + 60;
    mockCheckRateLimit.mockReturnValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: futureReset,
    });

    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'products' }));
    expect(res.status).toBe(429);
  });

  it('includes Retry-After header when rate limited', async () => {
    const futureReset = Math.floor(Date.now() / 1000) + 60;
    mockCheckRateLimit.mockReturnValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: futureReset,
    });

    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'products' }));
    expect(res.headers.get('Retry-After')).toBeDefined();
  });

  // ─── Tag validation ───────────────────────────────────────────────────────────

  it('returns 400 when tag is missing', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad Request');
  });

  it('returns 400 for a non-whitelisted tag', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'users' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad Request');
  });

  it('returns 400 for an empty string tag', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric tag', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 42 }));
    expect(res.status).toBe(400);
  });

  // ─── Allowed tags ─────────────────────────────────────────────────────────────

  it.each(['products', 'product-list', 'categories', 'graphql'])(
    'accepts static whitelisted tag: %s',
    async (tag) => {
      const res = await POST(makeRequest({ secret: VALID_SECRET, tag }));
      expect(res.status).toBe(200);
      expect(mockRevalidateTag).toHaveBeenCalledWith(tag);
    },
  );

  it('accepts a valid dynamic product-{slug} tag', async () => {
    const tag = 'product-humidity-transmitter-duct';
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag }));
    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith(tag);
  });

  it('rejects a product tag with uppercase letters', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'product-HumidityDuct' }));
    expect(res.status).toBe(400);
  });

  // ─── Success response ─────────────────────────────────────────────────────────

  it('returns revalidated: true with the tag echoed back', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'products' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revalidated).toBe(true);
    expect(body.tag).toBe('products');
    expect(typeof body.now).toBe('number');
  });

  // ─── Server errors ───────────────────────────────────────────────────────────

  it('returns 500 when revalidateTag throws', async () => {
    mockRevalidateTag.mockImplementation(() => {
      throw new Error('Cache unavailable');
    });

    const res = await POST(makeRequest({ secret: VALID_SECRET, tag: 'products' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Internal Server Error');
  });
});
