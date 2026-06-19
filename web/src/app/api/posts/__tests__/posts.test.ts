/**
 * /api/posts route tests
 *
 * Covers:
 * - POST: success with default perPage, custom perPage, cursor pagination, clamps large perPage, 500 error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockGetPosts } = vi.hoisted(() => ({
  mockGetPosts: vi.fn(),
}));

vi.mock('@/lib/wordpress', () => ({
  getPosts: mockGetPosts,
}));

import { POST } from '../route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_POSTS = [{ id: 1, title: 'Post One' }, { id: 2, title: 'Post Two' }];
const MOCK_PAGE_INFO = { hasNextPage: true, endCursor: 'cursor-abc' };

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/posts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPosts.mockResolvedValue({ posts: MOCK_POSTS, pageInfo: MOCK_PAGE_INFO });
  });

  it('returns posts with default perPage of 12', async () => {
    const req = makePost({});
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.posts).toEqual(MOCK_POSTS);
    expect(json.pageInfo).toEqual(MOCK_PAGE_INFO);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 12, after: undefined });
  });

  it('passes custom perPage to getPosts', async () => {
    const req = makePost({ perPage: 24 });
    await POST(req);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 24, after: undefined });
  });

  it('passes after cursor for pagination', async () => {
    const req = makePost({ perPage: 12, after: 'cursor-abc' });
    await POST(req);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 12, after: 'cursor-abc' });
  });

  it('clamps perPage to max 100', async () => {
    const req = makePost({ perPage: 999 });
    await POST(req);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 100, after: undefined });
  });

  // perPage: 0 is falsy so `Number(0) || 12` evaluates to 12 (not 0)
  it('treats perPage 0 as falsy — defaults to 12', async () => {
    const req = makePost({ perPage: 0 });
    await POST(req);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 12, after: undefined });
  });

  it('handles non-numeric perPage gracefully (defaults to 12)', async () => {
    const req = makePost({ perPage: 'lots' });
    await POST(req);
    expect(mockGetPosts).toHaveBeenCalledWith({ perPage: 12, after: undefined });
  });

  it('returns 500 when getPosts throws', async () => {
    mockGetPosts.mockRejectedValue(new Error('GraphQL error'));
    const req = makePost({});
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
