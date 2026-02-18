/**
 * Language grouping configuration for organized display
 * Groups languages by usage and geography for better UX
 */

import type { LanguageCode } from '@/types/region';

export interface LanguageGroup {
  id: string;
  label: string;
  languages: LanguageCode[];
}

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    id: 'common',
    label: 'Common Languages',
    languages: ['en', 'es', 'zh'],
  },
  {
    id: 'europe',
    label: 'Europe',
    languages: ['de', 'fr', 'pl'],
  },
  {
    id: 'asia-pacific',
    label: 'Asia Pacific',
    languages: ['ja', 'vi', 'th', 'hi'],
  },
  {
    id: 'middle-east',
    label: 'Middle East',
    languages: ['ar'],
  },
];

/**
 * Get the group label for a given language code
 */
export function getLanguageGroup(languageCode: LanguageCode): string {
  const group = LANGUAGE_GROUPS.find((g) => g.languages.includes(languageCode));
  return group?.label || 'Other';
}
