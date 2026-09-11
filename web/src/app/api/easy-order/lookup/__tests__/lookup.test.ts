/**
 * /api/easy-order/lookup route tests
 *
 * Covers:
 * - 401 when unauthenticated
 * - 403 when authenticated but not in an allowed customer group
 * - 400 on invalid/empty request body
 * - 200 with found/not-found results, de-duped and customer-group filtered
 * - 200 with found:false when a matched product is restricted to a different customer group
 * - 500 when the GraphQL client throws
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockGetServerAuth, mockRequest, mockCookieGet } = vi.hoisted(() => ({
  mockGetServerAuth: vi.fn(),
  mockRequest: vi.fn(),
  mockCookieGet: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  getServerAuth: mockGetServerAuth,
}));

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({ request: mockRequest })),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookieGet })),
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { POST as lookup } from '../route';

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/easy-order/lookup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const LENNOX_USER = { id: '1', customerGroups: ['lennox'] };

function mockMatch(overrides: Record<string, unknown> = {}) {
  return {
    databaseId: 1,
    parentDatabaseId: 1,
    isVariation: false,
    name: 'Duct Temperature Sensor',
    slug: 'duct-temp-sensor',
    sku: 'BA/10K-2-AP',
    price: '$49.99',
    stockStatus: 'INSTOCK',
    imageUrl: 'https://example.com/img.jpg',
    imageAltText: 'Sensor',
    customerGroup1: null,
    customerGroup2: null,
    customerGroup3: null,
    ...overrides,
  };
}

describe('POST /api/easy-order/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieGet.mockReturnValue(undefined);
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue({ user: null });
    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not in an allowed customer group', async () => {
    mockGetServerAuth.mockResolvedValue({ user: { id: '1', customerGroups: ['end-user'] } });
    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when skus array is missing', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    const res = await lookup(makePost({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when skus array is empty', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    const res = await lookup(makePost({ skus: [] }));
    expect(res.status).toBe(400);
  });

  it('returns found:true with product data for a matching SKU', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderSkuLookup: mockMatch() });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results).toHaveLength(1);
    expect(json.results[0].found).toBe(true);
    expect(json.results[0].product.name).toBe('Duct Temperature Sensor');
  });

  it('returns found:true with variationId set when the match is a variation', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({
      easyOrderSkuLookup: mockMatch({ databaseId: 137609, parentDatabaseId: 137579, isVariation: true }),
    });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(json.results[0].product.databaseId).toBe(137579);
    expect(json.results[0].product.variationId).toBe(137609);
  });

  it('returns found:false when no product matches the SKU', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderSkuLookup: null });

    const res = await lookup(makePost({ skus: ['BA/UNKNOWN'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results[0]).toEqual({ sku: 'BA/UNKNOWN', found: false });
  });

  it('returns found:false when the match is restricted to a different customer group', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderSkuLookup: mockMatch({ customerGroup1: 'alc' }) });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results[0].found).toBe(false);
  });

  it('returns found:true when a restricted match is visible to the user\'s customer group', async () => {
    mockGetServerAuth.mockResolvedValue({ user: { id: '1', customerGroups: ['lennox', 'alc'] } });
    mockRequest.mockResolvedValue({ easyOrderSkuLookup: mockMatch({ customerGroup1: 'alc' }) });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(json.results[0].found).toBe(true);
  });

  it('de-duplicates repeated SKUs into a single lookup', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderSkuLookup: null });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP', 'BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results).toHaveLength(1);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('bounds concurrency instead of firing one request per SKU simultaneously', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    let inFlight = 0;
    let maxInFlight = 0;
    mockRequest.mockImplementation(async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight--;
      return { easyOrderSkuLookup: null };
    });

    const skus = Array.from({ length: 20 }, (_, i) => `SKU-${i}`);
    await lookup(makePost({ skus }));

    expect(maxInFlight).toBeLessThan(20);
    expect(mockRequest).toHaveBeenCalledTimes(20);
  });

  it('returns found:false for a SKU when the lookup throws', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockRejectedValue(new Error('GraphQL error'));

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results[0]).toEqual({ sku: 'BA/10K-2-AP', found: false });
  });

  it('returns 500 when request parsing fails unexpectedly', async () => {
    mockGetServerAuth.mockRejectedValue(new Error('boom'));
    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    expect(res.status).toBe(500);
  });
});

