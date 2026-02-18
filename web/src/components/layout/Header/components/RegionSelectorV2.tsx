'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useRouter, usePathname } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { toast } from 'sonner';
import { REGIONS, LANGUAGES, CURRENCIES } from '@/types/region';
import type { RegionCode, LanguageCode } from '@/types/region';
import {
  getSuggestedLanguage,
  getLanguageSuggestionMessage,
} from '@/lib/utils/regionLanguageMapping';
import { REGION_GROUPS } from '@/lib/constants/regionGroups';
import { ChevronDownIcon, GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';

const RegionSelectorV2: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const currentRegion = useRegion();
  const setRegion = useSetRegion();
  const currentLocale = useLocale() as LanguageCode;
  const router = useRouter();
  const pathname = usePathname();

  // Prevent hydration mismatch by only rendering Headless UI on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (regionCode: RegionCode) => {
    setRegion(regionCode);

    // Smart suggestion: Suggest matching language if different
    const suggestedLanguage = getSuggestedLanguage(regionCode);

    // Only suggest if language is different AND exists in LANGUAGES
    if (suggestedLanguage !== currentLocale && LANGUAGES[suggestedLanguage]) {
      const languageName = LANGUAGES[suggestedLanguage].nativeName;
      const message = getLanguageSuggestionMessage(regionCode, languageName);

      // Show toast with action button using Sonner
      toast.info(message, {
        duration: 7000,
        action: {
          label: 'Switch',
          onClick: () => {
            // Change language using next-intl navigation helpers
            router.replace(pathname, { locale: suggestedLanguage });
            
            // Show success toast after language switch
            toast.success('Language Changed');
          },
        },
      });
    }
  };

  const currentCurrency = CURRENCIES[currentRegion.currency];

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Region
        </span>
        <div className="group relative flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-sm font-medium text-neutral-700">
          <GlobeAltIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 lg:left-3.5"
            aria-hidden="true"
          />
          <span className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">{currentRegion.flag}</span>
            <span className="block truncate">{currentRegion.name}</span>
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-neutral-500">
            <span className="text-xs font-semibold">{currentCurrency.symbol}</span>
            <span className="text-[10px] uppercase">{currentCurrency.code}</span>
          </span>
          <ChevronDownIcon
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        Region
      </span>
      <Listbox value={currentRegion.code} onChange={handleChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className="group relative flex w-full cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-left text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-primary-500 hover:bg-neutral-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 lg:pl-10"
              aria-label="Select region"
            >
              {/* Globe Icon */}
              <GlobeAltIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 transition-colors duration-150 group-hover:text-primary-600 lg:left-3.5"
                aria-hidden="true"
              />
              
              {/* Selected Region Display */}
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{currentRegion.flag}</span>
                <span className="block truncate">{currentRegion.name}</span>
              </span>
              
              {/* Currency Symbol */}
              <span className="ml-auto flex items-center gap-1.5 text-neutral-500">
                <span className="text-xs font-semibold">{currentCurrency.symbol}</span>
                <span className="text-[10px] uppercase">{currentCurrency.code}</span>
              </span>

              {/* Chevron Icon */}
              <ChevronDownIcon
                className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-[400px] w-full min-w-[280px] overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none lg:w-auto">
                {REGION_GROUPS.map((group) => (
                  <div key={group.id} className="py-1">
                    {/* Group Header */}
                    <div className="px-3 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        {group.label}
                      </span>
                    </div>
                    
                    {/* Group Options */}
                    {group.regions.map((regionCode) => {
                      const region = REGIONS[regionCode];
                      const currency = CURRENCIES[region.currency];
                      const isSelected = regionCode === currentRegion.code;

                      return (
                        <Listbox.Option
                          key={regionCode}
                          value={regionCode}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2.5 pl-10 pr-12 transition-colors duration-75 ${
                              active ? 'bg-primary-50 text-primary-900' : 'text-neutral-900'
                            }`
                          }
                        >
                          {({ active }) => (
                            <>
                              {/* Check Icon (Selected) */}
                              {isSelected && (
                                <span className="absolute left-3 flex items-center text-primary-600">
                                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                </span>
                              )}

                              {/* Option Content */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg" aria-hidden="true">{region.flag}</span>
                                  <span
                                    className={`block truncate ${
                                      isSelected ? 'font-semibold' : 'font-medium'
                                    }`}
                                  >
                                    {region.name}
                                  </span>
                                </div>
                                
                                {/* Currency Info */}
                                <div
                                  className={`flex items-center gap-1 text-xs ${
                                    active ? 'text-primary-700' : 'text-neutral-500'
                                  }`}
                                >
                                  <span className="font-semibold">{currency.symbol}</span>
                                  <span className="uppercase opacity-75">{currency.code}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </div>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default RegionSelectorV2;
