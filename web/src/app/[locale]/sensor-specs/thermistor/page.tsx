import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'SensorSpecs' });

  return {
    title: `${t('thermistorOverview')} | BAPI`,
    description: t('thermistorDescription'),
  };
}

export default async function ThermistorOverviewPage() {
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
            Thermistor Overview
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            Thermally sensitive resistors with exceptional accuracy and
            reliability for HVAC applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Thermistor Description
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              BAPI Thermistors are thermally sensitive resistors known for
              exhibiting a large change in resistance with only a small change
              in temperature. It is important to note that a thermistor's change
              in resistance is non-linear. It follows a pre-defined curve which
              is provided by the thermistor manufacturer.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Thermistors are manufactured to follow a specific curve with a
              high degree of accuracy. All BAPI thermistors have a standard
              accuracy of ± 0.2 °C throughout the commercial temperature range
              of 0 to 70 °C. BAPI also has available a higher accuracy sensor
              for meeting tougher specs. The extra precision [X line has an
              initial accuracy of ± 0.1 °C throughout the commercial temperature
              range of 0 to 70 °C. Please call for availability and pricing on
              [X line thermistors. Both accuracy levels allow BAPI thermistors
              to be interchanged without the extra expense of offsetting the
              controller.
            </p>
            <p className="text-sm text-neutral-600 italic">
              *All Passive Thermistors 10K Ω and smaller are CE compliant
            </p>
          </div>
        </section>

        {/* Specifications Section */}
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
                The maximum amount that thermistors following the same curve
                will differ from each other.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Dissipation Constant
              </h3>
              <p className="text-neutral-700">
                The power needed to raise the thermistor's body temperature by
                1°C. At the heart of all BAPI thermistor products is a sensor
                with a 2.7 mW/°C dissipation constant to ensure that
                self-heating stays at an absolute minimum.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Stability (Drift)
              </h3>
              <p className="text-neutral-700">
                The amount that the resistance characteristics of a thermistor
                will change. BAPI uses only the highest quality, "pre-aged"
                thermistors with very small drift values. Over a ten year span,
                BAPI thermistors will not change more than 0.1°C.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Operating Range
              </h3>
              <p className="text-neutral-700">
                The operating range shown is for the thermistor only. The
                mounting package may further limit the operating range and is
                described on each mounting type specification. The thermal time
                constant will also be affected based on the added mass of the
                stainless steel probe and moisture protection encapsulation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Thermal Time Constant
              </h3>
              <p className="text-neutral-700">
                Bare sensors are typically measured and specified in still air
                and are timed at the statistical 63.2% of the step temperature
                change. A stirred liquid test will typically result in a much
                faster response time and is also timed at 63.2% of the step
                temperature change. The time constant is always the same
                whatever the temperature step change may be.
              </p>
            </div>
          </div>
        </section>

        {/* Output Tables Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Thermistor Output Tables
          </h2>

          <div className="grid gap-8">
            {[
              '1.8K',
              '2.2K',
              '3K',
              '3.25K',
              '3.3K',
              '10K-2',
              '10K-3',
              '10K-3 (11K)',
              '10K-4',
              '20K',
              '47K',
              '50K',
              '100K',
            ].map((type) => (
              <div
                key={type}
                className="bg-white border border-neutral-200 rounded-lg p-8"
              >
                <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                  {type} Thermistor Output Table
                </h3>
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 text-center">
                  <p className="text-neutral-700">
                    Detailed resistance vs. temperature tables for {type}{' '}
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
            ))}
          </div>
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
