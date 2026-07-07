/**
 * Tests for ECB XML parsing and USD-base rate conversion logic.
 *
 * `next/cache` is mocked so that `unstable_cache` becomes a transparent
 * pass-through, allowing us to test the inner async function directly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FALLBACK_RATES } from '../fallbackRates';

// Mock next/cache BEFORE importing the module under test.
// This makes unstable_cache(fn, ...) simply return fn, so our tests
// call the real async logic without any caching interference.
vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

// Now import the module (picks up the mocked next/cache)
import { getLiveExchangeRates } from '../exchangeRates';

// --------------------------------------------------------------------------
// ECB XML samples
// --------------------------------------------------------------------------
const ECB_XML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope>
  <gesmes:subject>Reference rates</gesmes:subject>
  <Cube>
    <Cube time='2026-07-07'>
      <Cube currency='USD' rate='1.0836'/>
      <Cube currency='GBP' rate='0.8582'/>
      <Cube currency='PLN' rate='4.3123'/>
      <Cube currency='AED' rate='3.9788'/>
      <Cube currency='JPY' rate='156.78'/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

const ECB_XML_DOUBLE_QUOTE = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope>
  <Cube>
    <Cube time="2026-07-07">
      <Cube currency="USD" rate="1.0836"/>
      <Cube currency="GBP" rate="0.8582"/>
      <Cube currency="PLN" rate="4.3123"/>
      <Cube currency="AED" rate="3.9788"/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

function mockFetch(xml: string, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, text: async () => xml })
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('getLiveExchangeRates', () => {
  it('returns FALLBACK_RATES when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));
    const rates = await getLiveExchangeRates();
    expect(rates).toEqual(FALLBACK_RATES);
  });

  it('returns FALLBACK_RATES when feed returns non-ok response', async () => {
    mockFetch('', false);
    const rates = await getLiveExchangeRates();
    expect(rates).toEqual(FALLBACK_RATES);
  });

  it('returns FALLBACK_RATES when XML contains no parseable rates', async () => {
    mockFetch('<xml>empty</xml>');
    const rates = await getLiveExchangeRates();
    expect(rates).toEqual(FALLBACK_RATES);
  });

  it('parses single-quoted ECB XML and converts to USD base correctly', async () => {
    mockFetch(ECB_XML_SAMPLE);
    const rates = await getLiveExchangeRates();

    const usdPerEur = 1.0836;

    expect(rates.USD).toBe(1.0);
    // EUR is the ECB base — not in feed. Derive: EUR per USD = 1 / usdPerEur
    expect(rates.EUR).toBeCloseTo(1 / usdPerEur, 6);
    // Other currencies: (currency-per-EUR) / (USD-per-EUR)
    expect(rates.GBP).toBeCloseTo(0.8582 / usdPerEur, 6);
    expect(rates.PLN).toBeCloseTo(4.3123 / usdPerEur, 6);
    expect(rates.AED).toBeCloseTo(3.9788 / usdPerEur, 6);
  });

  it('parses double-quoted ECB XML attributes (defensive)', async () => {
    mockFetch(ECB_XML_DOUBLE_QUOTE);
    const rates = await getLiveExchangeRates();

    expect(rates.USD).toBe(1.0);
    expect(rates.EUR).toBeCloseTo(1 / 1.0836, 6);
    expect(rates.GBP).toBeCloseTo(0.8582 / 1.0836, 6);
  });

  it('falls back per-currency when a needed currency is missing from feed', async () => {
    const xmlMissingAed = ECB_XML_SAMPLE.replace(/\s*<Cube currency='AED'[^/]*\/>\n/, '');
    mockFetch(xmlMissingAed);
    const rates = await getLiveExchangeRates();

    // AED should use static fallback
    expect(rates.AED).toBe(FALLBACK_RATES.AED);
    // GBP still uses live rate
    expect(rates.GBP).toBeCloseTo(0.8582 / 1.0836, 6);
  });

  it('returns FALLBACK_RATES when USD is missing from feed', async () => {
    const xmlMissingUsd = ECB_XML_SAMPLE.replace(/\s*<Cube currency='USD'[^/]*\/>\n/, '');
    mockFetch(xmlMissingUsd);
    const rates = await getLiveExchangeRates();
    expect(rates).toEqual(FALLBACK_RATES);
  });
});

describe('ECB XML regex', () => {
  const rateRegex = /<Cube currency=['"]([A-Z]{3})['"] rate=['"]([0-9.]+)['"]\s*\/>/g;

  it('matches single-quoted attributes', () => {
    const matches: [string, number][] = [];
    let m: RegExpExecArray | null;
    const regex = new RegExp(rateRegex.source, 'g');
    while ((m = regex.exec(ECB_XML_SAMPLE)) !== null) {
      matches.push([m[1], parseFloat(m[2])]);
    }
    expect(matches).toContainEqual(['USD', 1.0836]);
    expect(matches).toContainEqual(['GBP', 0.8582]);
    expect(matches).toContainEqual(['PLN', 4.3123]);
    expect(matches).toContainEqual(['AED', 3.9788]);
  });

  it('matches double-quoted attributes', () => {
    const matches: [string, number][] = [];
    let m: RegExpExecArray | null;
    const regex = new RegExp(rateRegex.source, 'g');
    while ((m = regex.exec(ECB_XML_DOUBLE_QUOTE)) !== null) {
      matches.push([m[1], parseFloat(m[2])]);
    }
    expect(matches).toContainEqual(['USD', 1.0836]);
    expect(matches).toContainEqual(['GBP', 0.8582]);
  });
});

