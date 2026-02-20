/**
 * Navigation Component Stories
 * 
 * Documents the language and region selector components used in the header.
 * 
 * **LanguageSelector Features:**
 * - Headless UI Listbox dropdown
 * - 11 languages grouped by region (LANGUAGE_GROUPS)
 * - Native language names + English names
 * - Flag emojis for each language
 * - Check icon for selected language
 * - Hover states with primary-50 background
 * - Language icon + chevron indicators
 * 
 * **RegionSelector Features:**
 * - Headless UI Listbox dropdown
 * - Regions grouped (Americas, Europe, Asia-Pacific)
 * - Currency display (symbol + code: $ USD, € EUR, £ GBP)
 * - Flag emojis for each region
 * - Smart language suggestion on region change
 * - Globe icon + chevron indicators
 * - Check icon for selected region
 * 
 * **Note:**
 * Due to the complexity of these components (Headless UI, next-intl routing, 
 * Zustand store integration), these stories document the visual appearance.
 * Full interactive functionality requires the complete app context.
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

// Create a simple documentation component since the actual components 
// require complex setup (next-intl, routing, Zustand)
const NavigationDocs = () => (
  <div className="space-y-12 p-8">
    {/* Language Selector Documentation */}
    <section>
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">Language Selector</h2>
      
      <div className="space-y-8">
        {/* Closed State */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Closed State (Button)
          </h3>
          <div className="inline-block">
            <div className="flex flex-col gap-0.5">
              <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                Language
              </span>
              <div className="group relative flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-primary-500 hover:bg-neutral-50">
                {/* Language Icon */}
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    🇺🇸
                  </span>
                  <span className="block truncate">English</span>
                </span>
                {/* Chevron */}
                <svg
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Open State with Options */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Open State (Dropdown Example)
          </h3>
          <div className="inline-block w-60 rounded-lg border border-neutral-200 bg-white shadow-xl">
            {/* Americas Group */}
            <div className="py-1">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Americas
                </span>
              </div>
              <div className="relative cursor-pointer select-none bg-primary-50 py-2.5 pl-10 pr-4 text-primary-900">
                <span className="absolute left-3 flex items-center text-primary-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <div className="flex flex-col">
                    <span className="block truncate font-semibold">English</span>
                    <span className="text-xs text-primary-600">English</span>
                  </div>
                </div>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇸</span>
                  <div className="flex flex-col">
                    <span className="block truncate font-medium">Español</span>
                    <span className="text-xs text-neutral-500">Spanish</span>
                  </div>
                </div>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇫🇷</span>
                  <div className="flex flex-col">
                    <span className="block truncate font-medium">Français</span>
                    <span className="text-xs text-neutral-500">French</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Europe Group */}
            <div className="border-t border-neutral-100 py-1">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Europe
                </span>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇩🇪</span>
                  <div className="flex flex-col">
                    <span className="block truncate font-medium">Deutsch</span>
                    <span className="text-xs text-neutral-500">German</span>
                  </div>
                </div>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇮🇹</span>
                  <div className="flex flex-col">
                    <span className="block truncate font-medium">Italiano</span>
                    <span className="text-xs text-neutral-500">Italian</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-lg bg-neutral-50 p-4">
          <h4 className="mb-2 font-semibold text-neutral-900">Key Features</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• 11 languages grouped by region (Americas, Europe, Asia-Pacific)</li>
            <li>• Native language names with English translations</li>
            <li>• Flag emojis for visual identification</li>
            <li>• Check icon indicates selected language</li>
            <li>• Hover state with primary-50 background</li>
            <li>• Language icon (globe with A) + chevron indicators</li>
            <li>• Client-side only render to prevent hydration mismatch</li>
            <li>• Integration with next-intl for route-based locale switching</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Region Selector Documentation */}
    <section className="border-t border-neutral-200 pt-12">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">Region Selector</h2>
      
      <div className="space-y-8">
        {/* Closed State */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Closed State (Button)
          </h3>
          <div className="inline-block">
            <div className="flex flex-col gap-0.5">
              <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                Region
              </span>
              <div className="group relative flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-10 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-primary-500 hover:bg-neutral-50">
                {/* Globe Icon */}
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    🇺🇸
                  </span>
                  <span className="block truncate">United States</span>
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-neutral-500">
                  <span className="text-xs font-semibold">$</span>
                  <span className="text-[10px] uppercase">USD</span>
                </span>
                {/* Chevron */}
                <svg
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Open State with Options */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Open State (Dropdown Example)
          </h3>
          <div className="inline-block w-72 rounded-lg border border-neutral-200 bg-white shadow-xl">
            {/* Americas Group */}
            <div className="py-1">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Americas
                </span>
              </div>
              <div className="relative cursor-pointer select-none bg-primary-50 py-2.5 pl-10 pr-12 text-primary-900">
                <span className="absolute left-3 flex items-center text-primary-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <span className="block truncate font-semibold">United States</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary-700">
                    <span className="font-semibold">$</span>
                    <span className="uppercase opacity-75">USD</span>
                  </div>
                </div>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-12 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇨🇦</span>
                    <span className="block truncate font-medium">Canada</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="font-semibold">$</span>
                    <span className="uppercase opacity-75">CAD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Europe Group */}
            <div className="border-t border-neutral-100 py-1">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Europe
                </span>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-12 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇩🇪</span>
                    <span className="block truncate font-medium">Germany</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="font-semibold">€</span>
                    <span className="uppercase opacity-75">EUR</span>
                  </div>
                </div>
              </div>
              <div className="relative cursor-pointer select-none py-2.5 pl-10 pr-12 text-neutral-900 hover:bg-primary-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇬🇧</span>
                    <span className="block truncate font-medium">United Kingdom</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="font-semibold">£</span>
                    <span className="uppercase opacity-75">GBP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-lg bg-neutral-50 p-4">
          <h4 className="mb-2 font-semibold text-neutral-900">Key Features</h4>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• Regions grouped (Americas, Europe, Asia-Pacific)</li>
            <li>• Currency display with symbol + code ($ USD, € EUR, £ GBP)</li>
            <li>• Flag emojis for visual identification</li>
            <li>• Check icon indicates selected region</li>
            <li>• Hover state with primary-50 background</li>
            <li>• Globe icon + chevron indicators</li>
            <li>• Smart language suggestion on region change (toast notification)</li>
            <li>• Zustand store integration for persistent region preference</li>
            <li>• Measurement unit selection (Imperial/Metric) per region</li>
          </ul>
        </div>

        {/* Smart Language Suggestion */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h4 className="mb-2 font-semibold text-neutral-900">Smart Language Suggestion</h4>
          <p className="mb-3 text-sm text-neutral-700">
            When a user changes their region, the system suggests matching language if different:
          </p>
          <div className="inline-flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1 text-blue-900">
              Would you like to switch to Deutsch (German)?
            </span>
            <button className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
              Switch
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Implementation Notes */}
    <section className="border-t border-neutral-200 pt-12">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">Implementation Details</h2>
      <div className="space-y-4 rounded-lg bg-neutral-50 p-6">
        <div>
          <h4 className="font-semibold text-neutral-900">Components</h4>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            <li>
              • <code className="rounded bg-white px-1 py-0.5 text-primary-600">LanguageSelectorV2.tsx</code>{' '}
              - Located in <code className="text-xs">/components/layout/Header/components/</code>
            </li>
            <li>
              • <code className="rounded bg-white px-1 py-0.5 text-primary-600">RegionSelectorV2.tsx</code>{' '}
              - Located in <code className="text-xs">/components/layout/Header/components/</code>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900">Dependencies</h4>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            <li>• Headless UI (@headlessui/react) - Listbox component</li>
            <li>• Heroicons (@heroicons/react) - Language, Globe, Chevron, Check icons</li>
            <li>• next-intl - Internationalization and locale routing</li>
            <li>• Zustand - Region state management (regionStore)</li>
            <li>• Sonner - Toast notifications for language suggestions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900">Configuration Files</h4>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            <li>
              • <code className="text-xs">/types/region.ts</code> - LANGUAGES, REGIONS, CURRENCIES constants
            </li>
            <li>
              • <code className="text-xs">/lib/constants/languageGroups.ts</code> - Language grouping
            </li>
            <li>
              • <code className="text-xs">/lib/constants/regionGroups.ts</code> - Region grouping
            </li>
            <li>
              • <code className="text-xs">/lib/utils/regionLanguageMapping.ts</code> - Smart suggestion logic
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

const meta: Meta<typeof NavigationDocs> = {
  title: 'Components/Navigation/LanguageAndRegion',
  component: NavigationDocs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Language and Region selector components for header navigation. These components use Headless UI, next-intl, and Zustand for complex state management.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete navigation documentation
 */
export const NavigationComponents: Story = {};
