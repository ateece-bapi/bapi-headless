/**
 * /api/chat/handoff route tests
 *
 * Covers:
 * - POST: 400 for missing required fields, 400 for invalid email, 200 success shape,
 *   persists to file, sends email notification, 500 on error
 * - GET: 401 unauthenticated, 403 non-admin, returns sorted handoffs, 500 on error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const {
  mockRequireAdmin,
  mockWriteFile,
  mockMkdir,
  mockReadFile,
  mockAccess,
  mockSendChatHandoffNotification,
} = vi.hoisted(() => ({
  mockRequireAdmin: vi.fn(),
  mockWriteFile: vi.fn(),
  mockMkdir: vi.fn(),
  mockReadFile: vi.fn(),
  mockAccess: vi.fn(),
  mockSendChatHandoffNotification: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  requireAdmin: mockRequireAdmin,
}));

// The handoff route uses `import { promises as fs } from 'fs'`
// so we mock the `promises` property of the 'fs' module
vi.mock('fs', () => ({
  default: {
    promises: {
      writeFile: mockWriteFile,
      mkdir: mockMkdir,
      readFile: mockReadFile,
      access: mockAccess,
    },
  },
  promises: {
    writeFile: mockWriteFile,
    mkdir: mockMkdir,
    readFile: mockReadFile,
    access: mockAccess,
  },
}));

vi.mock('@/lib/email', () => ({
  sendChatHandoffNotification: mockSendChatHandoffNotification,
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { POST, GET } from '../handoff/route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_BODY = {
  name: 'Jane Engineer',
  email: 'jane@acme.com',
  topic: 'technical' as const,
  message: 'Need help selecting a duct sensor for 40°C environments.',
  language: 'en',
};

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/chat/handoff', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeGet() {
  return new NextRequest('http://localhost/api/chat/handoff');
}

function setupEmptyHandoffs() {
  mockMkdir.mockResolvedValue(undefined);
  // access resolves → file exists, no need to create
  mockAccess.mockResolvedValue(undefined);
  mockReadFile.mockResolvedValue(JSON.stringify({ handoffs: [] }));
  mockWriteFile.mockResolvedValue(undefined);
  mockSendChatHandoffNotification.mockResolvedValue({ success: true, messageId: 'msg-1' });
}

// ─── POST tests ───────────────────────────────────────────────────────────────

describe('POST /api/chat/handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupEmptyHandoffs();
  });

  it.each([
    [{ ...VALID_BODY, name: undefined }, 'name'],
    [{ ...VALID_BODY, email: undefined }, 'email'],
    [{ ...VALID_BODY, topic: undefined }, 'topic'],
    [{ ...VALID_BODY, message: undefined }, 'message'],
  ] as const)('returns 400 when %s field is missing', async (body) => {
    const req = makePost(body);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing required fields/);
  });

  it('returns 400 when email format is invalid', async () => {
    const req = makePost({ ...VALID_BODY, email: 'not-an-email' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid email/);
  });

  it('returns 200 with handoffId on success', async () => {
    const req = makePost(VALID_BODY);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(typeof json.handoffId).toBe('string');
    expect(json.handoffId).toMatch(/^handoff-/);
  });

  it('persists handoff with status "pending" to file', async () => {
    const req = makePost(VALID_BODY);
    await POST(req);

    expect(mockWriteFile).toHaveBeenCalled();
    const writtenContent = JSON.parse(mockWriteFile.mock.calls[0][1] as string);
    expect(writtenContent.handoffs).toHaveLength(1);
    expect(writtenContent.handoffs[0].status).toBe('pending');
    expect(writtenContent.handoffs[0].name).toBe('Jane Engineer');
    expect(writtenContent.handoffs[0].email).toBe('jane@acme.com');
  });

  it('sends email notification', async () => {
    const req = makePost(VALID_BODY);
    await POST(req);
    expect(mockSendChatHandoffNotification).toHaveBeenCalledOnce();
  });

  it('accepts optional phone and conversationContext', async () => {
    const req = makePost({
      ...VALID_BODY,
      phone: '+1-555-1234',
      conversationContext: 'User: Hello\nAssistant: Hi there',
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const written = JSON.parse(mockWriteFile.mock.calls[0][1] as string);
    expect(written.handoffs[0].phone).toBe('+1-555-1234');
  });

  it('creates data dir when it does not exist yet', async () => {
    // access rejects → file does not exist, should write new file
    mockAccess.mockRejectedValue(new Error('ENOENT'));
    const req = makePost(VALID_BODY);
    await POST(req);
    // mkdir should be called for ensure
    expect(mockMkdir).toHaveBeenCalled();
  });

  it('returns 500 when writeFile throws', async () => {
    mockWriteFile.mockRejectedValue(new Error('disk full'));
    const req = makePost(VALID_BODY);
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

// ─── GET tests ────────────────────────────────────────────────────────────────

describe('GET /api/chat/handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({ id: 'admin-1' });
    mockMkdir.mockResolvedValue(undefined);
    mockAccess.mockResolvedValue(undefined);
  });

  it('returns 401 when user is not authenticated', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Unauthorized: Not authenticated'));
    const res = await GET(makeGet());
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('Forbidden: Admin access required'));
    const res = await GET(makeGet());
    expect(res.status).toBe(403);
  });

  it('returns handoffs sorted newest-first', async () => {
    const HANDOFFS = [
      { id: 'h1', timestamp: '2026-06-10T10:00:00Z', status: 'pending' },
      { id: 'h2', timestamp: '2026-06-19T12:00:00Z', status: 'pending' },
      { id: 'h3', timestamp: '2026-06-15T08:00:00Z', status: 'contacted' },
    ];
    mockReadFile.mockResolvedValue(JSON.stringify({ handoffs: HANDOFFS }));

    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.handoffs[0].id).toBe('h2');
    expect(json.handoffs[1].id).toBe('h3');
    expect(json.handoffs[2].id).toBe('h1');
  });

  it('returns empty array when no handoffs on file', async () => {
    mockReadFile.mockResolvedValue(JSON.stringify({ handoffs: [] }));
    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.handoffs).toEqual([]);
  });

  // Note: readHandoffs() silently catches file-read errors and returns []
  // The only way to reach the catch block in GET is a non-auth error from requireAdmin
  it('returns 500 on unexpected non-auth error', async () => {
    mockRequireAdmin.mockRejectedValue(new Error('DB connection lost'));
    const res = await GET(makeGet());
    expect(res.status).toBe(500);
  });
});
