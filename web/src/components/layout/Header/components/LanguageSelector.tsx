'use client';

import { useRouter, usePathname } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { LANGUAGES } from '@/types/region';
import type { LanguageCode } from '@/types/region';

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as LanguageCode;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as LanguageCode;

    // Use next-intl's router which handles locale switching automatically
    // Just push the current pathname - the router will add the new locale prefix
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">
        Language
      </span>
      <div className="group relative">
        <label htmlFor="language-select" className="sr-only">
          Select your language
        </label>
        {/* Language icon */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-primary-600 lg:left-3.5"
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
        <select
          id="language-select"
          value={currentLocale}
          onChange={handleLanguageChange}
          className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-1.5 pl-9 pr-9 text-sm font-medium text-gray-700 transition-colors hover:border-primary-500 hover:bg-gray-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 lg:py-2 lg:pl-10"
        >
          {(Object.entries(LANGUAGES) as [LanguageCode, (typeof LANGUAGES)[LanguageCode]][]).map(
            ([code, config]) => (
              <option key={code} value={code}>
                {config.flag} {config.nativeName}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
