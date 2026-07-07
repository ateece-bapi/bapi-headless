#!/usr/bin/env node
/**
 * CI check: warns when the fallback exchange rates are more than 30 days old.
 * Run via: node scripts/check-exchange-rate-staleness.mjs
 * Add to your CI pipeline (e.g., GitHub Actions) as a non-blocking warning step.
 *
 * Reads the date constant from the TypeScript source as plain text so this
 * script works with plain `node` (no TS loader required).
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(
  join(__dirname, '../web/src/lib/utils/fallbackRates.ts'),
  'utf8'
);

const match = src.match(/FALLBACK_RATES_LAST_UPDATED\s*=\s*'([^']+)'/);
if (!match) {
  console.error('Could not parse FALLBACK_RATES_LAST_UPDATED from fallbackRates.ts');
  process.exit(1);
}

const FALLBACK_RATES_LAST_UPDATED = match[1];
const STALE_DAYS = 30;

const lastUpdated = new Date(FALLBACK_RATES_LAST_UPDATED);
const now = new Date();
const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

if (diffDays > STALE_DAYS) {
  console.warn(
    `\n⚠️  Exchange rate fallback is ${diffDays} days old (threshold: ${STALE_DAYS} days).` +
    `\n   Last updated: ${FALLBACK_RATES_LAST_UPDATED}` +
    `\n   Update FALLBACK_RATES and FALLBACK_RATES_LAST_UPDATED in web/src/lib/utils/fallbackRates.ts\n`
  );
  // Exit 0 so CI is non-blocking (warning only). Change to process.exit(1) to make it blocking.
  process.exit(0);
} else {
  console.log(`✅ Exchange rate fallback is current (${diffDays} days old).`);
}
