import { describe, it, expect } from 'vitest';

// Lightweight integration test for preview proxy health endpoint.
// This test only runs when PREVIEW_INTEGRATION_URL is provided. It is
// intentionally skipped in local dev unless you set the env var to a
// deployed preview URL to run an end-to-end check.

const INTEGRATION_URL = process.env.PREVIEW_INTEGRATION_URL;

describe('preview proxy integration (optional)', () => {
  if (!INTEGRATION_URL) {
    it.skip('integration test skipped — set PREVIEW_INTEGRATION_URL to run', () => {});
    return;
  }

  it('GET /api/preview-proxy/health returns ok', async () => {
    const healthUrl = new URL('/api/preview-proxy/health', INTEGRATION_URL).href;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(healthUrl, { method: 'GET', signal: controller.signal });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('ok');
      expect(json.ok).toBe(true);
    } finally {
      clearTimeout(timeout);
    }
  });
});
