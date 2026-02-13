'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import { REGIONS, LANGUAGES } from '@/types/region';
import type { RegionCode, LanguageCode } from '@/types/region';
import {
  getSuggestedLanguage,
  getLanguageSuggestionMessage,
} from '@/lib/utils/regionLanguageMapping';
import { X } from 'lucide-react';

/**
 * Mobile-optimized Region & Language Selector
 * Opens as bottom sheet modal on mobile devices
 */
export function MobileRegionLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentRegion = useRegion();
  const setRegion = useSetRegion();
  const currentLocale = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            router.replace(pathname, { locale: suggestedLanguage });
            setIsOpen(false);
          },
        },
      });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as LanguageCode;
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false); // Close modal after selection
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
        aria-label="Change region and language"
      >
        {/* Globe icon */}
        <svg
          className="h-4 w-4 text-gray-500"
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
        <span className="text-xs">{currentRegion.flag}</span>
      </button>

      {/* Bottom Sheet Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <div
            className="fixed inset-x-0 bottom-0 z-70 rounded-t-2xl bg-white shadow-2xl transition-transform lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-region-language-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2
                id="mobile-region-language-title"
                className="text-lg font-semibold text-gray-900"
              >
                Region & Language
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Region Selector */}
                <div className="space-y-2">
                  <label
                    htmlFor="mobile-region-select"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
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
                      Region
                    </span>
                  </label>
                  <select
                    id="mobile-region-select"
                    value={currentRegion.code}
                    onChange={handleRegionChange}
                    className="block w-full cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:border-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.values(REGIONS).map((region) => (
                      <option key={region.code} value={region.code}>
                        {region.flag} {region.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Controls currency and regional settings
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Language Selector */}
                <div className="space-y-2">
                  <label
                    htmlFor="mobile-language-select"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Language
                    </span>
                  </label>
                  <select
                    id="mobile-language-select"
                    value={currentLocale}
                    onChange={handleLanguageChange}
                    className="block w-full cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:border-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {(Object.entries(LANGUAGES) as [LanguageCode, (typeof LANGUAGES)[LanguageCode]][]).map(
                      ([code, config]) => (
                        <option key={code} value={code}>
                          {config.flag} {config.nativeName}
                        </option>
                      )
                    )}
                  </select>
                  <p className="text-xs text-gray-500">
                    Controls interface and content language
                  </p>
                </div>

                {/* Current Selection Display */}
                <div className="rounded-lg bg-primary-50 p-4">
                  <div className="text-sm text-primary-900">
                    <div className="mb-1 font-medium">Current Selection:</div>
                    <div className="space-y-1 text-primary-700">
                      <div>
                        🌏 Region: {currentRegion.flag} {currentRegion.name}
                      </div>
                      <div>
                        💬 Language: {LANGUAGES[currentLocale]?.flag}{' '}
                        {LANGUAGES[currentLocale]?.nativeName}
                      </div>
                      <div>💰 Currency: {currentRegion.currency}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Done button */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
