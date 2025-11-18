import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('preview-proxy POST handler', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.restoreAllMocks();
  });

  it('injects Basic Auth when PREVIEW_USER and PREVIEW_APP_PASSWORD are set', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.PREVIEW_USER = 'testuser';
    process.env.PREVIEW_APP_PASSWORD = 'apppass';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.test/graphql';

    const fetchMock = vi.fn(async (_, opts) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: { __typename: 'RootQuery' } }),
        text: async () => JSON.stringify({ data: { __typename: 'RootQuery' } }),
      };
    });

    vi.stubGlobal('fetch', fetchMock);

    // import the handler after stubbing fetch so modules pick up the mock
    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);

    expect(fetchMock).toHaveBeenCalled();
    const calledWith = fetchMock.mock.calls[0][1] || {};
    const headers = calledWith.headers || {};
    expect(headers.authorization || headers.Authorization).toBeDefined();
    // Basic Auth header value should start with 'Basic '
    const auth = headers.authorization || headers.Authorization;
    expect(auth.startsWith('Basic ')).toBe(true);

    // The handler should return a NextResponse-like object; check status via .status
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
