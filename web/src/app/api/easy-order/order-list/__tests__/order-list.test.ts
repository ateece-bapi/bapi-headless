/**
 * /api/easy-order/order-list route tests
 *
 * Covers:
 * - 401 when unauthenticated
 * - 403 when authenticated but not in an allowed customer group
 * - 200 with the curated product list for an allowed customer group
 * - 200 with an empty list when the GraphQL resolver returns no matches
 * - restricted-product entries are filtered out by customer group
 * - 500 when the GraphQL client throws
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { GET as getOrderList } from '../route';

const LENNOX_USER = { id: '1', customerGroups: ['lennox'] };

function mockMatch(overrides: Record<string, unknown> = {}) {
  return {
    databaseId: 1,
    parentDatabaseId: 1,
    isVariation: false,
    canonicalId: 'cHJvZHVjdDox',
    name: 'Duct Temperature Sensor',
    slug: 'duct-temp-sensor',
    sku: 'BA/10K-2-AP',
    partNumber: null,
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

describe('GET /api/easy-order/order-list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieGet.mockReturnValue(undefined);
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue({ user: null });
    const res = await getOrderList();
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not in an allowed customer group', async () => {
    mockGetServerAuth.mockResolvedValue({ user: { id: '1', customerGroups: ['end-user'] } });
    const res = await getOrderList();
    expect(res.status).toBe(403);
  });

  it('returns the curated product list for an allowed customer group', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderCuratedList: [mockMatch()] });

    const res = await getOrderList();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe('Duct Temperature Sensor');
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { term: 'lennox' });
  });

  it('includes variationId when a curated match is a variation', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({
      easyOrderCuratedList: [mockMatch({ databaseId: 137609, parentDatabaseId: 137579, isVariation: true })],
    });

    const res = await getOrderList();
    const json = await res.json();

    expect(json.products[0].databaseId).toBe(137579);
    expect(json.products[0].variationId).toBe(137609);
  });

  it('uses the canonical global id for cart merge consistency, falling back to a synthetic id', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderCuratedList: [mockMatch({ canonicalId: 'cHJvZHVjdDox' })] });

    const res = await getOrderList();
    const json = await res.json();
    expect(json.products[0].id).toBe('cHJvZHVjdDox');

    mockRequest.mockResolvedValue({ easyOrderCuratedList: [mockMatch({ databaseId: 42, canonicalId: null })] });
    const res2 = await getOrderList();
    const json2 = await res2.json();
    expect(json2.products[0].id).toBe('easy_order_sku:42');
  });

  it('preserves the custom partNumber field, falling back to SKU only when unset', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderCuratedList: [mockMatch({ partNumber: 'PN-CUSTOM-123' })] });

    const res = await getOrderList();
    const json = await res.json();
    expect(json.products[0].partNumber).toBe('PN-CUSTOM-123');

    mockRequest.mockResolvedValue({ easyOrderCuratedList: [mockMatch({ partNumber: null })] });
    const res2 = await getOrderList();
    const json2 = await res2.json();
    expect(json2.products[0].partNumber).toBe('BA/10K-2-AP');
  });

  it('returns an empty list when the resolver returns no matches', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({ easyOrderCuratedList: [] });

    const res = await getOrderList();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toEqual([]);
  });

  it('does not re-filter by customer group client-side (the resolver is the authorization boundary)', async () => {
    // A product whose slug happens to collide with the legacy
    // CUSTOMER_GROUPS_BY_PRODUCT_SLUG fallback (but has no real ACF
    // customerGroup restriction) must still be returned — the resolver
    // already enforces real ACF-based restrictions server-side, and
    // curated-list membership itself is the authorization signal.
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockResolvedValue({
      easyOrderCuratedList: [
        mockMatch({ databaseId: 1, slug: 'novar-uvc-compatible-aluminum-wall-plate-temperature-sensor' }),
      ],
    });

    const res = await getOrderList();
    const json = await res.json();

    expect(json.products).toHaveLength(1);
    expect(json.products[0].databaseId).toBe(1);
  });

  it('returns 500 when the GraphQL client throws', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockRejectedValue(new Error('GraphQL error'));

    const res = await getOrderList();
    expect(res.status).toBe(500);
  });
});

