/**
 * /api/favorites route tests
 *
 * Covers GET (fetch user favorites), POST (add), DELETE (remove)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

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

import { GET, POST, DELETE } from '../route';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const AUTH = { userId: 'user-abc', user: { id: 'user-abc', email: 'test@example.com' } };
const NO_AUTH = { userId: null, user: null };

const favUser = (overrides = {}) => ({
  id: 'fav-111',
  userId: 'user-abc',
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
    mockGetServerAuth.mockResolvedValue(AUTH);
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(
      JSON.stringify([
        favUser({ createdAt: '2026-06-01T10:00:00.000Z' }),
        favUser({ id: 'fav-222', userId: 'other-user', productId: 'prod-2' }),
        favUser({ id: 'fav-333', productId: 'prod-3', createdAt: '2026-05-01T10:00:00.000Z' }),
      ]),
    );
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue(NO_AUTH);
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
  });

  it('returns empty array when no favorites file exists', async () => {
    mockExistsSync.mockReturnValue(false);
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    expect((await res.json()).favorites).toEqual([]);
  });

  it('returns only favorites belonging to current user', async () => {
    const res = await GET(makeGetRequest());
    const { favorites } = await res.json();
    const ids = favorites.map((f: { id: string }) => f.id);
    expect(ids).toContain('fav-111');
    expect(ids).toContain('fav-333');
    expect(ids).not.toContain('fav-222'); // other user
  });

  it('returns favorites sorted newest first', async () => {
    const res = await GET(makeGetRequest());
    const { favorites } = await res.json();
    expect(favorites[0].createdAt).toBe('2026-06-01T10:00:00.000Z');
    expect(favorites[1].createdAt).toBe('2026-05-01T10:00:00.000Z');
  });

  it('returns expected favorite shape', async () => {
    const res = await GET(makeGetRequest());
    const { favorites } = await res.json();
    expect(favorites[0]).toMatchObject({
      id: expect.stringContaining('fav-'),
      userId: 'user-abc',
      productId: expect.any(String),
      productName: expect.any(String),
      productSlug: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockReadFile.mockRejectedValue(new Error('Disk error'));
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to fetch favorites');
  });
});

// ─── POST ────────────────────────────────────────────────────────────────────

describe('POST /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerAuth.mockResolvedValue(AUTH);
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(JSON.stringify([]));
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
  });

  const validBody = {
    productId: 'prod-new',
    productName: 'New Sensor',
    productSlug: 'new-sensor',
    productImage: 'https://example.com/img.jpg',
    productPrice: '$149.00',
  };

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue(NO_AUTH);
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
    expect(mockWriteFile).not.toHaveBeenCalled();
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
    mockReadFile.mockResolvedValue(
      JSON.stringify([favUser({ productId: 'prod-new', userId: 'user-abc' })]),
    );
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Product already in favorites');
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('returns 200 with success shape on valid POST', async () => {
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Product added to favorites');
    expect(body.favorite).toMatchObject({
      id: expect.stringMatching(/^fav-/),
      userId: 'user-abc',
      productId: 'prod-new',
      productName: 'New Sensor',
      productSlug: 'new-sensor',
    });
  });

  it('persists the new favorite to disk', async () => {
    await POST(makePostRequest(validBody));
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('favorites.json'),
      expect.stringContaining('"productId": "prod-new"'),
    );
  });

  it('does not add a duplicate for a different user with the same productId', async () => {
    // Other user has same product — current user should still be able to add it
    mockReadFile.mockResolvedValue(
      JSON.stringify([favUser({ productId: 'prod-new', userId: 'other-user' })]),
    );
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(200);
  });

  it('creates data directory if it does not exist', async () => {
    mockExistsSync.mockImplementation((p: string) => !p.toString().includes('data'));
    await POST(makePostRequest(validBody));
    expect(mockMkdir).toHaveBeenCalledWith(expect.stringContaining('data'), { recursive: true });
  });

  it('returns 500 on unexpected error', async () => {
    mockGetServerAuth.mockRejectedValue(new Error('DB down'));
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to add to favorites');
  });
});

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe('DELETE /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerAuth.mockResolvedValue(AUTH);
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(
      JSON.stringify([favUser({ productId: 'prod-1', userId: 'user-abc' })]),
    );
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue(NO_AUTH);
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('returns 400 when productId query param is missing', async () => {
    const res = await DELETE(makeDeleteRequest());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Product ID required');
  });

  it('returns 404 when favorite is not found for this user', async () => {
    const res = await DELETE(makeDeleteRequest('prod-does-not-exist'));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe('Favorite not found');
  });

  it('returns 404 when productId belongs to a different user', async () => {
    mockReadFile.mockResolvedValue(
      JSON.stringify([favUser({ productId: 'prod-1', userId: 'other-user' })]),
    );
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(404);
  });

  it('returns 200 with success shape when favorite removed', async () => {
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Product removed from favorites');
  });

  it('removes only the matched favorite from the file', async () => {
    // Two favorites for this user — only remove prod-1
    mockReadFile.mockResolvedValue(
      JSON.stringify([
        favUser({ id: 'fav-111', productId: 'prod-1', userId: 'user-abc' }),
        favUser({ id: 'fav-222', productId: 'prod-2', userId: 'user-abc' }),
      ]),
    );
    await DELETE(makeDeleteRequest('prod-1'));
    const written = mockWriteFile.mock.calls[0][1] as string;
    expect(written).not.toContain('"prod-1"');
    expect(written).toContain('"prod-2"');
  });

  it('returns 500 on unexpected error', async () => {
    mockReadFile.mockRejectedValue(new Error('Disk error'));
    const res = await DELETE(makeDeleteRequest('prod-1'));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to remove from favorites');
  });
});
