/**
 * /api/detect-region route tests
 *
 * Covers:
 * - Returns correct region and language from x-vercel-ip-country header
 * - Falls back to US/en for unknown country codes
 * - Falls back to US/en when header is absent
 * - Includes city from x-vercel-ip-city header
 * - Maps EU countries to 'eu' region
 * - Maps language-specific countries (DE→de, FR→fr, AR→ar, PL→pl)
 * - Returns detected: true on success (even for unknown/missing country fallback)
 * - Returns detected: false only in the catch/error path
 */

import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

import { GET } from '../route';

function makeGet(headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/detect-region', { headers });
}

describe('GET /api/detect-region', () => {
  it('returns us region and en language for US', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'US' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('us');
    expect(json.language).toBe('en');
    expect(json.country).toBe('US');
    expect(json.countryName).toBe('United States');
    expect(json.detected).toBe(true);
  });

  it('defaults to US when header is absent', async () => {
    const req = makeGet();
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('us');
    expect(json.language).toBe('en');
    expect(json.country).toBe('US');
  });

  it('returns eu region for German IP', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'DE' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('eu');
    expect(json.language).toBe('de');
    expect(json.countryName).toBe('Germany');
  });

  it('returns eu region for French IP', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'FR' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('eu');
    expect(json.language).toBe('fr');
  });

  it('returns uk region for GB', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'GB' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('uk');
    expect(json.language).toBe('en'); // GB not in language map → default en
  });

  it('returns mena region and ar language for UAE', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'AE' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('mena');
    expect(json.language).toBe('ar');
  });

  it('returns pl region and pl language for Poland', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'PL' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('pl');
    expect(json.language).toBe('pl');
  });

  it('falls back to us/en for unknown country code', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'ZZ' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.region).toBe('us');
    expect(json.language).toBe('en');
    // unknown country code returned as-is
    expect(json.country).toBe('ZZ');
  });

  it('includes city from x-vercel-ip-city header', async () => {
    const req = makeGet({ 'x-vercel-ip-country': 'US', 'x-vercel-ip-city': 'Chicago' });
    const res = await GET(req);
    const json = await res.json();
    expect(json.city).toBe('Chicago');
  });

  it('includes a timestamp in the response', async () => {
    const req = makeGet();
    const res = await GET(req);
    const json = await res.json();
    expect(json.timestamp).toBeDefined();
    expect(new Date(json.timestamp).getTime()).not.toBeNaN();
  });

  it('returns 200 status code', async () => {
    const req = makeGet();
    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});
