'use client';

import { useEffect } from 'react';
import { initializeExchangeRates } from '@/lib/utils/currency';

/**
 * Currency Initialization Client Component
 * 
 * Fetches live exchange rates on app startup
 * Runs once per session (client-side)
 */
export function CurrencyInitializer() {
  useEffect(() => {
    // Initialize exchange rates from API
    initializeExchangeRates();
  }, []);

  return null; // No visual output
}
