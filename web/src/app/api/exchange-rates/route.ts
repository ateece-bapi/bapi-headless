import { NextResponse } from 'next/server';
import type { CurrencyCode } from '@/types/region';

/**
 * Exchange Rates API Route
 * 
 * Fetches current exchange rates from exchangerate-api.com
 * Cached for 24 hours to stay within free tier limits (1,500 requests/month)
 * 
 * Free tier details:
 * - 1,500 requests/month
 * - Updates daily at 00:00 UTC
 * - No API key required for standard endpoint
 * 
 * @returns Exchange rates relative to USD (base currency)
 */

interface ExchangeRateAPIResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

// Cache exchange rates for 24 hours
let cachedRates: Record<CurrencyCode, number> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * GET /api/exchange-rates
 * 
 * Returns exchange rates for all supported currencies relative to USD
 */
export async function GET() {
  try {
    // Check if we have valid cached rates
    if (
      cachedRates &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      return NextResponse.json(
        {
          rates: cachedRates,
          cached: true,
          timestamp: cacheTimestamp,
          nextUpdate: cacheTimestamp + CACHE_DURATION,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
          },
        }
      );
    }

    // Fetch fresh rates from API
    const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate-api.com/v4/latest/USD';
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data: ExchangeRateAPIResponse = await response.json();

    // Extract only the currencies we support
    const supportedCurrencies: CurrencyCode[] = [
      'USD',
      'EUR',
      'GBP',
      'JPY',
      'CNY',
      'SGD',
      'AED',
      'VND',
    ];

    const rates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>;
    
    supportedCurrencies.forEach((currency) => {
      rates[currency] = data.conversion_rates[currency] || 1.0;
    });

    // Update cache
    cachedRates = rates;
    cacheTimestamp = Date.now();

    return NextResponse.json(
      {
        rates,
        cached: false,
        timestamp: cacheTimestamp,
        nextUpdate: cacheTimestamp + CACHE_DURATION,
        source: 'exchangerate-api.com',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching exchange rates:', error);

    // Return fallback rates if API fails
    const fallbackRates: Record<CurrencyCode, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
      CNY: 7.24,
      SGD: 1.34,
      AED: 3.67,
      VND: 25320,
    };

    return NextResponse.json(
      {
        rates: fallbackRates,
        cached: false,
        timestamp: Date.now(),
        error: 'Failed to fetch live rates, using fallback values',
        source: 'fallback',
      },
      {
        status: 200, // Still return 200 so clients can use fallback rates
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        },
      }
    );
  }
}
