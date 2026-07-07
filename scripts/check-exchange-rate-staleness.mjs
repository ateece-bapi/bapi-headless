#!/usr/bin/env node
/**
 * CI check: warns when the fallback exchange rates in exchangeRates.ts are more than 30 days old.
 * Run via: node scripts/check-exchange-rate-staleness.mjs
 * Add to your CI pipeline (e.g., GitHub Actions) as a non-blocking warning step.
 */

import { FALLBACK_RATES_LAST_UPDATED } from '../web/src/lib/utils/exchangeRates.ts';

const STALE_DAYS = 30;

const lastUpdated = new Date(FALLBACK_RATES_LAST_UPDATED);
const now = new Date();
const diffMs = now - lastUpdated;
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

if (diffDays > STALE_DAYS) {
  console.warn(
    `\n⚠️  Exchange rate fallback is ${diffDays} days old (threshold: ${STALE_DAYS} days).` +
    `\n   Last updated: ${FALLBACK_RATES_LAST_UPDATED}` +
    `\n   Update FALLBACK_RATES and FALLBACK_RATES_LAST_UPDATED in web/src/lib/utils/exchangeRates.ts\n`
  );
  // Exit 0 so CI is non-blocking (warning only). Change to process.exit(1) to make it blocking.
  process.exit(0);
} else {
  console.log(`✅ Exchange rate fallback is current (${diffDays} days old).`);
}
