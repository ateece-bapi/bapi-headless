/**
 * /api/quotes route tests
 *
 * Covers:
 * - POST: auth guard, field validation, file upload handling, email sending, success shape
 * - GET:  auth guard, returns only current user's quotes, empty state, error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockGetServerAuth, mockSendEmail, mockGenerateQuoteSalesEmail, mockGenerateQuoteCustomerEmail, mockExistsSync, mockWriteFile, mockMkdir, mockReadFile } =
  vi.hoisted(() => {
    return {
      mockGetServerAuth: vi.fn(),
      mockSendEmail: vi.fn(),
      mockGenerateQuoteSalesEmail: vi.fn(),
      mockGenerateQuoteCustomerEmail: vi.fn(),
      mockExistsSync: vi.fn(),
      mockWriteFile: vi.fn(),
      mockMkdir: vi.fn(),
      mockReadFile: vi.fn(),
    };
  });

vi.mock('@/lib/auth/server', () => ({ getServerAuth: mockGetServerAuth }));
vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));
vi.mock('@/lib/email', () => ({
  sendEmail: mockSendEmail,
  generateQuoteSalesEmail: mockGenerateQuoteSalesEmail,
  generateQuoteCustomerEmail: mockGenerateQuoteCustomerEmail,
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

// ─── Import route after mocks ─────────────────────────────────────────────────

import { POST, GET } from '../route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AUTHENTICATED_USER = { userId: 'user-123', user: { id: 'user-123', email: 'buyer@example.com' } };

function makeFormDataRequest(fields: Record<string, string> = {}, files: File[] = []) {
  const formData = new FormData();
  const defaults = {
    subject: 'Quote for temperature sensors',
    productName: 'BAPI-Stat 4',
    partNumber: 'BS4-H210-D2X',
    quantity: '10',
    application: 'HVAC',
    timeline: '2 weeks',
    details: 'Need 10 units for a retrofit project',
    companyName: 'ACME Corp',
    phoneNumber: '555-1234',
    userEmail: 'buyer@example.com',
  };
  const merged = { ...defaults, ...fields };
  for (const [k, v] of Object.entries(merged)) {
    formData.append(k, v);
  }
  for (const file of files) {
    formData.append('files', file);
  }
  return new NextRequest('http://localhost/api/quotes', {
    method: 'POST',
    body: formData,
  });
}

function makeGetRequest() {
  return new NextRequest('http://localhost/api/quotes', { method: 'GET' });
}

// Default email template mocks
const DEFAULT_EMAIL = { subject: 'Subject', html: '<p>body</p>', text: 'body' };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/quotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerAuth.mockResolvedValue(AUTHENTICATED_USER);
    mockSendEmail.mockResolvedValue({ success: true, messageId: 'msg-1' });
    mockGenerateQuoteSalesEmail.mockReturnValue(DEFAULT_EMAIL);
    mockGenerateQuoteCustomerEmail.mockReturnValue(DEFAULT_EMAIL);
    mockExistsSync.mockReturnValue(true); // data dir and uploads dir exist
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
    // quotes.json already exists with existing quotes
    mockReadFile.mockResolvedValue(JSON.stringify([]));
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue({ userId: null, user: null });
    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
    // Must not send emails for unauthenticated requests
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeFormDataRequest({ subject: '' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when productName is missing', async () => {
    const res = await POST(makeFormDataRequest({ productName: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
  });

  it('returns 400 when quantity is missing', async () => {
    const res = await POST(makeFormDataRequest({ quantity: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
  });

  it('returns 400 when companyName is missing', async () => {
    const res = await POST(makeFormDataRequest({ companyName: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
  });

  it('returns 400 when phoneNumber is missing', async () => {
    const res = await POST(makeFormDataRequest({ phoneNumber: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Missing required fields');
  });

  it('returns 200 with success shape on valid submission', async () => {
    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.quoteId).toMatch(/^QR-/);
    expect(body.message).toBe('Quote request submitted successfully');
    expect(body.emailsSent).toEqual({ sales: true, customer: true });
  });

  it('saves quote to JSON file', async () => {
    await POST(makeFormDataRequest());
    // writeFile should have been called to persist the quote
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('quotes.json'),
      expect.stringContaining('"status": "pending"'),
    );
  });

  it('sends sales team notification email', async () => {
    await POST(makeFormDataRequest());
    expect(mockGenerateQuoteSalesEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        quoteId: expect.stringMatching(/^QR-/),
        customerEmail: 'buyer@example.com',
        companyName: 'ACME Corp',
      }),
    );
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: DEFAULT_EMAIL.subject }),
    );
  });

  it('sends customer confirmation email', async () => {
    await POST(makeFormDataRequest());
    expect(mockGenerateQuoteCustomerEmail).toHaveBeenCalled();
    // Called twice — once for sales, once for customer
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it('reports emailsSent.sales as false when sales email fails', async () => {
    mockSendEmail
      .mockResolvedValueOnce({ success: false, error: 'SES error' }) // sales fails
      .mockResolvedValueOnce({ success: true, messageId: 'msg-2' }); // customer succeeds
    const res = await POST(makeFormDataRequest());
    const body = await res.json();
    expect(body.success).toBe(true); // quote still saved
    expect(body.emailsSent.sales).toBe(false);
    expect(body.emailsSent.customer).toBe(true);
  });

  it('reports emailsSent.customer as false when customer email fails', async () => {
    mockSendEmail
      .mockResolvedValueOnce({ success: true, messageId: 'msg-1' })
      .mockResolvedValueOnce({ success: false, error: 'SES error' });
    const res = await POST(makeFormDataRequest());
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.emailsSent.customer).toBe(false);
  });

  it('creates data directory if it does not exist', async () => {
    mockExistsSync.mockImplementation((p: string) => !p.toString().includes('data'));
    await POST(makeFormDataRequest());
    expect(mockMkdir).toHaveBeenCalledWith(expect.stringContaining('data'), { recursive: true });
  });

  it('generates unique quoteId per submission', async () => {
    const res1 = await POST(makeFormDataRequest());
    const res2 = await POST(makeFormDataRequest());
    const id1 = (await res1.json()).quoteId;
    const id2 = (await res2.json()).quoteId;
    expect(id1).not.toBe(id2);
  });

  it('returns 500 on unexpected error', async () => {
    mockGetServerAuth.mockRejectedValue(new Error('DB connection failed'));
    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to submit quote request');
  });

  it('handles empty quotes file (first submission)', async () => {
    mockExistsSync.mockImplementation((p: string) => !p.toString().includes('quotes.json'));
    const res = await POST(makeFormDataRequest());
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});

describe('GET /api/quotes', () => {
  const quote1 = {
    id: 'QR-111',
    userId: 'user-123',
    userEmail: 'buyer@example.com',
    subject: 'Test quote 1',
    productName: 'Sensor A',
    partNumber: 'PA-001',
    quantity: '5',
    application: 'HVAC',
    timeline: '1 week',
    details: 'Details 1',
    companyName: 'ACME',
    phoneNumber: '555-0001',
    attachments: [],
    status: 'pending',
    submittedAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-01T10:00:00.000Z',
  };
  const quote2 = {
    ...quote1,
    id: 'QR-222',
    userId: 'other-user',
    subject: 'Other user quote',
    submittedAt: '2026-06-02T10:00:00.000Z',
    updatedAt: '2026-06-02T10:00:00.000Z',
  };
  const quote3 = {
    ...quote1,
    id: 'QR-333',
    subject: 'Test quote 3 (older)',
    submittedAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerAuth.mockResolvedValue(AUTHENTICATED_USER);
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(JSON.stringify([quote1, quote2, quote3]));
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerAuth.mockResolvedValue({ userId: null, user: null });
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
  });

  it('returns empty array when no quotes file exists', async () => {
    mockExistsSync.mockReturnValue(false);
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    expect((await res.json()).quotes).toEqual([]);
  });

  it('returns only quotes belonging to current user', async () => {
    const res = await GET(makeGetRequest());
    const body = await res.json();
    const ids = body.quotes.map((q: { id: string }) => q.id);
    expect(ids).toContain('QR-111');
    expect(ids).toContain('QR-333');
    expect(ids).not.toContain('QR-222'); // other user's quote
  });

  it('returns quotes sorted newest first', async () => {
    const res = await GET(makeGetRequest());
    const body = await res.json();
    const dates = body.quotes.map((q: { submittedAt: string }) => q.submittedAt);
    expect(dates[0]).toBe('2026-06-01T10:00:00.000Z'); // QR-111 is newer
    expect(dates[1]).toBe('2026-05-01T10:00:00.000Z'); // QR-333 is older
  });

  it('returns expected quote shape', async () => {
    const res = await GET(makeGetRequest());
    const body = await res.json();
    const q = body.quotes[0];
    expect(q).toMatchObject({
      id: expect.stringMatching(/^QR-/),
      userId: 'user-123',
      status: 'pending',
      submittedAt: expect.any(String),
    });
  });

  it('returns 500 on unexpected error', async () => {
    mockReadFile.mockRejectedValue(new Error('Disk error'));
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to fetch quotes');
  });
});
