/**
 * /api/easy-order/order-list route tests
 *
 * Covers:
 * - 401 when unauthenticated
 * - 403 when authenticated but not in an allowed customer group
 * - 200 with the curated product list for an allowed customer group
 * - 200 with an empty list when the user has no matching order-list term
 * - 500 when the GraphQL client throws
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetServerAuth, mockRequest } = vi.hoisted(() => ({
  mockGetServerAuth: vi.fn(),
  mockRequest: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  getServerAuth: mockGetServerAuth,
}));

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({ request: mockRequest })),
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { GET as getOrderList } from '../route';

const LENNOX_USER = { id: '1', customerGroups: ['lennox'] };

describe('GET /api/easy-order/order-list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    mockRequest.mockResolvedValue({
      products: {
        nodes: [
          {
            id: 'prod-1',
            databaseId: 1,
            name: 'Duct Temperature Sensor',
            slug: 'duct-temp-sensor',
            sku: 'BA/10K-2-AP',
            partNumber: 'BA/10K-2-AP',
            price: '$49.99',
            stockStatus: 'IN_STOCK',
            image: { sourceUrl: 'https://example.com/img.jpg', altText: 'Sensor' },
          },
        ],
      },
    });

    const res = await getOrderList();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toHaveLength(1);
    expect(json.products[0].name).toBe('Duct Temperature Sensor');
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { term: 'lennox', first: 100 });
  });

  it('returns an empty list when the user has no matching order-list term', async () => {
    mockGetServerAuth.mockResolvedValue({ user: { id: '1', customerGroups: [] } });
    // Not in an allowed group, so 403 — but simulate an allowed group with no term mapping
    mockGetServerAuth.mockResolvedValue({ user: { id: '1', customerGroups: ['lennox'] } });
    mockRequest.mockResolvedValue({ products: { nodes: [] } });

    const res = await getOrderList();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.products).toEqual([]);
  });

  it('returns 500 when the GraphQL client throws', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockRequest.mockRejectedValue(new Error('GraphQL error'));

    const res = await getOrderList();
    expect(res.status).toBe(500);
  });
});
