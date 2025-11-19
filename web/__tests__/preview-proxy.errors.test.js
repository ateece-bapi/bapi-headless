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
    // We normalize upstream non-2xx responses to 502 to avoid leaking upstream
    // internals to callers.
    expect(res.status).toBe(502);
  });

  it('returns 502 on upstream network/fetch error', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.test/graphql';

    const fetchMock = vi.fn(async () => {
      throw new Error('network failure');
    });

    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
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

  it('returns 502 on upstream timeout', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.test/graphql';
    // make timeout short for test
    process.env.PREVIEW_FETCH_TIMEOUT_MS = '20';

    // fetch mock that listens for abort and rejects with an AbortError
    const fetchMock = vi.fn((url, options) => new Promise((resolve, reject) => {
      const signal = options && options.signal;
      if (signal) {
        if (signal.aborted) return reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      }
      // never resolve -> simulate a hung upstream
    }));

    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
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
