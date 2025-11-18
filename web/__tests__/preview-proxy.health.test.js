import { describe, it, expect, beforeEach } from 'vitest';
import { GET } from '../src/app/api/preview-proxy/health/route.js';

describe('preview-proxy health endpoint', () => {
  const origEnv = { ...process.env };
  beforeEach(() => {
    process.env = { ...origEnv };
    global.fetch = undefined;
  });

  it('returns 503 when NEXT_PUBLIC_WORDPRESS_GRAPHQL is missing', async () => {
    delete process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
    const res = await GET();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL/);
  });

  it('returns 200 when upstream responds 200', async () => {
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.com/graphql';
    global.fetch = async () => ({ ok: true, status: 200, text: async () => JSON.stringify({ data: { __typename: 'Query' } }) });
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.upstream).toBe(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL);
  });

  it('returns 502 when upstream responds non-2xx', async () => {
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://example.com/graphql';
    global.fetch = async () => ({ ok: false, status: 500, text: async () => 'server error' });
    const res = await GET();
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.status).toBe(500);
  });
});
