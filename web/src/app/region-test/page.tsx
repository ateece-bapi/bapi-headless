import React from 'react';
import RegionDemoCard from '@/components/examples/RegionDemoCard';

export const metadata = {
  title: 'Region & Localization Demo | BAPI',
  description:
    'Demonstration of region-aware pricing, currency conversion, and localization features',
};

export default function RegionTestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Region & Localization Demo</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Select a region from the header dropdown to see automatic currency conversion, date
            formatting, unit conversion, and number localization in action.
          </p>
        </div>

        <RegionDemoCard />

        <div className="mx-auto mt-12 max-w-2xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">How It Works</h2>

          <div className="space-y-6 text-gray-800">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">🌍 Region Selection</h3>
              <p className="text-gray-700">
                Use the region selector in the header (globe icon) to choose your region. Your
                selection is saved in localStorage and persists across sessions.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">💰 Currency & Pricing</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                <li>
                  <strong className="text-gray-900">United States (🇺🇸):</strong> Prices in USD ($)
                </li>
                <li>
                  <strong className="text-gray-900">Europe (🇪🇺):</strong> Prices in EUR (€)
                </li>
                <li>
                  <strong className="text-gray-900">Asia Pacific (🌏):</strong> Prices in SGD (S$)
                </li>
                <li>
                  <strong className="text-gray-900">Middle East (🇦🇪):</strong> Prices in AED (د.إ)
                </li>
              </ul>
              <p className="mt-2 text-gray-700">
                All prices are automatically converted from the base USD price using current
                exchange rates. Symbol positioning and decimal places adjust per currency.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                📅 Date & Time Formatting
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                <li>
                  <strong className="text-gray-900">US:</strong> MM/DD/YYYY, 12-hour time
                </li>
                <li>
                  <strong className="text-gray-900">Europe:</strong> DD/MM/YYYY, 24-hour time
                </li>
                <li>
                  <strong className="text-gray-900">Asia:</strong> YYYY-MM-DD, 24-hour time
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">📏 Unit Conversion</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                <li>
                  <strong className="text-gray-900">US:</strong> Fahrenheit (°F), Feet (ft)
                </li>
                <li>
                  <strong className="text-gray-900">Others:</strong> Celsius (°C), Meters (m)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">🔢 Number Formatting</h3>
              <p className="text-gray-700">
                Large numbers are formatted according to regional conventions (e.g., 1,234.56 vs
                1.234,56).
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">🛠️ For Developers</h3>
              <p className="mb-3 text-gray-700">Use the provided utilities in your components:</p>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                {`import { useRegion } from '@/store/regionStore';
import { formatConvertedPrice } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/locale';

// In your component
const region = useRegion();
const price = formatConvertedPrice(99.99, region.currency);
const date = formatDate(new Date(), region.language);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
