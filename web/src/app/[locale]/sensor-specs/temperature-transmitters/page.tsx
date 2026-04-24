import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: `Temperature Transmitters Overview | BAPI`,
    description:
      'T1K Temperature Transmitters with 4-20mA output for long-distance transmission',
  };
}

export default async function TemperatureTransmittersPage() {
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
            Back to Sensor Specifications
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Temperature Transmitters
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            Precision 4-20mA transmitters for accurate temperature sensing over
            long distances
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* T1K Transmitters Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            T1K Transmitters
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              Temperature transmitters incorporate a platinum 100 Ohm or 1k Ohm
              RTD sensor and an amplifier. These devices provide an accurate and
              predictable 4 to 20mA output over a specified temperature range.
              They are specifically designed for temperature sensing and
              transmission over long distances without degradation of the 4 to
              20mA signal.
            </p>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            T1K Transmitter Specifications
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid divide-y divide-neutral-200">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Sensor
                  </h3>
                  <p className="text-primary-600 font-bold">
                    1000Ω Platinum RTD
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Supply Voltage
                  </h3>
                  <p className="text-primary-600 font-bold">12 to 40 VDC</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">Output</h3>
                <p className="text-primary-600 font-bold text-lg">
                  4 to 20 mA, 0 to 5V, 1 to 5V, 0 to 10V, 2 to 10V
                </p>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Max. Loop Resistance
                  </h3>
                  <p className="text-neutral-700">850Ω at 24VDC</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Span</h3>
                  <p className="text-neutral-700">
                    Min 16.6°C (30°F), Max 555°C (1000°F)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">Zero</h3>
                  <p className="text-neutral-700">
                    Min -100°C (-148°F), Max 482°C (900°F)
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    System Accuracy
                  </h3>
                  <p className="text-primary-600 font-bold">
                    ±0.065% of Span
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Linearity
                </h3>
                <p className="text-neutral-700">±(0.125 x T-20ºC)/100</p>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Operational Humidity
                  </h3>
                  <p className="text-neutral-700">0 to 95%, non-condensing</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Output Current Limits
                  </h3>
                  <p className="text-neutral-700">
                    Less than 1mA and 22.35 ± 0.15 mA
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Power Output Shift
                  </h3>
                  <p className="text-neutral-700">±0.009% of Span to 40VDC</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Connections
                  </h3>
                  <p className="text-neutral-700">
                    Four 22-gauge etched Teflon leads or terminal blocks
                  </p>
                </div>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Operating Temperature
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Transmitter:</span>
                    <span className="text-neutral-900 font-medium">
                      -20 to 70°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Sensor (standard):</span>
                    <span className="text-neutral-900 font-medium">
                      -65 to 105°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">
                      Sensor (available):
                    </span>
                    <span className="text-neutral-900 font-medium">
                      -200 to 600°C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Field Adjustments Note */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Field Adjustments
            </h3>
            <p className="text-neutral-700">
              Each transmitter is calibrated to the specified temperature range
              that is ordered. Field adjustments are not available. If
              adjustments are needed, please contact your BAPI representative.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need a Temperature Transmitter?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our T1K transmitters provide accurate 4-20mA signals for long-distance
            temperature measurement applications.
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
