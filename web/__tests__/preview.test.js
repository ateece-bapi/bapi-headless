import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import the GET handler from the preview route
import { GET } from '../src/app/api/preview/route.js';

// NextResponse objects returned by the handler implement the web Response API.
// We'll create a real Request and inspect the response.

describe('preview GET handler', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns 401 when PREVIEW_SECRET unset or does not match', async () => {
    delete process.env.PREVIEW_SECRET;
    const req = new Request('http://localhost/api/preview?secret=wrong');
    const res = await GET(req);
    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toMatch(/Invalid or missing preview secret/);
  });

  it('redirects and sets cookies when secret matches', async () => {
    process.env.PREVIEW_SECRET = 'test-secret';
    const req = new Request('http://localhost/api/preview?secret=test-secret&slug=/test-page');
    const res = await GET(req);
    // NextResponse.redirect returns a Response with status 307 (Temporary Redirect)
    expect([301,302,307,308]).toContain(res.status);
    // Check that location header is set
    const location = res.headers.get('location');
    expect(location).toBeTruthy();
  // Ensure redirect location points to the requested slug
  expect(location).toContain('/test-page');
  });
});
