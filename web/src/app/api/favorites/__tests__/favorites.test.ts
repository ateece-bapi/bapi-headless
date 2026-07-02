/**
 * /api/favorites route tests
 *
 * Covers GET (fetch user favorites), POST (add), DELETE (remove).
 * Favorites are now persisted in WordPress user meta via WPGraphQL mutations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockCookiesGet } = vi.hoisted(() => ({
  mockCookiesGet: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: () => ({ get: mockCookiesGet }),
}));
vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { GET, POST, DELETE } from '../route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'test-jwt-token';
const mockFetch = vi.fn();
const originalFetch = global.fetch;

function withAuth() {
  mockCookiesGet.mockImplementation((key: string) =>
    key === 'auth_token' ? { value: VALID_TOKEN } : undefined
  );
}

function withNoAuth() {
  mockCookiesGet.mockReturnValue(undefined);
}

function mockGraphQL(data: unknown) {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ data }),
  });
}

function mockGraphQLError(message = 'GraphQL error') {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ errors: [{ message }] }),
  });
}

function mockFetchFailure() {
  mockFetch.mockResolvedValue({ ok: false, status: 503 });
}

const fakeFav = (overrides = {}) => ({
  id: 'fav-111',
  productId: 'prod-1',
  productName: 'Sensor A',
  productSlug: 'sensor-a',
  productImage: 'https://example.com/img.jpg',
  productPrice: '$99.00',
  createdAt: '2026-06-01T10:00:00.000Z',
  ...overrides,
});

function makePostRequest(body: object) {
  return new NextRequest('http://localhost/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(productId?: string) {
  const url = productId
    ? `http://localhost/api/favorites?productId=${productId}`
    : 'http://localhost/api/favorites';
  return new NextRequest(url, { method: 'DELETE' });
}

function makeGetRequest() {
  return new NextRequest('http://localhost/api/favorites', { method: 'GET' });
}

// ─── GET ─────────────────────────────────────────────────────────────────────

describe('GET /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
    withAuth();
    mockGraphQL({
      myFavorites: [
        fakeFav({ createdAt: '2026-06-01T10:00:00.000Z' }),
        fakeFav({ id: 'fav-333', productId: 'prod-3', createdAt: '2026-05-01T10:00:00.000Z' }),
      ],
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns 401 when not authenticated', async () => {
    withNoAuth();
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns empty array when myFavorites is empty', async () => {
    mockGraphQL({ myFavorites: [] });
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    expect((await res.json()).favorites).toEqual([]);
  });

  it('returns favorites from GraphQL response', async () => {
    const res = await GET(makeGetRequest());
    const { favorites } = await res.json();
    expect(favorites).toHaveLength(2);
    expect(favorites[0].id).toBe('fav-111');
    expect(favorites[1].id).toBe('fav-333');
  });

  it('returns expected favorite shape', async () => {
    const res = await GET(makeGetRequest());
    const { favorites } = await res.json();
    expect(favorites[0]).toMatchObject({
      id: expect.stringContaining('fav-'),
      productId: expect.any(String),
      productName: expect.any(String),
      productSlug: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('forwards the JWT token in the Authorization header', async () => {
    await GET(makeGetRequest());
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer ${VALID_TOKEN}` }),
      })
    );
  });

  it('returns 500 on GraphQL errors', async () => {
    mockGraphQLError('Unauthorized');
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to fetch favorites');
  });

  it('returns 500 on network failure', async () => {
    mockFetchFailure();
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(500);
  });
});

// ─── POST ────────────────────────────────────────────────────────────────────

describe('POST /api/favorites', () => {
  const validBody = {
    productId: 'prod-new',
    productName: 'New Sensor',
    productSlug: 'new-sensor',
    productImage: 'https://example.com/img.jpg',
    productPrice: '$149.00',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
    withAuth();
    mockGraphQL({
      addFavorite: {
        favorite: fakeFav({ productId: 'prod-new', productName: 'New Sensor', productSlug: 'new-sensor' }),
        alreadyExists: false,
        success: true,
      },
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns 401 when not authenticated', async () => {
    withNoAuth();
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 400 when productId is missing', async () => {
    const { productId: _, ...body } = validBody;
    const res = await POST(makePostRequest(body));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
  });

  it('returns 400 when productName is missing', async () => {
    const { productName: _, ...body } = validBody;
    const res = await POST(makePostRequest(body));
    expect(res.status).toBe(400);
  });

  it('returns 400 when productSlug is missing', async () => {
    const { productSlug: _, ...body } = validBody;
    const res = await POST(makePostRequest(body));
    expect(res.status).toBe(400);
  });

  it('returns 409 when product is already favorited', async () => {
    mockGraphQL({
      addFavorite: { favorite: fakeFav(), alreadyExists: true, success: false },
    });
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Product already in favorites');
  });

  it('returns 200 with success shape on valid POST', async () => {
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Product added to favorites');
    expect(body.favorite).toMatchObject({
      productId: 'prod-new',
      productName: 'New Sensor',
      productSlug: 'new-sensor',
    });
  });

  it('sends product fields as GraphQL mutation variables', async () => {
    await POST(makePostRequest(validBody));
    const [, options] = mockFetch.mock.calls[0];
    const { variables } = JSON.parse(options.body as string);
    expect(variables.input).toMatchObject({
      productId: 'prod-new',
      productName: 'New Sensor',
      productSlug: 'new-sensor',
    });
  });

  it('returns 500 on GraphQL errors', async () => {
    mockGraphQLError('Internal error');
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to add to favorites');
  });

  it('returns 500 on network failure', async () => {
    mockFetchFailure();
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(500);
  });
});

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe('DELETE /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
    withAuth();
    mockGraphQL({
      removeFavorite: { success: true, notFound: false },
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns 401 when not authenticated', async () => {
    withNoAuth();
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 400 when productId query param is missing', async () => {
    const res = await DELETE(makeDeleteRequest());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Product ID required');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 404 when favorite is not found', async () => {
    mockGraphQL({ removeFavorite: { success: false, notFound: true } });
    const res = await DELETE(makeDeleteRequest('prod-does-not-exist'));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe('Favorite not found');
  });

  it('returns 200 with success shape when favorite removed', async () => {
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Product removed from favorites');
  });

  it('sends productId as GraphQL mutation variable', async () => {
    await DELETE(makeDeleteRequest('prod-1'));
    const [, options] = mockFetch.mock.calls[0];
    const { variables } = JSON.parse(options.body as string);
    expect(variables.input.productId).toBe('prod-1');
  });

  it('returns 500 on GraphQL errors', async () => {
    mockGraphQLError('Internal error');
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to remove from favorites');
  });

  it('returns 500 on network failure', async () => {
    mockFetchFailure();
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(500);
  });
});

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockGetServerAuth, mockExistsSync, mockWriteFile, mockMkdir, mockReadFile } =
  vi.hoisted(() => ({
    mockGetServerAuth: vi.fn(),
    mockExistsSync: vi.fn(),
    mockWriteFile: vi.fn(),
    mockMkdir: vi.fn(),
    mockReadFile: vi.fn(),
  }));

vi.mock('@/lib/auth/server', () => ({ getServerAuth: mockGetServerAuth }));
vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));
vi.mock('fs', () => ({
  default: { existsSync: mockExistsSync },
  existsSync: mockExistsSync,
}));
vi.mock('fs/promises', () => ({
  default: { writeFile: mockWriteFile, mkdir: mockMkdir, readFile: mockReadFile },
  writeFile: mockWriteFile,
  mkdir: mockMkdir,
  readFile: mockReadFile,
}));

