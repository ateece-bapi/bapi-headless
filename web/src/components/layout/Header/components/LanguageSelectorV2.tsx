'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useRouter, usePathname } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { LANGUAGES } from '@/types/region';
import type { LanguageCode } from '@/types/region';
import { LANGUAGE_GROUPS } from '@/lib/constants/languageGroups';
import { ChevronDownIcon, LanguageIcon, CheckIcon } from '@heroicons/react/24/outline';

export function LanguageSelectorV2() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as LanguageCode;

  // Prevent hydration mismatch by only rendering Headless UI on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: LanguageCode) => {
    // Use next-intl's router which handles locale switching automatically
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = LANGUAGES[currentLocale];

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Language
        </span>
        <div className="group relative flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-sm font-medium text-neutral-700">
          <LanguageIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 lg:left-3.5"
            aria-hidden="true"
          />
          <span className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
            <span className="block truncate">{currentLanguage.nativeName}</span>
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
        Language
      </span>
      <Listbox value={currentLocale} onChange={handleLanguageChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className="group relative flex w-full cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-left text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-primary-500 hover:bg-neutral-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 lg:pl-10"
              aria-label="Select language"
            >
              {/* Language Icon */}
              <LanguageIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 transition-colors duration-150 group-hover:text-primary-600 lg:left-3.5"
                aria-hidden="true"
              />
              
              {/* Selected Language Display */}
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
                <span className="block truncate">{currentLanguage.nativeName}</span>
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
              <Listbox.Options className="absolute z-50 mt-1 max-h-[400px] w-full min-w-[220px] overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none lg:w-auto">
                {LANGUAGE_GROUPS.map((group) => (
                  <div key={group.id} className="py-1">
                    {/* Group Header */}
                    <div className="px-3 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        {group.label}
                      </span>
                    </div>
                    
                    {/* Group Options */}
                    {group.languages.map((languageCode) => {
                      const config = LANGUAGES[languageCode];
                      const isSelected = languageCode === currentLocale;

                      return (
                        <Listbox.Option
                          key={languageCode}
                          value={languageCode}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-75 ${
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
                              <div className="flex items-center gap-2">
                                <span className="text-lg" aria-hidden="true">{config.flag}</span>
                                <div className="flex flex-col">
                                  <span
                                    className={`block truncate ${
                                      isSelected ? 'font-semibold' : 'font-medium'
                                    }`}
                                  >
                                    {config.nativeName}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      active ? 'text-primary-600' : 'text-neutral-500'
                                    }`}
                                  >
                                    {config.name}
                                  </span>
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
}

// Alias export for backward compatibility
export { LanguageSelectorV2 as LanguageSelector };
