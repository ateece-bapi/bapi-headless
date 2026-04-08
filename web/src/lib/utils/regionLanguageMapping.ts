import type { RegionCode, LanguageCode } from '@/types/region';

/**
 * Mapping of regions to their primary/suggested languages
 * Used for smart suggestion when region changes
 */
export const REGION_LANGUAGE_MAP: Record<RegionCode, LanguageCode> = {
  us: 'en',
  uk: 'en',
  eu: 'en', // English is most universal for multi-country EU
  pl: 'pl',
  mena: 'ar',
};

/**
 * Get suggested language for a given region
 */
export function getSuggestedLanguage(regionCode: RegionCode): LanguageCode {
  return REGION_LANGUAGE_MAP[regionCode];
}

/**
 * Get user-friendly message for language suggestion
 */
export function getLanguageSuggestionMessage(regionCode: RegionCode, languageName: string): string {
  const suggestions: Record<RegionCode, string> = {
    us: `Switch to ${languageName}?`,
    uk: `Switch to ${languageName}?`,
    eu: `Switch to ${languageName}?`,
    pl: `Switch to ${languageName}?`,
    mena: `Switch to ${languageName} for this region?`,
  };

  return suggestions[regionCode] || `Switch to ${languageName}?`;
}
