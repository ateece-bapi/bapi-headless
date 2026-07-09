/**
 * complexityMonitor tests
 *
 * Covers:
 * - Complexity header below threshold: logs info, no Sentry
 * - Complexity header at/above threshold: logs warn + fires Sentry warning with stable message
 * - Network error: fires Sentry captureException and rethrows
 * - URL normalisation for string, URL, and Request inputs
 * - No header present: no-op
 * - Non-numeric header value: no-op
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComplexityAwareFetch } from '../complexityMonitor';

// ── Sentry mock ──────────────────────────────────────────────────────────────
vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}));

// ── logger mock ──────────────────────────────────────────────────────────────
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeResponse(complexity: string | null, status = 200): Response {
  const headers = new Headers();
  if (complexity !== null) headers.set('x-graphql-complexity', complexity);
  return new Response('{}', { status, headers });
}

describe('createComplexityAwareFetch', () => {
  let monitoredFetch: ReturnType<typeof createComplexityAwareFetch>;

  beforeEach(() => {
    vi.unstubAllGlobals(); // ensure no fetch stub leaks from a previously-failed test
    vi.clearAllMocks();
    monitoredFetch = createComplexityAwareFetch();
  });

  // ── no header ─────────────────────────────────────────────────────────────

  it('returns the response unchanged when no complexity header is present', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse(null)));
    const res = await monitoredFetch('https://example.com/graphql');
    expect(res).toBeDefined();
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  // ── below threshold ───────────────────────────────────────────────────────

  it('logs info for a complexity value below the threshold', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('800')));
    await monitoredFetch('https://example.com/graphql');
    expect(logger.info).toHaveBeenCalledWith('GraphQL query complexity', { complexity: 800 });
    expect(logger.warn).not.toHaveBeenCalled();
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  // ── at threshold ──────────────────────────────────────────────────────────

  it('fires a Sentry warning with a stable message when complexity equals the threshold (1500)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('1500')));
    await monitoredFetch('https://example.com/graphql');

    expect(logger.warn).toHaveBeenCalledWith(
      'GraphQL complexity threshold exceeded',
      expect.objectContaining({ complexity: 1500, threshold: 1500 })
    );

    expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);
    const [message, opts] = (Sentry.captureMessage as ReturnType<typeof vi.fn>).mock.calls[0];
    // Stable message — no interpolated values
    expect(message).toBe('GraphQL complexity threshold exceeded');
    expect(opts.level).toBe('warning');
    expect(opts.extra.complexity).toBe(1500);
    expect(opts.extra.threshold).toBe(1500);
    vi.unstubAllGlobals();
  });

  it('fires a Sentry warning when complexity exceeds the threshold', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('1900')));
    await monitoredFetch('https://example.com/graphql');
    expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);
    const [message] = (Sentry.captureMessage as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(message).toBe('GraphQL complexity threshold exceeded');
    vi.unstubAllGlobals();
  });

  // ── non-numeric header ────────────────────────────────────────────────────

  it('ignores a non-numeric complexity header value', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('not-a-number')));
    await monitoredFetch('https://example.com/graphql');
    expect(logger.info).not.toHaveBeenCalled();
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  // ── network errors ────────────────────────────────────────────────────────

  it('captures network errors to Sentry and rethrows', async () => {
    const networkError = new Error('network failure');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(monitoredFetch('https://example.com/graphql')).rejects.toThrow('network failure');

    expect(Sentry.captureException).toHaveBeenCalledWith(
      networkError,
      expect.objectContaining({ tags: { type: 'graphql_network_error' } })
    );
    vi.unstubAllGlobals();
  });

  // ── URL normalisation ─────────────────────────────────────────────────────

  it('strips query params from string input URLs before logging', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('1600')));
    await monitoredFetch('https://example.com/graphql?query=foo&variables=%7B%7D');

    const [, opts] = (Sentry.captureMessage as ReturnType<typeof vi.fn>).mock.calls[0];
    // Query params (which may contain GraphQL query text) must not be logged
    expect(opts.extra.url).toBe('https://example.com/graphql');
    vi.unstubAllGlobals();
  });

  it('extracts the URL string from a URL object input', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('1600')));
    await monitoredFetch(new URL('https://example.com/graphql'));

    const [, opts] = (Sentry.captureMessage as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(typeof opts.extra.url).toBe('string');
    expect(opts.extra.url).toContain('example.com');
    vi.unstubAllGlobals();
  });

  it('extracts the URL string from a Request object input', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse('1600')));
    await monitoredFetch(new Request('https://example.com/graphql'));

    const [, opts] = (Sentry.captureMessage as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(opts.extra.url).toBe('https://example.com/graphql');
    vi.unstubAllGlobals();
  });

  it('includes URL in Sentry extra for network errors from a URL object', async () => {
    const networkError = new Error('dns failure');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(
      monitoredFetch(new URL('https://example.com/graphql'))
    ).rejects.toThrow();

    const [, opts] = (Sentry.captureException as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(typeof opts.extra.url).toBe('string');
    expect(opts.extra.url).toContain('example.com');
    vi.unstubAllGlobals();
  });
});
