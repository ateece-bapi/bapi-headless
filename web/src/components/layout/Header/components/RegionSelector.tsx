'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import { REGIONS, LANGUAGES } from '@/types/region';
import type { RegionCode, LanguageCode } from '@/types/region';
import { getSuggestedLanguage, getLanguageSuggestionMessage } from '@/lib/utils/regionLanguageMapping';

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
    
    if (suggestedLanguage !== currentLocale) {
      const languageName = LANGUAGES[suggestedLanguage].nativeName;
      const message = getLanguageSuggestionMessage(regionCode, languageName);
      
      // Show toast with action button
      showToast(
        'info',
        'Language Suggestion',
        message,
        7000,
        {
          action: {
            label: 'Switch',
            onClick: () => {
              // Change language by navigating to new locale
              const pathname = window.location.pathname;
              const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
              const newPath = pathnameWithoutLocale === '/' || pathnameWithoutLocale === '' 
                ? `/${suggestedLanguage}` 
                : `/${suggestedLanguage}${pathnameWithoutLocale}`;
              
              router.push(newPath);
              router.refresh();
            }
          }
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider px-1">Region</span>
      <div className="relative group">
        <label htmlFor="region-select" className="sr-only">
          Select your region
        </label>
        {/* Globe icon */}
        <svg
          className="absolute left-3 lg:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors pointer-events-none"
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
        className="appearance-none pl-9 lg:pl-10 pr-3 py-2 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:border-transparent transition-all duration-200 cursor-pointer"
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