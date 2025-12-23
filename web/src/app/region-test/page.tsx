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

        <div className="mt-12 prose prose-blue max-w-2xl mx-auto">
          <h2>How It Works</h2>
          
          <h3>🌍 Region Selection</h3>
          <p>
            Use the region selector in the header (globe icon) to choose your region.
            Your selection is saved in localStorage and persists across sessions.
          </p>

          <h3>💰 Currency & Pricing</h3>
          <ul>
            <li><strong>United States (🇺🇸):</strong> Prices in USD ($)</li>
            <li><strong>Europe (🇪🇺):</strong> Prices in EUR (€)</li>
            <li><strong>Asia Pacific (🌏):</strong> Prices in SGD (S$)</li>
          </ul>
          <p>
            All prices are automatically converted from the base USD price using
            current exchange rates. Symbol positioning and decimal places adjust
            per currency.
          </p>

          <h3>📅 Date & Time Formatting</h3>
          <ul>
            <li><strong>US:</strong> MM/DD/YYYY, 12-hour time</li>
            <li><strong>Europe:</strong> DD/MM/YYYY, 24-hour time</li>
            <li><strong>Asia:</strong> YYYY-MM-DD, 24-hour time</li>
          </ul>

          <h3>📏 Unit Conversion</h3>
          <ul>
            <li><strong>US:</strong> Fahrenheit (°F), Feet (ft)</li>
            <li><strong>Others:</strong> Celsius (°C), Meters (m)</li>
          </ul>

          <h3>🔢 Number Formatting</h3>
          <p>
            Large numbers are formatted according to regional conventions
            (e.g., 1,234.56 vs 1.234,56).
          </p>

          <h3>🛠️ For Developers</h3>
          <p>Use the provided utilities in your components:</p>
          <pre>
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
    </main>
  );
}
