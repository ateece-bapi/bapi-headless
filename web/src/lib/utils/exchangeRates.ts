/**
 * Live exchange rate fetcher using the European Central Bank (ECB) daily XML feed.
 * Falls back to static rates when the feed is unavailable.
 *
 * ECB feed: https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
 * - Free, no API key required
 * - Updated every business day ~16:00 CET
 * - Base currency: EUR (no EUR entry in the feed itself)
 *
 * Next.js caching: revalidates once per day (86400 s).
 *
 * SERVER-ONLY — imports next/cache. Do not import from client components.
 * Client-side code should use FALLBACK_RATES from `./fallbackRates`.
 */

import { unstable_cache } from 'next/cache';
import type { CurrencyCode } from '@/types/region';
import { FALLBACK_RATES, FALLBACK_RATES_LAST_UPDATED } from './fallbackRates';

export { FALLBACK_RATES, FALLBACK_RATES_LAST_UPDATED };

/** Cache tag used for on-demand revalidation via /api/revalidate */
export const EXCHANGE_RATES_CACHE_TAG = 'exchange-rates';

/**
 * Non-EUR currencies we need from the feed.
 * EUR is not listed in the feed (it is the base); we derive it from USD/EUR.
 */
const NEEDED_CURRENCIES: Exclude<CurrencyCode, 'USD' | 'EUR'>[] = ['GBP', 'PLN', 'AED'];

interface EcbRates {
  /** EUR-based rates returned by the feed, e.g. { USD: 1.08, GBP: 0.86, ... } */
  [currency: string]: number;
}

async function fetchEcbRates(): Promise<EcbRates | null> {
  try {
    const res = await fetch(
      'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
      { next: { revalidate: 86400, tags: [EXCHANGE_RATES_CACHE_TAG] } }
    );

    if (!res.ok) return null;

    const xml = await res.text();

    // ECB XML uses single-quoted attributes, e.g.:
    //   <Cube currency='USD' rate='1.0836'/>
    // The regex accepts both single and double quotes for robustness.
    const rateRegex = /<Cube currency=['"]([A-Z]{3})['"] rate=['"]([0-9.]+)['"]\s*\/>/g;
    const rates: EcbRates = {};
    let match: RegExpExecArray | null;

    while ((match = rateRegex.exec(xml)) !== null) {
      rates[match[1]] = parseFloat(match[2]);
    }

    return Object.keys(rates).length > 0 ? rates : null;
  } catch {
    return null;
  }
}

/**
 * Returns USD-based exchange rates, fetched from the ECB daily feed.
 * Results are cached server-side for 24 hours.
 *
 * EUR is derived as: EUR per USD = 1 / (USD per EUR from feed).
 */
export const getLiveExchangeRates = unstable_cache(
  async (): Promise<Record<CurrencyCode, number>> => {
    const ecbRates = await fetchEcbRates();

    if (!ecbRates || !ecbRates['USD']) {
      // ECB feed unavailable — use fallback
      return FALLBACK_RATES;
    }

    // ECB base = EUR.
    // ecbRates['USD'] = number of USD per 1 EUR
    const usdPerEur = ecbRates['USD'];

    const result: Partial<Record<CurrencyCode, number>> = {
      USD: 1.0,
      // EUR is not in the feed (it IS the base). Derive: EUR per USD = 1 / (USD per EUR)
      EUR: 1 / usdPerEur,
    };

    for (const currency of NEEDED_CURRENCIES) {
      const ecbRate = ecbRates[currency]; // units of `currency` per 1 EUR

      if (ecbRate == null) {
        // Currency missing from feed — fall back for this one
        result[currency] = FALLBACK_RATES[currency];
        continue;
      }

      // currency-per-USD = (currency-per-EUR) / (USD-per-EUR)
      result[currency] = ecbRate / usdPerEur;
    }

    return result as Record<CurrencyCode, number>;
  },
  ['ecb-exchange-rates'],
  { revalidate: 86400, tags: [EXCHANGE_RATES_CACHE_TAG] }
);

