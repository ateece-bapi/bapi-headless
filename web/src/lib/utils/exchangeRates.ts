/**
 * Live exchange rate fetcher using the European Central Bank (ECB) daily XML feed.
 * Falls back to static rates when the feed is unavailable.
 *
 * ECB feed: https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
 * - Free, no API key required
 * - Updated every business day ~16:00 CET
 * - Base currency: EUR
 *
 * Next.js caching: revalidates once per day (86400 s).
 */

import { unstable_cache } from 'next/cache';
import type { CurrencyCode } from '@/types/region';

/** Fallback static rates (USD base). Update manually if ECB feed is unavailable. */
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  PLN: 3.98,
  AED: 3.67,
};

/**
 * Date the fallback rates were last manually verified.
 * CI will warn when this is more than 30 days old.
 */
export const FALLBACK_RATES_LAST_UPDATED = '2026-07-07';

/** Cache tag used for on-demand revalidation via /api/revalidate */
export const EXCHANGE_RATES_CACHE_TAG = 'exchange-rates';

/** Currencies we need (ECB rates are EUR-based; we convert to USD base). */
const NEEDED_CURRENCIES: Exclude<CurrencyCode, 'USD'>[] = ['EUR', 'GBP', 'PLN', 'AED'];

interface EcbRates {
  /** EUR-based rates, e.g. { USD: 1.08, GBP: 0.86, ... } */
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

    // Parse <Cube currency="USD" rate="1.0836"/>  entries
    const rateRegex = /<Cube currency="([A-Z]{3})" rate="([\d.]+)"\/>/g;
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
 */
export const getLiveExchangeRates = unstable_cache(
  async (): Promise<Record<CurrencyCode, number>> => {
    const ecbRates = await fetchEcbRates();

    if (!ecbRates || !ecbRates['USD']) {
      // ECB feed unavailable — use fallback
      return FALLBACK_RATES;
    }

    // ECB base = EUR. Convert to USD base:
    // rate_USD_base(X) = ecbRate(X) / ecbRate(USD)
    const usdPerEur = ecbRates['USD']; // how many USD per 1 EUR

    const result: Partial<Record<CurrencyCode, number>> = { USD: 1.0 };

    for (const currency of NEEDED_CURRENCIES) {
      const ecbRate = ecbRates[currency]; // units of `currency` per 1 EUR

      if (ecbRate == null) {
        // Currency missing from feed — fall back for this one
        result[currency] = FALLBACK_RATES[currency];
        continue;
      }

      // X per USD = (X per EUR) / (USD per EUR)
      result[currency] = ecbRate / usdPerEur;
    }

    return result as Record<CurrencyCode, number>;
  },
  ['ecb-exchange-rates'],
  { revalidate: 86400, tags: [EXCHANGE_RATES_CACHE_TAG] }
);
