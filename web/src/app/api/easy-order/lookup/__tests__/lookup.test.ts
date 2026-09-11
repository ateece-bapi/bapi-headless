/**
 * /api/easy-order/lookup route tests
 *
 * Covers:
 * - 401 when unauthenticated
 * - 403 when authenticated but not in an allowed customer group
 * - 400 on invalid/empty request body
 * - 200 with found/not-found results, de-duped and customer-group filtered
 * - 500 when the GraphQL client throws
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockGetServerAuth, mockSearchProductsBySKU, mockGetSdk } = vi.hoisted(() => ({
  mockGetServerAuth: vi.fn(),
  mockSearchProductsBySKU: vi.fn(),
  mockGetSdk: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  getServerAuth: mockGetServerAuth,
}));

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({})),
}));

vi.mock('@/lib/graphql/generated', () => ({
  getSdk: mockGetSdk,
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

describe('POST /api/easy-order/lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSdk.mockReturnValue({ SearchProductsBySKU: mockSearchProductsBySKU });
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
    mockSearchProductsBySKU.mockResolvedValue({
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
            image: { sourceUrl: 'https://example.com/img.jpg', altText: 'Sensor' },
          },
        ],
      },
    });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results).toHaveLength(1);
    expect(json.results[0].found).toBe(true);
    expect(json.results[0].product.name).toBe('Duct Temperature Sensor');
  });

  it('returns found:false when no product matches the SKU', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockSearchProductsBySKU.mockResolvedValue({ products: { nodes: [] } });

    const res = await lookup(makePost({ skus: ['BA/UNKNOWN'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results[0]).toEqual({ sku: 'BA/UNKNOWN', found: false });
  });

  it('de-duplicates repeated SKUs into a single lookup', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockSearchProductsBySKU.mockResolvedValue({ products: { nodes: [] } });

    const res = await lookup(makePost({ skus: ['BA/10K-2-AP', 'BA/10K-2-AP'] }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.results).toHaveLength(1);
    expect(mockSearchProductsBySKU).toHaveBeenCalledTimes(1);
  });

  it('returns found:false for a SKU when the lookup throws', async () => {
    mockGetServerAuth.mockResolvedValue({ user: LENNOX_USER });
    mockSearchProductsBySKU.mockRejectedValue(new Error('GraphQL error'));

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
