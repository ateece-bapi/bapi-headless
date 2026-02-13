'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import { REGIONS, LANGUAGES } from '@/types/region';
import type { RegionCode, LanguageCode } from '@/types/region';
import {
  getSuggestedLanguage,
  getLanguageSuggestionMessage,
} from '@/lib/utils/regionLanguageMapping';

const RegionSelector: React.FC = () => {
  const currentRegion = useRegion();
  const setRegion = useSetRegion();
  const currentLocale = useLocale() as LanguageCode;
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionCode = e.target.value as RegionCode;
    setRegion(regionCode);

    // Smart suggestion: Suggest matching language if different
    const suggestedLanguage = getSuggestedLanguage(regionCode);

    // Only suggest if language is different AND exists in LANGUAGES
    if (suggestedLanguage !== currentLocale && LANGUAGES[suggestedLanguage]) {
      const languageName = LANGUAGES[suggestedLanguage].nativeName;
      const message = getLanguageSuggestionMessage(regionCode, languageName);

      // Show toast with action button
      showToast('info', 'Language Suggestion', message, 7000, {
        action: {
          label: 'Switch',
          onClick: () => {
            // Change language by navigating to new locale
            const pathname = window.location.pathname;
            const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
            const newPath =
              pathnameWithoutLocale === '/' || pathnameWithoutLocale === ''
                ? `/${suggestedLanguage}`
                : `/${suggestedLanguage}${pathnameWithoutLocale}`;

            router.push(newPath);
            router.refresh();
          },
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">
        Region
      </span>
      <div className="group relative">
        <label htmlFor="region-select" className="sr-only">
          Select your region
        </label>
        {/* Globe icon */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors duration-150 group-hover:text-primary-600 lg:left-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <select
          id="region-select"
          value={currentRegion.code}
          onChange={handleChange}
          className="cursor-pointer appearance-none rounded-full border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:border-primary-500 hover:bg-gray-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 lg:pl-10"
          aria-label="Select region"
        >
          {Object.values(REGIONS).map((region) => (
            <option key={region.code} value={region.code}>
              {region.flag} {region.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RegionSelector;
