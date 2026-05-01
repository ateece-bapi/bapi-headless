'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import {
  ad592Standard,
  ad59210K,
  type AD592Data,
  type AD59210KData,
} from '@/data/semiconductorTables';

type SemiconductorType = 'AD592' | 'AD592-10K';

// Helper component for AD592 Standard table (4 columns: °F, °C, µA, Volts)
function AD592StandardTable({ data }: { data: AD592Data }) {
  const rowsPerColumn = Math.ceil(data.length / 3);
  const column1 = data.slice(0, rowsPerColumn);
  const column2 = data.slice(rowsPerColumn, rowsPerColumn * 2);
  const column3 = data.slice(rowsPerColumn * 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[column1, column2, column3].map((column, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-neutral-300">
            <thead>
              <tr className="bg-neutral-200">
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °F
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °C
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  µA
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  Volts
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([tempF, tempC, microAmps, volts], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempF}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempC}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {microAmps}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {volts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// Helper component for AD592-10K table (3 columns: °F, °C, Volts)
function AD59210KTable({ data }: { data: AD59210KData }) {
  const rowsPerColumn = Math.ceil(data.length / 3);
  const column1 = data.slice(0, rowsPerColumn);
  const column2 = data.slice(rowsPerColumn, rowsPerColumn * 2);
  const column3 = data.slice(rowsPerColumn * 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[column1, column2, column3].map((column, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-neutral-300">
            <thead>
              <tr className="bg-neutral-200">
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °F
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °C
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  Volts
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([tempF, tempC, volts], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempF}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempC}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {volts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default function SemiconductorOverviewPage() {
  const t = useTranslations('semiconductorPage');
  const [activeTab, setActiveTab] = useState<SemiconductorType>('AD592');
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/sensor-specs"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            {t('breadcrumb.back')}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            {t('description.heading')}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              {t.rich('description.paragraph1', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph2')}
            </p>
          </div>
        </section>

        {/* Specification Terms */}
        <section className="max-w-4xl mx-auto mb-16 bg-neutral-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            {t('specifications.heading')}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {t('specifications.interchangeability.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.interchangeability.description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {t('specifications.repeatability.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.repeatability.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Custom Offset Definition and Example */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            {t('customOffset.heading')}
          </h2>

          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-8">
            <p className="text-neutral-700 leading-relaxed mb-8">
              {t('customOffset.description')}
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  {t('customOffset.thermReading.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('customOffset.thermReading.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  {t('customOffset.sensorReading.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('customOffset.sensorReading.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  {t('customOffset.offset.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('customOffset.offset.description')}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 mb-6">
              <p className="text-neutral-700 font-medium mb-4">
                {t('customOffset.maximizeAccuracy')}
              </p>

              <div className="space-y-4 text-neutral-700">
                <div className="border-l-4 border-primary-600 pl-4">
                  <p className="mb-2">
                    <span className="font-semibold">{t('customOffset.example1.thermReading')}</span>
                    <span className="mx-4">{t('customOffset.example1.sensorReading')}</span>
                    <span>{t('customOffset.example1.offset')}</span>
                  </p>
                  <p className="text-sm">
                    {t('customOffset.example1.correction')}
                  </p>
                </div>

                <div className="border-l-4 border-primary-600 pl-4">
                  <p className="mb-2">
                    <span className="font-semibold">{t('customOffset.example2.thermReading')}</span>
                    <span className="mx-4">{t('customOffset.example2.sensorReading')}</span>
                    <span>{t('customOffset.example2.offset')}</span>
                  </p>
                  <p className="text-sm">
                    {t('customOffset.example2.correction')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('specsTable.heading')}
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.interchangeability.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specsTable.interchangeability.value')}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {t('specsTable.interchangeability.note')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.offsetRequirement.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('specsTable.offsetRequirement.description')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.repeatability.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specsTable.repeatability.value')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.linearity.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specsTable.linearity.value')}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {t('specsTable.linearity.note')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.sensorRange.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specsTable.sensorRange.value')}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {t('specsTable.sensorRange.note')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.biasVoltage.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specsTable.biasVoltage.value')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.accuracyReference.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('specsTable.accuracyReference.value')}
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specsTable.temperatureOutputCoefficient.title')}
                </h3>
                <p className="text-neutral-700">
                  <strong>{t('specsTable.temperatureOutputCoefficient.twoWire')}</strong>
                  <br />
                  <strong>{t('specsTable.temperatureOutputCoefficient.threeWire')}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Output Curve Chart */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputCurve.heading')}
          </h2>
          <div className="bg-white rounded-lg border-2 border-neutral-200 p-6 flex justify-center">
            <img
              src="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/Semiconductor_Output_Table.png"
              alt={t('outputCurve.alt')}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-center text-sm text-neutral-600 mt-4">
            {t('outputCurve.caption')}
          </p>
        </section>

        {/* Output Tables Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputTables.heading')}
          </h2>

          {/* Tab Navigation */}
          <div className="border-b-2 border-neutral-200 mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max px-2">
              <button
                onClick={() => setActiveTab('AD592')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'AD592'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === 'AD592'}
              >
                {t('outputTables.ad592Standard.tabLabel')}
              </button>
              <button
                onClick={() => setActiveTab('AD592-10K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'AD592-10K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === 'AD592-10K'}
              >
                {t('outputTables.ad59210K.tabLabel')}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'AD592' && (
              <div className="bg-white rounded-lg">
                <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                  {t('outputTables.ad592Standard.heading')}
                </h3>
                <p className="text-center text-neutral-600 mb-6">
                  {t('outputTables.ad592Standard.description')}
                </p>
                <AD592StandardTable data={ad592Standard} />
              </div>
            )}

            {activeTab === 'AD592-10K' && (
              <div className="bg-white rounded-lg">
                <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                  {t('outputTables.ad59210K.heading')}
                </h3>
                <p className="text-center text-neutral-600 mb-6">
                  {t('outputTables.ad59210K.description')}
                </p>
                <AD59210KTable data={ad59210K} />
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            {t('cta.heading')}
          </h2>
          <p className="text-neutral-700 mb-6">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/temperature-sensors"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t('cta.browseButton')}
            </Link>
            <Link
              href="/support"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              {t('cta.contactButton')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
