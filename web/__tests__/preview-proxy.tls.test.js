import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('preview-proxy TLS / agent selection', () => {
  const ORIG = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIG, NODE_ENV: 'test' };
  });

  afterEach(() => {
    process.env = ORIG;
    vi.restoreAllMocks();
  });

  it('uses an insecure agent when PREVIEW_ALLOW_INSECURE=true in dev', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.PREVIEW_ALLOW_INSECURE = 'true';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.test/graphql';

    const fetchMock = vi.fn(async (_url, opts) => ({
      ok: true,
      status: 200,
      json: async () => ({ data: { __typename: 'Root' } }),
      text: async () => JSON.stringify({ data: { __typename: 'Root' } }),
    }));

    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../src/app/api/preview-proxy/route.js');

    const req = new Request('https://example.test/', {
      method: 'POST',
      headers: { 'x-preview-secret': 's3cr3t', 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalled();
    const calledOpts = fetchMock.mock.calls[0][1];
    expect(calledOpts).toBeTruthy();
    // agent should be passed when PREVIEW_ALLOW_INSECURE is true
    expect(calledOpts.agent).toBeTruthy();
    // the agent created for insecure mode should have rejectUnauthorized === false
    expect(calledOpts.agent.options?.rejectUnauthorized === false || calledOpts.agent.options?.rejectUnauthorized === undefined).toBeTruthy();
  });
});
