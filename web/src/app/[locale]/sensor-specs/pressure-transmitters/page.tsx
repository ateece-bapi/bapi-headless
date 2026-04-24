import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: `Pressure Transmitters Overview | BAPI`,
    description:
      'Silicon piezoresistive pressure sensors with digital compensation for high accuracy',
  };
}

export default async function PressureTransmittersPage() {
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
            Pressure Transmitters
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            Precision silicon sensors with digital compensation for ultimate
            accuracy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Pressure Sensor Description
          </h2>
          <div className="prose prose-lg max-w-none space-y-4">
            <p className="text-neutral-700 leading-relaxed">
              The focal point of any sensor is the sensing element itself, and
              BAPI has gone to great lengths to produce one of the best sensors
              on the market today. The heart of every BAPI unit is a
              micromachined, single-crystal silicon, pressure sensor. Each
              sensor is fabricated using the same integrated circuit technology
              used to make millions of cell phones, game machines and personal
              computers. To control and maintain the quality of these sensors,
              BAPI is involved in all phases of production from design to use.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Silicon does bring with it one undesired trait —thermal
              sensitivity. The traditional method of compensating for this
              thermal sensitivity is an external circuit with discreet
              resistors, some of which have their own temperature dependencies,
              introducing more error. BAPI uses a different, unique approach. We
              employ a custom compensation ASIC (Application Specific Integrated
              Circuit) that uses digital compensation while maintaining an
              analog signal path, producing a sensor that is precise and
              interchangeable.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Because of the innovative sensor and digital temperature
              compensation circuit, we are able to produce a highly accurate and
              stable product. This accuracy is verified during final calibration
              at our factory using a pressure-controlled source accurate to
              0.00015 inch of water and traceable to NIST standards.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-600">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                ±0.25%
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                High Accuracy
              </h3>
              <p className="text-sm text-neutral-700">
                NIST-traceable accuracy of ±0.25% for most ranges
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                Digital
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Digital Compensation
              </h3>
              <p className="text-sm text-neutral-700">
                ASIC-based digital compensation eliminates thermal drift
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                Silicon
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Piezoresistive
              </h3>
              <p className="text-sm text-neutral-700">
                Single-crystal silicon sensor fabricated with IC technology
              </p>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Specifications
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <div className="grid divide-y divide-neutral-200">
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Output Ranges
                </h3>
                <p className="text-primary-600 font-bold text-lg">
                  4 to 20 mA, 0 to 5 V or 0 to 10V
                </p>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">Power</h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between">
                    <span>4-20 mA output:</span>
                    <span className="font-medium">7 to 45 VDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0-5 VDC output:</span>
                    <span className="font-medium">7 to 45 VDC or 7 to 32 VAC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0-10 VDC output:</span>
                    <span className="font-medium">13 to 45 VDC or 13 to 32 VAC</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Power Consumption
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div>4.9 mA max DC at 0-5 VDC or 0-10 VDC Output</div>
                  <div>0.12 VA max AC at 0-5 VDC or 0-10 VDC Output</div>
                  <div>20 mA max, DC only at 4-20 mA Output</div>
                </div>
              </div>

              <div className="p-6 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Pressure Ranges
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-primary-600 mb-2">
                      Inches W.C.
                    </h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <div className="font-medium">Low Range Unidirectional</div>
                      <div>0 to 0.10", 0 to 0.25", 0 to 0.50", 0 to 0.75", 0 to 1.00"</div>
                      <div className="font-medium mt-2">Low Range Bi-directional</div>
                      <div>±0.10", ±0.25", ±0.50", ±0.75", ±1.00"</div>
                      <div className="font-medium mt-2">Standard Range Unidirectional</div>
                      <div>0 to 1.00", 0 to 2.00", 0 to 2.50", 0 to 3.00", 0 to 5.00"</div>
                      <div className="font-medium mt-2">Standard Range Bi-directional</div>
                      <div>±1.00", ±2.00", ±2.50", ±3.00", ±5.00"</div>
                      <div className="font-medium mt-2">High Range Unidirectional</div>
                      <div>0 to 5", 0 to 10", 0 to 15", 0 to 25", 0 to 30"</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-600 mb-2">
                      Pascals
                    </h4>
                    <div className="space-y-1 text-sm text-neutral-700">
                      <div className="font-medium">Low Range Unidirectional</div>
                      <div>0 to 30, 0 to 50, 0 to 100, 0 to 175, 0 to 250</div>
                      <div className="font-medium mt-2">Low Range Bi-directional</div>
                      <div>±30, ±50, ±100, ±175, ±250</div>
                      <div className="font-medium mt-2">Standard Range Unidirectional</div>
                      <div>0 to 250, 0 to 300, 0 to 500, 0 to 1,000, 0 to 1,250</div>
                      <div className="font-medium mt-2">Standard Range Bi-directional</div>
                      <div>±250, ±300, ±500, ±1,000, ±1.250</div>
                      <div className="font-medium mt-2">High Range Unidirectional</div>
                      <div>0 to 1,250, 0 to 2,500, 0 to 4,000, 0 to 6,000, 0 to 7,400</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Accuracy at 72°F (22.2°C)
                </h3>
                <div className="space-y-2 text-neutral-700">
                  <div>
                    <span className="font-semibold text-primary-600">Low Range:</span> ±0.5% of
                    W.C. ranges 0 to 0.1", 0 to 0.25", ±0.1" and ±0.25"
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600">Low Range:</span> ±0.5% of Pa
                    ranges 0 to 30, 0 to 50, ±30 and ±50 Pa
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600">
                      Standard and High Range:
                    </span>{' '}
                    ±0.25% of range (all other ranges)
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-900 mb-3">
                    Temperature Limits
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Storage:</span>
                      <span className="text-neutral-900 font-medium">
                        -40°F to 203°F (-40°C to 95°C)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Operational:</span>
                      <span className="text-neutral-900 font-medium">
                        32°F to 140°F (0°C to 95°C)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Compensated:</span>
                      <span className="text-neutral-900 font-medium">
                        50°F to 104°F (10°C to 40°C)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Operating RH Range
                  </h3>
                  <p className="text-primary-600 font-bold">
                    0 to 95% non-condensing
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">Media</h3>
                <p className="text-neutral-700">
                  Non-Ionic, Non-Corrosive, Clean, Dry Gasses
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Ranges Note */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Extensive Range Options
            </h3>
            <p className="text-neutral-700">
              BAPI offers pressure transmitters in over 40 different ranges
              covering low, standard, and high pressure applications. Each range
              is NIST-traceable and factory calibrated for maximum accuracy.
              Contact support for detailed output tables for your specific
              pressure range.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need a Pressure Transmitter?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our digital compensation technology provides the ultimate in
            accuracy and stability for pressure measurement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/pressure-sensors"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Pressure Sensors
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
