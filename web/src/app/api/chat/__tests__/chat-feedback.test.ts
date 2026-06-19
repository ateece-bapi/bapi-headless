/**
 * /api/chat/feedback route tests
 *
 * Covers:
 * - POST: 400 for missing fields, 400 for invalid feedback value, 200 success, 500 error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockUpdateChatFeedback } = vi.hoisted(() => ({
  mockUpdateChatFeedback: vi.fn(),
}));

vi.mock('@/lib/chat/analytics', () => ({
  updateChatFeedback: mockUpdateChatFeedback,
  getChatMetrics: vi.fn(),
  getRecentConversations: vi.fn(),
  getNegativeFeedbackConversations: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { POST } from '../feedback/route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/chat/feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/chat/feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateChatFeedback.mockResolvedValue(undefined);
  });

  it('returns 400 when conversationId is missing', async () => {
    const req = makePost({ feedback: 'positive' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/conversationId/);
  });

  it('returns 400 when feedback is missing', async () => {
    const req = makePost({ conversationId: 'conv-1' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/feedback/);
  });

  it('returns 400 when feedback value is invalid', async () => {
    const req = makePost({ conversationId: 'conv-1', feedback: 'meh' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/"positive" or "negative"/);
  });

  it('returns 200 on positive feedback', async () => {
    const req = makePost({ conversationId: 'conv-1', feedback: 'positive' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockUpdateChatFeedback).toHaveBeenCalledWith('conv-1', 'positive', undefined);
  });

  it('returns 200 on negative feedback with comment', async () => {
    const req = makePost({ conversationId: 'conv-2', feedback: 'negative', comment: 'Wrong answer' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateChatFeedback).toHaveBeenCalledWith('conv-2', 'negative', 'Wrong answer');
  });

  it('returns 500 when updateChatFeedback throws', async () => {
    mockUpdateChatFeedback.mockRejectedValue(new Error('DB error'));
    const req = makePost({ conversationId: 'conv-1', feedback: 'positive' });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/Failed to submit feedback/);
  });
});
