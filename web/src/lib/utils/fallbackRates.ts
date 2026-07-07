/**
 * Static fallback exchange rates relative to USD (base currency).
 * No Next.js / server-only imports — safe for client components.
 *
 * These are used when the ECB live feed is unavailable and as the
 * client-side rate source (cart display, price conversion widgets).
 * Server-rendered components should prefer `getLiveExchangeRates()`
 * from `./exchangeRates` (server-only).
 *
 * Last manually verified: see FALLBACK_RATES_LAST_UPDATED below.
 */

import type { CurrencyCode } from '@/types/region';

export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92, // 1 USD ≈ 0.92 EUR
  GBP: 0.79, // 1 USD ≈ 0.79 GBP
  PLN: 3.98, // 1 USD ≈ 3.98 PLN
  AED: 3.67, // 1 USD ≈ 3.67 AED
};

/**
 * ISO date the fallback rates were last manually verified.
 * The CI script `scripts/check-exchange-rate-staleness.mjs` warns
 * when this is more than 30 days old.
 */
export const FALLBACK_RATES_LAST_UPDATED = '2026-07-07';
