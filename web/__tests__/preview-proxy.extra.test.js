import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { POST } from '../src/app/api/preview-proxy/route.js';

const ORIGINAL_ENV = { ...process.env };

describe('preview-proxy extra coverage', () => {
  beforeEach(() => {
    // reset env and mocks
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  it('injects Basic Auth header when credentials are provided', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.PREVIEW_USER = 'bot';
    process.env.PREVIEW_APP_PASSWORD = 'p@ss';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://wp.example/graphql';

    // mock fetch to inspect headers
    const fetched = vi.fn(async (url, options) => {
      expect(options.headers.Authorization).toBeDefined();
      expect(options.headers.Authorization).toMatch(/^Basic /);
      return new Response(JSON.stringify({ data: { ok: true } }), { status: 200 });
    });

    global.fetch = fetched;

    const req = new Request('http://localhost/api/preview-proxy', {
      method: 'POST',
      headers: { 'x-preview-secret': process.env.PREVIEW_SECRET },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('data');
  });

  it('uses PREVIEW_CA_PATH to set fetch agent', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://wp.example/graphql';

    // create a temporary CA file
    const tmpDir = os.tmpdir();
    const caPath = path.join(tmpDir, `test-ca-${Date.now()}.pem`);
    fs.writeFileSync(caPath, '-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----\n');
    process.env.PREVIEW_CA_PATH = caPath;

    const fetched = vi.fn(async (url, options) => {
      // agent should be set when PREVIEW_CA_PATH exists
      expect(options.agent).toBeDefined();
      return new Response(JSON.stringify({ data: {} }), { status: 200 });
    });
    global.fetch = fetched;

    const req = new Request('http://localhost/api/preview-proxy', {
      method: 'POST',
      headers: { 'x-preview-secret': process.env.PREVIEW_SECRET },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // cleanup
    try { fs.unlinkSync(caPath); } catch {}
  });

  it('returns 400 for invalid JSON body', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://wp.example/graphql';

    // fetch should not be invoked
    const fetched = vi.fn();
    global.fetch = fetched;

    const req = new Request('http://localhost/api/preview-proxy', {
      method: 'POST',
      headers: { 'x-preview-secret': process.env.PREVIEW_SECRET },
      body: '}{ not valid json',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
    expect(fetched).not.toHaveBeenCalled();
  });

  it('times out and returns 502 when upstream fetch is aborted', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://wp.example/graphql';
    process.env.PREVIEW_FETCH_TIMEOUT_MS = '1'; // very small timeout

    // mock fetch that rejects when signal is aborted
    const fetched = vi.fn((url, options) => {
      return new Promise((resolve, reject) => {
        const sig = options.signal;
        if (sig) {
          sig.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
        // never resolve otherwise (simulate hung upstream)
      });
    });
    global.fetch = fetched;

    const req = new Request('http://localhost/api/preview-proxy', {
      method: 'POST',
      headers: { 'x-preview-secret': process.env.PREVIEW_SECRET },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json).toHaveProperty('error');
    expect(String(json.error)).toMatch(/timed out/i);
  });

  it('normalizes non-2xx upstream responses to 502', async () => {
    process.env.PREVIEW_SECRET = 's3cr3t';
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://wp.example/graphql';

    const fetched = vi.fn(async () => {
      return new Response('Internal Error', { status: 500 });
    });
    global.fetch = fetched;

    const req = new Request('http://localhost/api/preview-proxy', {
      method: 'POST',
      headers: { 'x-preview-secret': process.env.PREVIEW_SECRET },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json).toHaveProperty('upstreamStatus', 500);
  });
});
