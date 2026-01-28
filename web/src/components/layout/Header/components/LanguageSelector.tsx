'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LANGUAGES } from '@/types/region';
import type { LanguageCode } from '@/types/region';

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as LanguageCode;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider px-1">Language</span>
      <div className="relative group">
        <label htmlFor="language-select" className="sr-only">
          Select your language
        </label>
        {/* Language icon */}
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
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <select
          id="language-select"
          value={currentLocale}
          onChange={handleLanguageChange}
          className="appearance-none pl-9 lg:pl-10 pr-9 py-1.5 lg:py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer transition-colors"
        >
          {(Object.entries(LANGUAGES) as [LanguageCode, typeof LANGUAGES[LanguageCode]][]).map(
            ([code, config]) => (
              <option key={code} value={code}>
                {config.nativeName}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
