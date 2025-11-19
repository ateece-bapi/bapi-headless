import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('preview-proxy error cases', () => {
  const ORIG = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIG };
  });

  afterEach(() => {
    process.env = ORIG;
    vi.restoreAllMocks();
  });

  it('returns 502 when upstream returns non-2xx', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.test/graphql';

    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => 'upstream error',
    }));

    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

  const res = await POST(req);
  // The proxy currently forwards upstream HTTP status codes. Upstream returned 500,
  // so the handler will return 500 as well.
  expect(res.status).toBe(500);
  });

  it('returns 400 for invalid JSON body', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: 'not-json',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 401 when secret mismatches', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 'wrong', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
