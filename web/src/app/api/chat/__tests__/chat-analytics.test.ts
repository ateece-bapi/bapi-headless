/**
 * /api/chat/analytics route tests
 *
 * Covers:
 * - GET ?view=metrics: 401 unauthenticated, 403 non-admin, returns metrics
 * - GET ?view=recent: returns conversations list
 * - GET ?view=negative-feedback: returns negative feedback conversations
 * - GET ?view=invalid: 400 invalid view param
 * - 500 on unexpected error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const {
  mockRequireAdmin,
  mockGetChatMetrics,
  mockGetRecentConversations,
  mockGetNegativeFeedback,
} = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockGetChatMetrics: vi.fn(),
  mockGetRecentConversations: vi.fn(),
  mockGetNegativeFeedback: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  requireAdmin: mockRequireAdmin,
}));

vi.mock('@/lib/chat/analytics', () => ({
  getChatMetrics: mockGetChatMetrics,
  getRecentConversations: mockGetRecentConversations,
  getNegativeFeedbackConversations: mockGetNegativeFeedback,
  updateChatFeedback: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { GET } from '../analytics/route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeGet(view?: string, limit?: string) {
  const params = new URLSearchParams();
  if (view) params.set('view', view);
  if (limit) params.set('limit', limit);
  return new NextRequest(`http://localhost/api/chat/analytics?${params.toString()}`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/chat/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Unauthorized: Not authenticated'));
    const req = makeGet('metrics');
    const res = await GET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/Authentication required/);
  });

  it('returns 403 when user is not an admin', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Forbidden: Admin access required'));
    const req = makeGet('metrics');
    const res = await GET(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toMatch(/Admin access required/);
  });

  it('returns metrics on ?view=metrics (default)', async () => {
    mockRequireAdmin.mockResolvedValue({ id: 'admin-1', roles: ['administrator'] });
    const METRICS = { totalConversations: 50, avgRating: 4.2 };
    mockGetChatMetrics.mockResolvedValue(METRICS);

    const req = makeGet(); // no view param → defaults to metrics
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(METRICS);
  });

  it('returns recent conversations on ?view=recent', async () => {
    mockRequireAdmin.mockResolvedValue({});
    const CONVOS = [{ id: 'c1' }, { id: 'c2' }];
    mockGetRecentConversations.mockResolvedValue(CONVOS);

    const req = makeGet('recent', '10');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.conversations).toEqual(CONVOS);
    expect(mockGetRecentConversations).toHaveBeenCalledWith(10);
  });

  it('uses default limit of 50 for ?view=recent', async () => {
    mockRequireAdmin.mockResolvedValue({});
    mockGetRecentConversations.mockResolvedValue([]);
    const req = makeGet('recent');
    await GET(req);
    expect(mockGetRecentConversations).toHaveBeenCalledWith(50);
  });

  it('returns negative feedback conversations on ?view=negative-feedback', async () => {
    mockRequireAdmin.mockResolvedValue({});
    const NEGATIVE = [{ id: 'n1', feedback: 'negative' }];
    mockGetNegativeFeedback.mockResolvedValue(NEGATIVE);

    const req = makeGet('negative-feedback');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.conversations).toEqual(NEGATIVE);
  });

  it('returns 400 for unrecognised view param', async () => {
    mockRequireAdmin.mockResolvedValue({});
    const req = makeGet('dashboard');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid view/);
  });

  it('returns 500 on unexpected analytics error', async () => {
    mockRequireAdmin.mockResolvedValue({});
    mockGetChatMetrics.mockRejectedValue(new Error('DB connection lost'));
    const req = makeGet('metrics');
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
