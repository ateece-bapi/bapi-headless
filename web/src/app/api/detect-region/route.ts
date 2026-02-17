import { NextRequest, NextResponse } from 'next/server';
import type { RegionCode, LanguageCode } from '@/types/region';
import logger from '@/lib/logger';

/**
 * Auto-detect user's region and language based on geo-location
 * Uses Vercel Edge geo data (available in request.geo)
 */
export const runtime = 'edge';

// Map country codes to BAPI regions
const COUNTRY_TO_REGION: Record<string, RegionCode> = {
  // North America
  US: 'us',
  CA: 'us',
  MX: 'us',

  // Europe
  DE: 'eu',
  FR: 'eu',
  ES: 'eu',
  IT: 'eu',
  GB: 'uk',  // United Kingdom gets its own region
  NL: 'eu',
  BE: 'eu',
  AT: 'eu',
  CH: 'eu',
  SE: 'eu',
  NO: 'eu',
  DK: 'eu',
  FI: 'eu',
  PL: 'eu',
  CZ: 'eu',
  PT: 'eu',
  GR: 'eu',
  IE: 'eu',

  // Middle East
  AE: 'mena',
  SA: 'mena',
  QA: 'mena',
  KW: 'mena',
  BH: 'mena',
  OM: 'mena',
  JO: 'mena',
  LB: 'mena',
  EG: 'mena',

  // Asia - Specific regions
  JP: 'jp',  // Japan
  CN: 'cn',  // China
  SG: 'sg',  // Singapore
  VN: 'vn',  // Vietnam
  TH: 'th',  // Thailand
  IN: 'in',  // India
  
  // Asia - Grouped under Singapore
  HK: 'sg',
  TW: 'sg',
  KR: 'sg',
  MY: 'sg',
  ID: 'sg',
  PH: 'sg',
  AU: 'sg',
  NZ: 'sg',
};

// Map country codes to suggested languages
const COUNTRY_TO_LANGUAGE: Record<string, LanguageCode> = {
  DE: 'de',
  FR: 'fr',
  ES: 'es',
  JP: 'ja',
  CN: 'zh',
  VN: 'vi',
  SA: 'ar',
  AE: 'ar',
  TH: 'th',
  PL: 'pl',
  IN: 'hi',
};

// Friendly country names
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  CN: 'China',
  SG: 'Singapore',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  VN: 'Vietnam',
  TH: 'Thailand',
  PL: 'Poland',
  IN: 'India',
  // Add more as needed
};

/**
 * GET handler for region detection using Vercel Edge geo-location headers
 * @param request - Next.js request object with geo headers
 * @returns JSON response with detected country, region, and suggested language
 */
export async function GET(request: NextRequest) {
  try {
    // Get country from Vercel Edge geo-location headers
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const city = request.headers.get('x-vercel-ip-city') || '';

    // Map to BAPI region (default to US if unknown)
    const region: RegionCode = COUNTRY_TO_REGION[country] || 'us';

    // Suggest language based on country (default to English)
    const language: LanguageCode = COUNTRY_TO_LANGUAGE[country] || 'en';

    // Get friendly country name
    const countryName = COUNTRY_NAMES[country] || country;

    return NextResponse.json({
      detected: true,
      country,
      countryName,
      city,
      region,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Fallback to US if detection fails
    // Log error for monitoring but don't expose details to client
    logger.error('Region detection error', { error });
    
    return NextResponse.json({
      detected: false,
      country: 'US',
      countryName: 'United States',
      city: '',
      region: 'us' as RegionCode,
      language: 'en' as LanguageCode,
      error: 'Detection failed, using defaults',
    });
  }
}
