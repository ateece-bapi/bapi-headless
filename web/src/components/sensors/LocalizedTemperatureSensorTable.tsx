'use client';

import { useTranslations } from 'next-intl';
import { TemperatureSensorTable } from './TemperatureSensorTable';

/**
 * Localized wrapper for TemperatureSensorTable
 * Uses next-intl translations for table headers
 * Use this in locale-aware routes ([locale]/...)
 */
export function LocalizedTemperatureSensorTable() {
  const t = useTranslations('productPage.sensorSpecs');

  return (
    <TemperatureSensorTable
      labels={{
        sensorType: t('sensorType'),
        range: t('range'),
        accuracy: t('accuracy'),
        output: t('output'),
      }}
    />
  );
}
