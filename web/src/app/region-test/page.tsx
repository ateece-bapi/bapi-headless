import React from 'react';
import RegionDemoCard from '@/components/examples/RegionDemoCard';

export const metadata = {
  title: 'Region & Localization Demo | BAPI',
  description: 'Demonstration of region-aware pricing, currency conversion, and localization features',
};

export default function RegionTestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Region & Localization Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a region from the header dropdown to see automatic currency conversion,
            date formatting, unit conversion, and number localization in action.
          </p>
        </div>

        <RegionDemoCard />

        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="space-y-6 text-gray-800">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🌍 Region Selection</h3>
              <p className="text-gray-700">
                Use the region selector in the header (globe icon) to choose your region.
                Your selection is saved in localStorage and persists across sessions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">💰 Currency & Pricing</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">United States (🇺🇸):</strong> Prices in USD ($)</li>
                <li><strong className="text-gray-900">Europe (🇪🇺):</strong> Prices in EUR (€)</li>
                <li><strong className="text-gray-900">Asia Pacific (🌏):</strong> Prices in SGD (S$)</li>
                <li><strong className="text-gray-900">Middle East (🇦🇪):</strong> Prices in AED (د.إ)</li>
              </ul>
              <p className="text-gray-700 mt-2">
                All prices are automatically converted from the base USD price using
                current exchange rates. Symbol positioning and decimal places adjust
                per currency.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">📅 Date & Time Formatting</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">US:</strong> MM/DD/YYYY, 12-hour time</li>
                <li><strong className="text-gray-900">Europe:</strong> DD/MM/YYYY, 24-hour time</li>
                <li><strong className="text-gray-900">Asia:</strong> YYYY-MM-DD, 24-hour time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">📏 Unit Conversion</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">US:</strong> Fahrenheit (°F), Feet (ft)</li>
                <li><strong className="text-gray-900">Others:</strong> Celsius (°C), Meters (m)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🔢 Number Formatting</h3>
              <p className="text-gray-700">
                Large numbers are formatted according to regional conventions
                (e.g., 1,234.56 vs 1.234,56).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🛠️ For Developers</h3>
              <p className="text-gray-700 mb-3">Use the provided utilities in your components:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
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
