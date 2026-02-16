'use client';

import { useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRegion } from '@/hooks/useRegion';
import { showToast } from '@/components/ui/Toast';
import { detectUserLanguage } from '@/lib/i18n/languageDetection';

/**
 * Mobile region and language selector component.
 * Provides dropdowns for language and region selection in mobile navigation.
 * Automatically detects user's browser language on first mount and suggests switching.
 *
 * @returns {JSX.Element} Mobile selector UI with language and region dropdowns
 *
 * @example
 * ```tsx
 * <MobileRegionLanguageSelector />
 * ```
 */
export default function MobileRegionLanguageSelector() {
  const { t, locale, setLocale, availableLocales } = useTranslation();
  const { region, setRegion, availableRegions } = useRegion();
  const hasCheckedLanguageRef = useRef(false);

  useEffect(() => {
    if (hasCheckedLanguageRef.current) return;

    const detectedLanguage = detectUserLanguage();
    if (detectedLanguage && detectedLanguage !== locale) {
      const languageName = availableLocales.find(
        (l) => l.code === detectedLanguage
      )?.name;

      const message = t('languageSuggestion', {
        language: languageName || detectedLanguage,
      });

      showToast('info', 'Language Suggestion', message, {
        duration: 7000,
        action: {
          label: 'Switch',
          onClick: () => {
            setLocale(detectedLanguage);
            showToast('success', 'Language Changed', t('languageChanged'));
          },
        },
      });
    }

    hasCheckedLanguageRef.current = true;
  }, [locale, setLocale, availableLocales, t]);

  return (
    <div className="flex flex-col gap-4 border-t border-neutral-200 px-4 py-4">
      {/* Language Selector */}
      <div>
        <label
          htmlFor="mobile-language"
          className="text-sm font-medium text-neutral-700"
        >
          {t('language')}
        </label>
        <select
          id="mobile-language"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          {availableLocales.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Region Selector */}
      <div>
        <label
          htmlFor="mobile-region"
          className="text-sm font-medium text-neutral-700"
        >
          {t('region')}
        </label>
        <select
          id="mobile-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mt-1 block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          {availableRegions.map((reg) => (
            <option key={reg.code} value={reg.code}>
              {reg.name} ({reg.currency})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}