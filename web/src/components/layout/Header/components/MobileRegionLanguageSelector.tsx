'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import { schedulePendingToast } from '@/components/ui/PendingToastFlush';
import { REGIONS, LANGUAGES, CURRENCIES } from '@/types/region';
import type { RegionCode, LanguageCode } from '@/types/region';
import {
  getSuggestedLanguage,
} from '@/lib/utils/regionLanguageMapping';

/**
 * Mobile region and language selector component.
 * Provides dropdowns for language and region selection in mobile navigation.
 */
export default function MobileRegionLanguageSelector() {
  const currentLocale = useLocale() as LanguageCode;
  const currentRegion = useRegion();
  const setRegion = useSetRegion();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const tLangChanged = useTranslations('ui.languageChanged');
  const tRegion = useTranslations('region');
  const tSuggestion = useTranslations('region.languageSuggestion');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as LanguageCode;
    if (newLocale === currentLocale) return;

    const languageName = LANGUAGES[newLocale]?.nativeName ?? newLocale;
    schedulePendingToast({
      type: 'success',
      title: tLangChanged('title'),
      message: tLangChanged('message', { language: languageName }),
      duration: 4000,
    });
    router.replace(pathname, { locale: newLocale });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionCode = e.target.value as RegionCode;
    setRegion(regionCode);

    const suggestedLanguage = getSuggestedLanguage(regionCode);
    if (suggestedLanguage !== currentLocale && LANGUAGES[suggestedLanguage]) {
      const languageName = LANGUAGES[suggestedLanguage].nativeName;
      const message = tSuggestion('message', { language: languageName });
      showToast('info', tSuggestion('title'), message, undefined, {
        label: tSuggestion('switchAction'),
        onClick: () => {
          schedulePendingToast({
            type: 'success',
            title: tLangChanged('title'),
            message: tLangChanged('message', { language: languageName }),
            duration: 3000,
          });
          router.replace(pathname, { locale: suggestedLanguage });
        },
      });
    }
  };

  const currentCurrency = CURRENCIES[currentRegion.currency];

  return (
    <div className="flex flex-col gap-4 border-t border-neutral-200 px-4 py-4">
      {/* Language Selector */}
      <div>
        <label htmlFor="mobile-language" className="text-sm font-medium text-neutral-700">
          {tRegion('selectLanguage')}
        </label>
        <select
          id="mobile-language"
          value={currentLocale}
          onChange={handleLanguageChange}
          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          {Object.values(LANGUAGES).map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* Region Selector */}
      <div>
        <label htmlFor="mobile-region" className="text-sm font-medium text-neutral-700">
          {tRegion('selectRegion')}
        </label>
        <select
          id="mobile-region"
          value={currentRegion.code}
          onChange={handleRegionChange}
          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          {Object.values(REGIONS).map((region) => (
            <option key={region.code} value={region.code}>
              {region.name} ({currentCurrency.code === CURRENCIES[region.currency].code
                ? currentCurrency.symbol
                : CURRENCIES[region.currency].symbol}
              {CURRENCIES[region.currency].code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
