'use client';

import { useParams } from 'next/navigation';
import { formatTemperatureRange, formatMeasurement, shouldUseImperial } from '@/lib/utils/locale';
import type { LanguageCode } from '@/types/region';

interface TemperatureSensorSpec {
  type: string;
  rangeMin: number;
  rangeMax: number;
  accuracy: string;
  accuracyTemp?: number;
  output: string;
}

interface TemperatureSensorTableProps {
  /** Table header labels */
  labels?: {
    sensorType?: string;
    range?: string;
    accuracy?: string;
    output?: string;
  };
}

// Default accuracy fallback when parsing fails
const DEFAULT_ACCURACY_FAHRENHEIT = 0.2;

const temperatureSensors: TemperatureSensorSpec[] = [
  {
    type: '10K-2 Thermistor',
    rangeMin: -40,
    rangeMax: 212,
    accuracy: '±0.2°F @ 77°F',
    accuracyTemp: 77,
    output: 'Resistance',
  },
  {
    type: '10K-3 Thermistor',
    rangeMin: -40,
    rangeMax: 257,
    accuracy: '±0.2°F @ 77°F',
    accuracyTemp: 77,
    output: 'Resistance',
  },
  {
    type: '100Ω Platinum RTD',
    rangeMin: -40,
    rangeMax: 257,
    accuracy: '±0.3°F @ 77°F',
    accuracyTemp: 77,
    output: 'Resistance',
  },
  {
    type: '1000Ω Platinum RTD',
    rangeMin: -40,
    rangeMax: 257,
    accuracy: '±0.3°F @ 77°F',
    accuracyTemp: 77,
    output: 'Resistance',
  },
];

export function TemperatureSensorTable({ labels }: TemperatureSensorTableProps = {}) {
  const params = useParams();
  const locale = (params?.locale as LanguageCode) || 'en';

  // Use provided labels or English defaults (only fallback on null/undefined)
  const sensorType = labels?.sensorType ?? 'Sensor Type';
  const range = labels?.range ?? 'Range';
  const accuracy = labels?.accuracy ?? 'Accuracy';
  const output = labels?.output ?? 'Output';

  return (
    <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                {sensorType}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">{range}</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">{accuracy}</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">{output}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {temperatureSensors.map((sensor) => {
              const range = formatTemperatureRange(
                sensor.rangeMin,
                sensor.rangeMax,
                'fahrenheit',
                locale
              );

              // Format accuracy with temperature conversion
              let formattedAccuracy = sensor.accuracy;
              if (sensor.accuracyTemp) {
                // Extract the numeric accuracy value in Fahrenheit (e.g., "±0.2" from "±0.2°F @ 77°F")
                const accuracyMatch = sensor.accuracy.match(/±([\d.]+)/);
                const accuracyValueF = accuracyMatch
                  ? parseFloat(accuracyMatch[1])
                  : DEFAULT_ACCURACY_FAHRENHEIT;

                // Format the reference temperature in the user's locale
                const tempValue = formatMeasurement(sensor.accuracyTemp, 'fahrenheit', locale);

                // Determine if we should use imperial units based on locale (more reliable than string matching)
                const useImperial = shouldUseImperial(locale);

                // Create number formatter with locale-aware formatting
                const numberFormatter = new Intl.NumberFormat(locale, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                });

                let displayAccuracyValue: string;
                if (!Number.isNaN(accuracyValueF)) {
                  if (useImperial) {
                    // Keep Fahrenheit units with locale-aware number formatting
                    displayAccuracyValue = `±${numberFormatter.format(accuracyValueF)}°F`;
                  } else {
                    // Convert Fahrenheit tolerance to Celsius tolerance
                    const accuracyValueC = (accuracyValueF * 5) / 9;
                    displayAccuracyValue = `±${numberFormatter.format(accuracyValueC)}°C`;
                  }
                } else {
                  // Fallback to original accuracy string if parsing failed
                  displayAccuracyValue = sensor.accuracy;
                }

                formattedAccuracy = `${displayAccuracyValue} @ ${tempValue}`;
              }

              return (
                <tr key={sensor.type}>
                  <td className="px-6 py-4 text-neutral-900">{sensor.type}</td>
                  <td className="px-6 py-4 text-neutral-600">{range}</td>
                  <td className="px-6 py-4 text-neutral-600">{formattedAccuracy}</td>
                  <td className="px-6 py-4 text-neutral-600">{sensor.output}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
