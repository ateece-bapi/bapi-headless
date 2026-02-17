'use client';

import { useParams } from 'next/navigation';
import {
  formatMeasurement,
  formatTemperatureRange,
  formatDimensions,
  formatWeight,
  parseAndFormatTemperatureRange,
  type MeasurementUnit,
} from '@/lib/utils/locale';
import type { LanguageCode } from '@/types/region';

/**
 * Demonstration component showing measurement unit conversion
 * 
 * This component demonstrates how to use the measurement utilities
 * for product specifications and sensor data.
 */
export default function MeasurementDemo() {
  const params = useParams();
  const locale = (params?.locale as LanguageCode) || 'en';

  const exampleTemp = 20; // 20°C
  const exampleLength = 100; // 100 cm
  const exampleWeight = 5; // 5 kg

  return (
    <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">
          Measurement Unit Conversion Demo
        </h2>
        <p className="text-neutral-600">
          Current locale: <span className="font-semibold">{locale}</span>
        </p>
      </div>

      {/* Temperature Conversion */}
      <div className="rounded-lg border-2 border-primary-100 bg-primary-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900">🌡️ Temperature</h3>
        <div className="space-y-2">
          <p className="text-neutral-700">
            <span className="font-medium">Single value:</span>{' '}
            {formatMeasurement(exampleTemp, 'celsius', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Operating range:</span>{' '}
            {formatTemperatureRange(-40, 185, 'fahrenheit', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Storage range:</span>{' '}
            {formatTemperatureRange(-40, 85, 'celsius', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Parsed from string:</span>{' '}
            {parseAndFormatTemperatureRange('-40 to 185', 'fahrenheit', locale)}
          </p>
        </div>
      </div>

      {/* Length/Dimensions */}
      <div className="rounded-lg border-2 border-accent-100 bg-accent-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900">📏 Dimensions</h3>
        <div className="space-y-2">
          <p className="text-neutral-700">
            <span className="font-medium">Length:</span>{' '}
            {formatMeasurement(exampleLength, 'centimeters', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Product dimensions:</span>{' '}
            {formatDimensions(4.5, 2.8, 1.2, 'inches', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Cable length:</span>{' '}
            {formatMeasurement(3, 'meters', locale)}
          </p>
        </div>
      </div>

      {/* Weight */}
      <div className="rounded-lg border-2 border-neutral-200 bg-neutral-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900">⚖️ Weight</h3>
        <div className="space-y-2">
          <p className="text-neutral-700">
            <span className="font-medium">Product weight:</span>{' '}
            {formatWeight(exampleWeight, 'kilograms', locale)}
          </p>
          <p className="text-neutral-700">
            <span className="font-medium">Shipping weight:</span>{' '}
            {formatWeight(0.5, 'pounds', locale)}
          </p>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="rounded-lg border-2 border-blue-100 bg-blue-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900">💡 Usage in Product Specs</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-neutral-600">Operating Temperature:</p>
            <p className="text-lg text-neutral-900">
              {formatTemperatureRange(-40, 85, 'celsius', locale)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">Dimensions (L x W x H):</p>
            <p className="text-lg text-neutral-900">
              {formatDimensions(11.4, 7.1, 3.0, 'centimeters', locale)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">Weight:</p>
            <p className="text-lg text-neutral-900">
              {formatWeight(0.3, 'pounds', locale)}
            </p>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="rounded-lg border-2 border-green-100 bg-green-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-neutral-900">📝 Code Examples</h3>
        <pre className="overflow-x-auto rounded bg-white p-4 text-xs">
          <code>{`import { 
  formatMeasurement, 
  formatTemperatureRange,
  formatDimensions 
} from '@/lib/utils/locale';

// Temperature
formatMeasurement(20, 'celsius', locale)
// → "68.0°F" (US) or "20,0°C" (EU)

// Temperature range
formatTemperatureRange(-40, 185, 'fahrenheit', locale)
// → "-40.0°F to 185.0°F" (US) or "-40,0°C to 85,0°C" (EU)

// Dimensions
formatDimensions(4.5, 2.8, 1.2, 'inches', locale)
// → '4.5" x 2.8" x 1.2"' (US) or "11,4cm x 7,1cm x 3,0cm" (EU)`}</code>
        </pre>
      </div>
    </div>
  );
}
