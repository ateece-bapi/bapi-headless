import type { RegionCode, LanguageCode } from '@/types/region';

/**
 * Mapping of regions to their primary/suggested languages
 * Used for smart suggestion when region changes
 */
export const REGION_LANGUAGE_MAP: Record<RegionCode, LanguageCode> = {
  us: 'en',
  uk: 'en',
  eu: 'en', // English is most universal for multi-country EU
  jp: 'ja',
  cn: 'zh',
  sg: 'en',
  vn: 'vi',
  th: 'th',
  in: 'hi',
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
    jp: `Switch to ${languageName}?`,
    cn: `Switch to ${languageName}?`,
    sg: `Switch to ${languageName}?`,
    vn: `Switch to ${languageName}?`,
    th: `Switch to ${languageName}?`,
    in: `Switch to ${languageName}?`,
    mena: `Switch to ${languageName} for this region?`,
  };

  return suggestions[regionCode] || `Switch to ${languageName}?`;
}
