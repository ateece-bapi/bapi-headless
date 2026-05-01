'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import { humidityTransmitterOutput } from '@/data/humidityTransmitterTable';

export default function HumidityTransmittersPage() {
  const t = useTranslations('humidityTransmittersPage');
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
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph4')}
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
                {t('features.durability.value')}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {t('features.durability.title')}
              </h3>
              <p className="text-sm text-neutral-700">
                {t('features.durability.description')}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                {t('features.calibration.value')}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                {t('features.calibration.title')}
              </h3>
              <p className="text-sm text-neutral-700">
                {t('features.calibration.description')}
              </p>
            </div>
          </div>
        </section>

        {/* General Specifications */}
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
                    <span>{t('specifications.power.v5OrMa')}</span>
                    <span className="font-medium">{t('specifications.power.v5OrMaValue')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('specifications.power.v10')}</span>
                    <span className="font-medium">{t('specifications.power.v10Value')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('specifications.power.v5AC')}</span>
                    <span className="font-medium">{t('specifications.power.v5ACValue')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('specifications.power.v10AC')}</span>
                    <span className="font-medium">{t('specifications.power.v10ACValue')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.powerConsumption.title')}
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div>
                    {t('specifications.powerConsumption.dc')}
                  </div>
                  <div>
                    {t('specifications.powerConsumption.ac')}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.sensingElement.title')}
                  </h3>
                  <p className="text-neutral-700">{t('specifications.sensingElement.value')}</p>
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

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.operatingTemperature.title')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">{t('specifications.operatingTemperature.room')}</span>
                    <span className="text-neutral-900 font-medium">
                      {t('specifications.operatingTemperature.roomValue')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">{t('specifications.operatingTemperature.ductOutside')}</span>
                    <span className="text-neutral-900 font-medium">
                      {t('specifications.operatingTemperature.ductOutsideValue')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.accuracyRange.title')}
                  </h3>
                  <p className="text-neutral-700">{t('specifications.accuracyRange.value')}</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.responseTime.title')}
                  </h3>
                  <p className="text-primary-600 font-bold">
                    {t('specifications.responseTime.value')}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {t('specifications.responseTime.note')}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{t('specifications.drift.title')}</h3>
                <p className="text-primary-600 font-bold">{t('specifications.drift.value')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Humidity Transmitter Output Table */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputTable.heading')}
          </h2>

          <div className="bg-white rounded-lg border-2 border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              {/* Left Column */}
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-200">
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        %RH
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        0-5V
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        0-10V
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        mA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {humidityTransmitterOutput.slice(0, 51).map(([rh, v5, v10, ma]) => (
                      <tr key={rh} className="hover:bg-neutral-50">
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {rh}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {v5.toFixed(2)}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {v10.toFixed(2)}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {ma.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Column */}
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-200">
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        %RH
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        0-5V
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        0-10V
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        mA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {humidityTransmitterOutput.slice(51).map(([rh, v5, v10, ma]) => (
                      <tr key={rh} className="hover:bg-neutral-50">
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {rh}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {v5.toFixed(2)}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {v10.toFixed(2)}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {ma.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
              href="/products/humidity-sensors"
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
