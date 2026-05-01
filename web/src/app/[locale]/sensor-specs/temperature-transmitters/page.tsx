'use client';

import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import { temperatureTransmitterOutput } from '@/data/temperatureTransmitterTable';
import { useTranslations } from 'next-intl';

export default function TemperatureTransmittersPage() {
  const t = useTranslations('temperatureTransmittersPage');
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
        {/* Temperature Transmitter Description */}
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
            <p className="text-neutral-700 leading-relaxed font-mono text-sm bg-neutral-50 p-4 rounded">
              {t('description.paragraph4')}<br />
              {t('description.paragraph4b')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph5')}<br />
              {t('description.paragraph5b')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph6')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('description.paragraph7')}
            </p>
          </div>
        </section>

        {/* Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('specifications.heading')}
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid divide-y divide-neutral-200">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.sensor.title')}
                  </h3>
                  <p className="text-primary-600 font-bold">
                    {t('specifications.sensor.value')}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.supplyVoltage.title')}
                  </h3>
                  <p className="text-primary-600 font-bold">{t('specifications.supplyVoltage.value')}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{t('specifications.output.title')}</h3>
                <p className="text-primary-600 font-bold text-lg">
                  {t('specifications.output.value')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.maxLoopResistance.title')}
                  </h3>
                  <p className="text-neutral-700">{t('specifications.maxLoopResistance.value')}</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">{t('specifications.span.title')}</h3>
                  <p className="text-neutral-700">
                    {t('specifications.span.value')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">{t('specifications.zero.title')}</h3>
                  <p className="text-neutral-700">
                    {t('specifications.zero.value')}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.systemAccuracy.title')}
                  </h3>
                  <p className="text-primary-600 font-bold">
                    {t('specifications.systemAccuracy.value')}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {t('specifications.linearity.title')}
                </h3>
                <p className="text-neutral-700">{t('specifications.linearity.value')}</p>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.operationalHumidity.title')}
                  </h3>
                  <p className="text-neutral-700">{t('specifications.operationalHumidity.value')}</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.outputCurrentLimits.title')}
                  </h3>
                  <p className="text-neutral-700">
                    {t('specifications.outputCurrentLimits.value')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.powerOutputShift.title')}
                  </h3>
                  <p className="text-neutral-700">{t('specifications.powerOutputShift.value')}</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {t('specifications.connections.title')}
                  </h3>
                  <p className="text-neutral-700">
                    {t('specifications.connections.value')}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  {t('specifications.operatingTemperature.title')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">{t('specifications.operatingTemperature.transmitter')}</span>
                    <span className="text-neutral-900 font-medium">
                      {t('specifications.operatingTemperature.transmitterValue')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">{t('specifications.operatingTemperature.sensorStandard')}</span>
                    <span className="text-neutral-900 font-medium">
                      {t('specifications.operatingTemperature.sensorStandardValue')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">
                      {t('specifications.operatingTemperature.sensorAvailable')}
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {t('specifications.operatingTemperature.sensorAvailableValue')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Temperature Transmitter Output Table */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            {t('outputTable.heading')}
          </h2>

          <div className="bg-white rounded-lg border-2 border-neutral-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              {/* Left Column (0-50°F) */}
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-200">
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        °F
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        °C
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        mA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {temperatureTransmitterOutput.slice(0, 51).map(([tempF, tempC, ma]) => (
                      <tr key={tempF} className="hover:bg-neutral-50">
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {tempF}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {tempC.toFixed(2)}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {ma.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Column (51-100°F) */}
              <div className="overflow-x-auto">
                <table className="w-full border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-200">
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        °F
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        °C
                      </th>
                      <th className="px-3 py-2 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                        mA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {temperatureTransmitterOutput.slice(51).map(([tempF, tempC, ma]) => (
                      <tr key={tempF} className="hover:bg-neutral-50">
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {tempF}
                        </td>
                        <td className="px-3 py-1 border border-neutral-300 text-center text-sm">
                          {tempC.toFixed(2)}
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

        {/* Field Adjustments Note */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">
              {t('fieldAdjustments.heading')}
            </h3>
            <p className="text-neutral-700">
              {t('fieldAdjustments.description')}
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
