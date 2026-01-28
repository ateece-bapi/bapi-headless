import type { RegionCode, LanguageCode } from '@/types/region';

/**
 * Mapping of regions to their primary/suggested languages
 * Used for smart suggestion when region changes
 */
export const REGION_LANGUAGE_MAP: Record<RegionCode, LanguageCode> = {
  US: 'en',
  EU: 'en', // Could be 'de' or 'fr', but English is most universal
  ASIA: 'en', // Could be 'zh' or 'ja', but English is business standard
  MENA: 'ar',
  VIETNAM: 'vi', // HIGHEST PRIORITY - Vietnam facility
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
export function getLanguageSuggestionMessage(
  regionCode: RegionCode,
  languageName: string
): string {
  const suggestions: Record<RegionCode, string> = {
    US: `Switch to ${languageName}?`,
    EU: `Switch to ${languageName}?`,
    ASIA: `Switch to ${languageName}?`,
    MENA: `Switch to ${languageName} for this region?`,
    VIETNAM: `Switch to ${languageName} for Vietnam?`,
  };
  
  return suggestions[regionCode] || `Switch to ${languageName}?`;
}
