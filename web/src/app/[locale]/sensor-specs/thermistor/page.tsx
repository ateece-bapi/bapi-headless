'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import {
  thermistor18K,
  thermistor22K,
  thermistor3K,
  thermistor325K,
  thermistor33K,
  thermistor10K2,
  thermistor10K3,
  thermistor10K3_11K,
  thermistor10K4,
  thermistor20K,
  thermistor47K,
  thermistor50K,
  thermistor100K,
  type ThermistorData,
} from '@/data/thermistorTables';

type ThermistorType = '1.8K' | '2.2K' | '3K' | '3.25K' | '3.3K' | '10K-2' | '10K-3' | '10K-3-11K' | '10K-4' | '20K' | '47K' | '50K' | '100K';

// Helper component to render thermistor table with 3-column layout
function ThermistorTable({ data }: { data: ThermistorData }) {
  // Split data into 3 columns for compact display
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
                  Ohms
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([tempF, tempC, ohms], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempF}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempC}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {ohms}
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

export default function ThermistorOverviewPage() {
  const t = useTranslations('thermistorPage');
  const [activeTab, setActiveTab] = useState<ThermistorType>('10K-3');
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
              {t('description.paragraph1')}
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              {t('description.paragraph2')}
            </p>
            <p className="text-sm text-neutral-600 italic">
              {t('description.footnote')}
            </p>
          </div>
        </section>

        {/* Specifications Section */}
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
                {t('specifications.dissipation.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.dissipation.description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {t('specifications.stability.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.stability.description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {t('specifications.operatingRange.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.operatingRange.description')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {t('specifications.thermalTime.title')}
              </h3>
              <p className="text-neutral-700">
                {t('specifications.thermalTime.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Thermistor Specifications Table */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('specsTable.heading')}
          </h2>
          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 border-b-2 border-neutral-200">
                      {t('specsTable.headers.type')}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 border-b-2 border-neutral-200">
                      {t('specsTable.headers.tolerance')}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900 border-b-2 border-neutral-200">
                      {t('specsTable.headers.range')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">1.8K</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.4°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -55 to 105 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">2.2K**</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      0 to 70 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">3K**</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.4°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -50 to 110 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">3.3K</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      0 to 70 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">10K-2</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -80 to 120 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">10K-3</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -55 to 125 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">10K-3(1%)**</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -45 to 105 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">10K-4</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -40 to 150 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">20K</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -55 to 125 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">47K**</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -40 to 110 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">50K</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -55 to 125 °C
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900 font-medium">100K*</td>
                    <td className="px-6 py-4 text-neutral-700">
                      ± 0.2°C @ 25 °C
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      -55 to 125 °C
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm text-neutral-600 max-w-4xl mx-auto">
            <p>
              {t('specsTable.footnotes.note1')}
            </p>
            <p>
              {t('specsTable.footnotes.note2')}
            </p>
            <p>
              {t('specsTable.footnotes.note3')}
            </p>
          </div>
        </section>

        {/* Typical Output Curve */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputCurve.heading')}
          </h2>
          <div className="bg-white rounded-lg border-2 border-neutral-200 p-6 flex justify-center">
            <img
              src="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/Thermistor_output_chart.png"
              alt={t('outputCurve.imageAlt')}
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
                onClick={() => setActiveTab('1.8K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '1.8K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '1.8K'}
              >
                1.8K
              </button>
              <button
                onClick={() => setActiveTab('2.2K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '2.2K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '2.2K'}
              >
                2.2K
              </button>
              <button
                onClick={() => setActiveTab('3K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '3K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '3K'}
              >
                3K
              </button>
              <button
                onClick={() => setActiveTab('3.25K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '3.25K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '3.25K'}
              >
                3.25K
              </button>
              <button
                onClick={() => setActiveTab('3.3K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '3.3K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '3.3K'}
              >
                3.3K
              </button>
              <button
                onClick={() => setActiveTab('10K-2')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '10K-2'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '10K-2'}
              >
                10K-2
              </button>
              <button
                onClick={() => setActiveTab('10K-3')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '10K-3'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '10K-3'}
              >
                10K-3
              </button>
              <button
                onClick={() => setActiveTab('10K-3-11K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '10K-3-11K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '10K-3-11K'}
              >
                10K-3 (11K)
              </button>
              <button
                onClick={() => setActiveTab('10K-4')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '10K-4'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '10K-4'}
              >
                10K-4
              </button>
              <button
                onClick={() => setActiveTab('20K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '20K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '20K'}
              >
                20K
              </button>
              <button
                onClick={() => setActiveTab('47K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '47K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '47K'}
              >
                47K
              </button>
              <button
                onClick={() => setActiveTab('50K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '50K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '50K'}
              >
                50K
              </button>
              <button
                onClick={() => setActiveTab('100K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === '100K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === '100K'}
              >
                100K
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === '1.8K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                1.8K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor18K} />
            </div>
          )}

          {activeTab === '2.2K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                2.2K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor22K} />
            </div>
          )}

          {activeTab === '3K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                3K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor3K} />
            </div>
          )}

          {activeTab === '3.25K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                3.25K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor325K} />
            </div>
          )}

          {activeTab === '3.3K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                3.3K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor33K} />
            </div>
          )}

          {activeTab === '10K-2' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                10K-2 Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor10K2} />
            </div>
          )}

          {activeTab === '10K-3' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                10K-3 Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor10K3} />
            </div>
          )}

          {activeTab === '10K-3-11K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                10K-3 (11K) Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor10K3_11K} />
            </div>
          )}

          {activeTab === '10K-4' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                10K-4 Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor10K4} />
            </div>
          )}

          {activeTab === '20K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                20K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor20K} />
            </div>
          )}

          {activeTab === '47K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                47K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor47K} />
            </div>
          )}

          {activeTab === '50K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                50K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor50K} />
            </div>
          )}

          {activeTab === '100K' && (
            <div className="bg-white rounded-lg">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-6">
                100K Thermistor Output Table
              </h3>
              <ThermistorTable data={thermistor100K} />
            </div>
          )}

          {/* Placeholder for remaining tabs */}
          {!['1.8K', '2.2K', '3K', '3.25K', '3.3K', '10K-2', '10K-3', '10K-3-11K', '10K-4', '20K', '47K', '50K', '100K'].includes(activeTab) && (
            <div className="bg-white border border-neutral-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                {activeTab === '10K-3-11K' ? '10K-3 (11K)' : activeTab} Thermistor Output Table
              </h3>
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 text-center">
                <p className="text-neutral-700">
                  Detailed resistance vs. temperature tables for {activeTab === '10K-3-11K' ? '10K-3 (11K)' : activeTab}{' '}
                  thermistors are available in product datasheets.
                </p>
                <Link
                  href="/support"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Contact Support for Specifications →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need Help Selecting a Thermistor?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our technical team can help you choose the right sensor for your
            application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/temperature-sensors"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Temperature Sensors
            </Link>
            <Link
              href="/support"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
