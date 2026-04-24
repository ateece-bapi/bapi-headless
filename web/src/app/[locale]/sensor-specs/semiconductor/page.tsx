import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: `Semiconductor Overview | BAPI`,
    description:
      'Semiconductor temperature sensors with linear output and NIST-traceable accuracy',
  };
}

export default async function SemiconductorOverviewPage() {
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
            Semiconductor Overview
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            The most linear temperature sensors for commercial HVAC applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Semiconductor Description
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              BAPI semiconductors are designed to exhibit a defined current
              output directly proportional to the absolute temperature (°K).
              This property makes them <strong>the most linear</strong> of all
              the common commercial HVAC sensing elements. By putting this
              current output across a resistor, a proportional output voltage is
              produced.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              The AD592 semiconductor temperature sensor supplied with BAPI
              products provides a two wire 248 to 378 micro amp output or a
              three wire 2.48 to 3.78 volt output over a range of -13 to 221 °F
              (-25 to 105 °C). These units are offset using equipment traceable
              to the National Institute of Standards and Technology (NIST). Each
              unit is then labeled with the actual temperature and the
              corresponding offset.
            </p>
          </div>
        </section>

        {/* Specification Terms */}
        <section className="max-w-4xl mx-auto mb-16 bg-neutral-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Definition of Specification Terms
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Interchangeability Tolerance (Accuracy)
              </h3>
              <p className="text-neutral-700">
                The maximum amount that sensors following the same curve will
                differ from each other.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Repeatability
              </h3>
              <p className="text-neutral-700">
                A measure of a sensor's ability to repeat the same output value
                for a given input value.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Semiconductor Specifications
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Interchangeability Tolerance (Accuracy)
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  Offset to 0.1 °C (0.18 °F)
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  NIST Traceable
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Offset Requirement
                </h3>
                <p className="text-neutral-700">
                  Required to achieve maximum accuracy. Each sensor includes a
                  custom offset listed on each sensor.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Repeatability
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  ± 0.10 °C (± 0.18°F)
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Linearity
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  ± 0.15 °C max
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  from 0 to 70 °C (32 to 158°F)
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Sensor Range
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  -25 to 105 °C
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  (-13 to 221 °F) [248 to 378 °K]
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Bias Voltage
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  5 to 30 VDC
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Accuracy Reference
                </h3>
                <p className="text-neutral-700">
                  298.2 mA @ 25°C or 2.982 V @ 25°C
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Temperature Output Coefficient
                </h3>
                <p className="text-neutral-700">
                  <strong>2 wire:</strong> 1 µA/°C (0.556 µA/°F) [1 µA/°K]
                  <br />
                  <strong>3 wire:</strong> 10 mV/°C (5.556 mV/°F) [10 mV/°K]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Output Tables Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Semiconductor Output Tables
          </h2>

          <div className="grid gap-8">
            {[
              {
                type: 'AD592 Semiconductor',
                desc: 'Standard AD592 current/voltage output',
              },
              {
                type: 'AD592-10K Semiconductor',
                desc: 'AD592 Semiconductor with a 10K shunt resistor',
              },
            ].map(({ type, desc }) => (
              <div
                key={type}
                className="bg-white border border-neutral-200 rounded-lg p-8"
              >
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {type}
                </h3>
                <p className="text-neutral-600 mb-4">{desc}</p>
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 text-center">
                  <p className="text-neutral-700">
                    Detailed current/voltage vs. temperature tables for {type}{' '}
                    are available in product datasheets.
                  </p>
                  <Link
                    href="/support"
                    className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Contact Support for Specifications →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need Help with Semiconductor Sensors?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our technical team can help you understand if semiconductor sensors
            are right for your application.
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
