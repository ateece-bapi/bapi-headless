/**
 * Integration Tests for POST /api/search and GET /api/search
 *
 * Tests product search with coverage of:
 * - Short / missing query returns empty array immediately (no GraphQL calls)
 * - POST with valid query calls GraphQL and returns merged, deduplicated results
 * - GET with ?q= param works identically
 * - SKU-like queries trigger the variation SKU query (3 promises)
 * - Non-SKU-like queries skip the variation query (2 promises)
 * - Results are deduplicated by product ID (variation > SKU > name priority)
 * - Results are capped at 8
 * - Customer group filtering applied: guest defaults to end-user
 * - Server error returns 500
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockSdkSearchProducts, mockSdkSearchProductsBySKU, mockSdkSearchProductsByVariationSku, mockGetSdk, mockCookies } =
  vi.hoisted(() => {
    const mockSdkSearchProducts = vi.fn();
    const mockSdkSearchProductsBySKU = vi.fn();
    const mockSdkSearchProductsByVariationSku = vi.fn();
    const mockGetSdk = vi.fn(() => ({
      SearchProducts: mockSdkSearchProducts,
      SearchProductsBySKU: mockSdkSearchProductsBySKU,
      SearchProductsByVariationSku: mockSdkSearchProductsByVariationSku,
    }));
    const mockCookies = vi.fn(() => ({
      get: vi.fn(() => undefined), // no auth cookie = guest
    }));
    return {
      mockSdkSearchProducts,
      mockSdkSearchProductsBySKU,
      mockSdkSearchProductsByVariationSku,
      mockGetSdk,
      mockCookies,
    };
  });

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({})),
}));

vi.mock('@/lib/graphql/generated', () => ({
  getSdk: mockGetSdk,
}));

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(query: string): NextRequest {
  return new NextRequest(`http://localhost/api/search?q=${encodeURIComponent(query)}`);
}

function makeProduct(id: number, group = 'END USER') {
  return {
    id: `prod-${id}`,
    databaseId: id,
    name: `Product ${id}`,
    slug: `product-${id}`,
    sku: `SKU-${id}`,
    price: `$${id}.00`,
    // camelCase field names as expected by filterProductsByCustomerGroup
    customerGroup1: group,
    customerGroup2: null,
    customerGroup3: null,
  };
}

const emptyProductsResponse = { products: { nodes: [] } };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: all GraphQL queries return empty
    mockSdkSearchProducts.mockResolvedValue(emptyProductsResponse);
    mockSdkSearchProductsBySKU.mockResolvedValue(emptyProductsResponse);
    mockSdkSearchProductsByVariationSku.mockResolvedValue({
      searchProductsByVariationSku: [],
    });
  });

  // ─── Short query guard ────────────────────────────────────────────────────────

  it('returns empty array for query shorter than 2 chars', async () => {
    const res = await POST(makePostRequest({ query: 'a' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.products.nodes).toEqual([]);
    expect(mockSdkSearchProducts).not.toHaveBeenCalled();
  });

  it('returns empty array for missing query', async () => {
    const res = await POST(makePostRequest({}));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.products.nodes).toEqual([]);
  });

  // ─── Normal text query ────────────────────────────────────────────────────────

  it('calls SearchProducts and SearchProductsBySKU for normal text query', async () => {
    await POST(makePostRequest({ query: 'temperature' }));
    expect(mockSdkSearchProducts).toHaveBeenCalledWith({ search: 'temperature', first: 8 });
    expect(mockSdkSearchProductsBySKU).toHaveBeenCalledWith({ sku: 'temperature', first: 8 });
  });

  it('does NOT call SearchProductsByVariationSku for non-SKU query', async () => {
    await POST(makePostRequest({ query: 'temperature sensor' }));
    expect(mockSdkSearchProductsByVariationSku).not.toHaveBeenCalled();
  });

  it('returns merged product nodes', async () => {
    mockSdkSearchProducts.mockResolvedValue({
      products: { nodes: [makeProduct(1)] },
    });

    const res = await POST(makePostRequest({ query: 'sensor' }));
    const body = await res.json();
    expect(body.products.nodes).toHaveLength(1);
    expect(body.products.nodes[0].id).toBe('prod-1');
  });

  // ─── SKU-like query ───────────────────────────────────────────────────────────

  it('calls variation SKU query for SKU-like queries (e.g. "BA-2C")', async () => {
    await POST(makePostRequest({ query: 'BA-2C' }));
    expect(mockSdkSearchProductsByVariationSku).toHaveBeenCalledWith({
      sku: 'BA-2C',
      first: 10,
    });
  });

  it('does not call variation query for all-text queries', async () => {
    await POST(makePostRequest({ query: 'humidity' }));
    expect(mockSdkSearchProductsByVariationSku).not.toHaveBeenCalled();
  });

  // ─── Deduplication ────────────────────────────────────────────────────────────

  it('deduplicates products appearing in both name and SKU results', async () => {
    const product = makeProduct(1);
    mockSdkSearchProducts.mockResolvedValue({ products: { nodes: [product] } });
    mockSdkSearchProductsBySKU.mockResolvedValue({ products: { nodes: [product] } });

    const res = await POST(makePostRequest({ query: 'sensor' }));
    const body = await res.json();
    expect(body.products.nodes).toHaveLength(1);
  });

  it('keeps variation SKU result over name result for same product ID', async () => {
    const nameProduct = { ...makeProduct(1), name: 'From Name' };
    const variationProduct = { ...makeProduct(1), name: 'From Variation' };

    mockSdkSearchProducts.mockResolvedValue({ products: { nodes: [nameProduct] } });
    mockSdkSearchProductsBySKU.mockResolvedValue(emptyProductsResponse);
    mockSdkSearchProductsByVariationSku.mockResolvedValue({
      searchProductsByVariationSku: [variationProduct],
    });

    const res = await POST(makePostRequest({ query: 'BA-1' }));
    const body = await res.json();
    expect(body.products.nodes[0].name).toBe('From Variation');
  });

  // ─── Results cap ─────────────────────────────────────────────────────────────

  it('caps results at 8', async () => {
    const tenProducts = Array.from({ length: 10 }, (_, i) => makeProduct(i + 1));
    mockSdkSearchProducts.mockResolvedValue({ products: { nodes: tenProducts } });

    const res = await POST(makePostRequest({ query: 'sensor' }));
    const body = await res.json();
    expect(body.products.nodes).toHaveLength(8);
  });

  // ─── Customer group filtering ─────────────────────────────────────────────────

  it('filters out products restricted to other customer groups for guests', async () => {
    // filterProductsByCustomerGroup uses title prefix parsing when no ACF fields set.
    // A product with "(ALC)" prefix is alc-restricted, not visible to end-user guest.
    const publicProduct = makeProduct(1); // END USER group
    const restrictedProduct = {
      ...makeProduct(2),
      name: '(ALC) Restricted Product',
      customerGroup1: null,
      customerGroup2: null,
      customerGroup3: null,
    };

    mockSdkSearchProducts.mockResolvedValue({
      products: { nodes: [publicProduct, restrictedProduct] },
    });

    const res = await POST(makePostRequest({ query: 'sensor' }));
    const body = await res.json();

    const ids = body.products.nodes.map((p: { id: string }) => p.id);
    expect(ids).toContain('prod-1');
    expect(ids).not.toContain('prod-2');
  });

  // ─── Server errors ────────────────────────────────────────────────────────────

  it('returns 500 when GraphQL throws', async () => {
    mockSdkSearchProducts.mockRejectedValue(new Error('GraphQL error'));

    const res = await POST(makePostRequest({ query: 'sensor' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/failed/i);
  });
});

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSdkSearchProducts.mockResolvedValue(emptyProductsResponse);
    mockSdkSearchProductsBySKU.mockResolvedValue(emptyProductsResponse);
    mockSdkSearchProductsByVariationSku.mockResolvedValue({
      searchProductsByVariationSku: [],
    });
  });

  it('returns empty array when ?q is too short', async () => {
    const res = await GET(makeGetRequest('x'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.products.nodes).toEqual([]);
  });

  it('calls SearchProducts for valid ?q param', async () => {
    await GET(makeGetRequest('sensor'));
    expect(mockSdkSearchProducts).toHaveBeenCalledWith({ search: 'sensor', first: 8 });
  });

  it('returns merged results for valid ?q param', async () => {
    mockSdkSearchProducts.mockResolvedValue({
      products: { nodes: [makeProduct(1)] },
    });

    const res = await GET(makeGetRequest('sensor'));
    const body = await res.json();
    expect(body.products.nodes).toHaveLength(1);
  });
});
