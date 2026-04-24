import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: `Humidity Transmitters Overview | BAPI`,
    description:
      'High-accuracy humidity transmitters with 4-20mA, 0-5V, or 0-10V output',
  };
}

export default async function HumidityTransmittersPage() {
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
            Humidity Transmitters
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            High-accuracy 4-20mA, 0-5V, and 0-10V humidity transmitters for
            demanding applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Humidity Transmitter Description
          </h2>
          <div className="prose prose-lg max-w-none space-y-4">
            <p className="text-neutral-700 leading-relaxed">
              BAPI humidity transmitters provide a high accuracy 4 to 20mA, 0 to
              5V or 0 to 10V humidity measurement. Accuracies of 2% RH are
              available. Duct and outside air units come with a removable
              sintered stainless steel filter. On duct and outside air units,
              the filter may be cleaned with warm, distilled water.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              These units are microprocessor based and do not require any field
              calibration.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              For all non-room configurations, BAPI humidity transmitters come
              standard in a ruggedized package. Ruggedized transmitters are
              suitable for locations where moisture or condensation may be a
              problem. The potting material used to ruggedize the transmitters
              has a high thermal conductivity to eliminate circuit overheating
              and allow thermal expansion to minimize the stress on the circuit
              components. Due to the extremely low moisture absorption
              properties of the epoxy, a ruggedized transmitter will remain
              operational even if temporarily immersed in water.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Many tests and studies have been conducted on the sensor
              incorporated into these humidity transmitters to assure that they
              provide longterm accuracy and durability. For applications
              requiring even higher accuracy, however, certified units are
              available which have been tested and offset against an NIST
              traceable reference. Please call for details or with specific
              requirements.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-600">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                2% RH
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                High Accuracy
              </h3>
              <p className="text-sm text-neutral-700">
                Precision humidity measurement for critical applications
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                Ruggedized
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Durable Design
              </h3>
              <p className="text-sm text-neutral-700">
                Operational even if temporarily immersed in water
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                No Cal
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Microprocessor Based
              </h3>
              <p className="text-sm text-neutral-700">
                No field calibration required
              </p>
            </div>
          </div>
        </section>

        {/* General Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            General Specifications
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid divide-y divide-neutral-200">
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Output Ranges
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  4 to 20 mA, 0 to 5 V, or 0 to 10 V
                </p>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">Power</h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between">
                    <span>0-5 VDC or 4-20 mA outputs:</span>
                    <span className="font-medium">10 to 35 VDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0-10 VDC Output:</span>
                    <span className="font-medium">15 to 35 VDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0-5 VDC Output (AC):</span>
                    <span className="font-medium">12 to 27 VAC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0-10 VDC Output (AC):</span>
                    <span className="font-medium">15 to 27 VAC</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Power Consumption
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div>
                    <span className="font-medium">DC:</span> 22 mA max (0-5 VDC
                    or 4-20 mA), 6 mA max (0-10 VDC)
                  </div>
                  <div>
                    <span className="font-medium">AC:</span> 0.53 VA max (0-5
                    VDC or 4-20 mA), 0.14 VA max (0-10 VDC)
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Sensing Element
                  </h3>
                  <p className="text-neutral-700">Capacitive type humidity sensor</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Operating RH Range
                  </h3>
                  <p className="text-primary-600 font-bold">
                    0 to 100 %RH (non-condensing)
                  </p>
                </div>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Operating Temperature Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Room:</span>
                    <span className="text-neutral-900 font-medium">
                      0 to 70°C (32 to 158°F)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Duct & Outside:</span>
                    <span className="text-neutral-900 font-medium">
                      -20 to 70°C (-4 to 158°F)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Accuracy Range
                  </h3>
                  <p className="text-neutral-700">from 10 to 90% RH at 25°C</p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Response Time
                  </h3>
                  <p className="text-primary-600 font-bold">
                    8 seconds
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    in moving air for a 63% step
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">Drift</h3>
                <p className="text-primary-600 font-bold">&lt;0.5% RH per year</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need a Humidity Transmitter?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our humidity transmitters provide accurate, long-term reliable
            measurement with minimal drift.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/humidity-sensors"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Humidity Sensors
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
