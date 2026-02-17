'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { formatTemperatureRange, formatMeasurement } from '@/lib/utils/locale';
import type { LanguageCode } from '@/types/region';

interface TemperatureSensorSpec {
  type: string;
  rangeMin: number;
  rangeMax: number;
  accuracy: string;
  accuracyTemp?: number;
  output: string;
}

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

export function TemperatureSensorTable() {
  const params = useParams();
  const locale = (params?.locale as LanguageCode) || 'en';
  const t = useTranslations('productPage.sensorSpecs');

  return (
    <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                {t('sensorType')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">{t('range')}</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                {t('accuracy')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">{t('output')}</th>
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
              let accuracy = sensor.accuracy;
              if (sensor.accuracyTemp) {
                const accuracyValue = sensor.accuracy.match(/±[\d.]+/)?.[0] || '±0.2';
                const tempValue = formatMeasurement(sensor.accuracyTemp, 'fahrenheit', locale);
                accuracy = `${accuracyValue}°F @ ${tempValue}`;
              }

              return (
                <tr key={sensor.type}>
                  <td className="px-6 py-4 text-neutral-900">{sensor.type}</td>
                  <td className="px-6 py-4 text-neutral-600">{range}</td>
                  <td className="px-6 py-4 text-neutral-600">{accuracy}</td>
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
