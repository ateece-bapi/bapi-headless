'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import { pressureRanges, type PressureData } from '@/data/pressureTables';

// Helper component to render pressure table
function PressureTable({ data, t }: { data: PressureData; t: any }) {
  if (data.length === 0) {
    return (
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 text-center">
        <p className="text-neutral-700">
          {t('outputTables.emptyTable')}
        </p>
      </div>
    );
  }

  const rowsPerColumn = Math.ceil(data.length / 2);
  const column1 = data.slice(0, rowsPerColumn);
  const column2 = data.slice(rowsPerColumn);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[column1, column2].map((column, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-neutral-300">
            <thead>
              <tr className="bg-neutral-200">
                <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  W.C.
                </th>
                <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  Pascals
                </th>
                <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  4 to 20mA
                </th>
                <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  0 to 5V
                </th>
                <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  0 to 10V
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([wc, pascals, ma, v5, v10], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                    {wc.toFixed(3)}
                  </td>
                  <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                    {pascals.toFixed(2)}
                  </td>
                  <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                    {ma.toFixed(2)}
                  </td>
                  <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                    {v5.toFixed(2)}
                  </td>
                  <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                    {v10.toFixed(2)}
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

export default function PressureTransmittersPage() {
  const t = useTranslations('pressureTransmittersPage');
  const [activeTab, setActiveTab] = useState<string>('0-0.10');
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
          <div className="prose prose-lg max-w-none space-y-4">
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph1')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph2')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph3')}
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-600">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                {t('features.accuracy.value')}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {t('features.accuracy.title')}
              </h3>
              <p className="text-sm text-neutral-700">
                {t('features.accuracy.description')}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                {t('features.compensation.value')}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {t('features.compensation.title')}
              </h3>
              <p className="text-sm text-neutral-700">
                {t('features.compensation.description')}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                {t('features.sensor.value')}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {t('features.sensor.title')}
              </h3>
              <p className="text-sm text-neutral-700">
                {t('features.sensor.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('specifications.heading')}
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid divide-y divide-neutral-200">
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specifications.outputRanges.title')}
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specifications.outputRanges.value')}
                </p>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">{t('specifications.power.title')}</h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between">
                    <span>{t('specifications.power.ma')}</span>
                    <span className="font-medium">{t('specifications.power.maValue')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('specifications.power.v5')}</span>
                    <span className="font-medium">{t('specifications.power.v5Value')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('specifications.power.v10')}</span>
                    <span className="font-medium">{t('specifications.power.v10Value')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.powerConsumption.title')}
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div>{t('specifications.powerConsumption.dc')}</div>
                  <div>{t('specifications.powerConsumption.ac')}</div>
                  <div>{t('specifications.powerConsumption.ma')}</div>
                </div>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.pressureRanges.title')}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary-600 mb-2">
                      {t('specifications.pressureRanges.inchesWC.title')}
                    </h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <div className="font-medium">{t('specifications.pressureRanges.inchesWC.lowUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.inchesWC.lowUnidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.inchesWC.lowBidirectional')}</div>
                      <div>{t('specifications.pressureRanges.inchesWC.lowBidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.inchesWC.standardUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.inchesWC.standardUnidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.inchesWC.standardBidirectional')}</div>
                      <div>{t('specifications.pressureRanges.inchesWC.standardBidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.inchesWC.highUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.inchesWC.highUnidirectionalValues')}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-600 mb-2">
                      {t('specifications.pressureRanges.pascals.title')}
                    </h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <div className="font-medium">{t('specifications.pressureRanges.pascals.lowUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.pascals.lowUnidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.pascals.lowBidirectional')}</div>
                      <div>{t('specifications.pressureRanges.pascals.lowBidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.pascals.standardUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.pascals.standardUnidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.pascals.standardBidirectional')}</div>
                      <div>{t('specifications.pressureRanges.pascals.standardBidirectionalValues')}</div>
                      <div className="font-medium mt-2">{t('specifications.pressureRanges.pascals.highUnidirectional')}</div>
                      <div>{t('specifications.pressureRanges.pascals.highUnidirectionalValues')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.accuracy.title')}
                </h3>
                <div className="space-y-2 text-neutral-700">
                  <div>
                    <span className="font-semibold text-primary-600">{t('specifications.accuracy.lowRangeWC')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600">{t('specifications.accuracy.lowRangePa')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600">
                      {t('specifications.accuracy.standardHighRange')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    {t('specifications.temperatureLimits.title')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-700">{t('specifications.temperatureLimits.storage')}</span>
                      <span className="text-neutral-900 font-medium">
                        {t('specifications.temperatureLimits.storageValue')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700">{t('specifications.temperatureLimits.operational')}</span>
                      <span className="text-neutral-900 font-medium">
                        {t('specifications.temperatureLimits.operationalValue')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700">{t('specifications.temperatureLimits.compensated')}</span>
                      <span className="text-neutral-900 font-medium">
                        {t('specifications.temperatureLimits.compensatedValue')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.operatingRH.title')}
                  </h3>
                  <p className="text-primary-600 font-bold">
                    {t('specifications.operatingRH.value')}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{t('specifications.media.title')}</h3>
                <p className="text-neutral-700">
                  {t('specifications.media.value')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pressure Transmitter Output Tables */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputTables.heading')}
          </h2>

          {/* Tab Navigation - Organized by Unit Type */}
          <div className="border-b-2 border-neutral-200 mb-8">
            <div className="flex flex-wrap gap-2 px-2 pb-2">
              {/* Water Column Tabs */}
              <div className="w-full mb-2">
                <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide px-2">
                  {t('outputTables.inchesWCHeading')}
                </h3>
              </div>
              {pressureRanges.map(range => (
                <button
                  key={range.id}
                  onClick={() => setActiveTab(range.id)}
                  className={`px-4 py-2 font-semibold transition-all whitespace-nowrap text-sm rounded-t ${
                    activeTab === range.id
                      ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                  role="tab"
                  aria-selected={activeTab === range.id}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {pressureRanges.map(range => (
              activeTab === range.id && (
                <div key={range.id} className="bg-white rounded-lg">
                  <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                    {t('outputTables.tableHeading', { range: range.label })}
                  </h3>
                  <PressureTable data={range.data} t={t} />
                </div>
              )
            ))}
          </div>
        </section>

        {/* Using the Tables Note */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">
              {t('usingTables.heading')}
            </h3>
            <p className="text-neutral-700">
              {t('usingTables.description')}
            </p>
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
              href="/products/pressure-sensors"
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
