import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import { temperatureTransmitterOutput } from '@/data/temperatureTransmitterTable';

export default function TemperatureTransmittersPage() {
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
        {/* Temperature Transmitter Description */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Temperature Transmitter Description
          </h2>
          <div className="prose prose-lg max-w-none space-y-4">
            <p className="text-neutral-700 leading-relaxed">
              BAPI's temperature transmitters incorporate a 1KΩ RTD sensor and
              an amplifier. These devices provide an accurate two wire, 4 to
              20mA output over a specified temp range. They are specifically
              designed for long distance transmission over long distances
              without degradation of the 4 to 20mA signal. 100Ω units also
              available upon request.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Each temperature transmitter is not configurable for its
              specified temp range. If you don't offer the right transmitter at
              the field or the light transmitter in Class A RTD's to improve
              overall accuracy. The specified unit at the calibrated range
              offers better accuracy to minimize the cross on the control
              components. Use the accuracy of the matched pair unit becomes a
              function of the transfer linearity (RTD curve) and reference
              transmitter somewhat.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Standard units will offset 0–100°F ( commonly found ) -  Reference
              Thermometer (example) :
            </p>
            <p className="text-neutral-700 leading-relaxed font-mono text-sm bg-neutral-50 p-4 rounded">
              Offset Range units :  –20°C to +250°C  (-4°F to 482°F)<br />
              Max.Span : 16.6°C (30°F) – 2.0 to +600°C (–148°F to +1000°F)
            </p>
            <p className="text-neutral-700 leading-relaxed">
              BA/TM- 1K in (0-30°F)<br />
              Spec : +/- 0.08˚C (0.14˚F) = 16°F] MAX<br />
              BA/TM- 1K in (0-100°F)<br />
              Spec : +/- 0.10˚C (0.18˚F) = 38-55°F] OFFSET
            </p>
            <p className="text-neutral-700 leading-relaxed">
              These accuracies are for the worst range of the sensor, although
              the accuracies in the midpoint of the sensor will be tighter. Run
              these over your BAPI representative for details.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              BAPI temperature transmitters come in a ruggedized package for all
              non-room configurations where moisture or condensation may be a
              problem. The potting material used to ruggedize the transmitters
              has a high thermal conductivity to eliminate circuit overheating
              and allow thermal expansion to minimize the stress on the control
              components. Due to the extremely low moisture absorption
              properties of the epoxy, a ruggedized transmitter will remain
              operational even if temporarily immersed in water.
            </p>
          </div>
        </section>

        {/* Specifications */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Specifications
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

        {/* Temperature Transmitter Output Table */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            0-100 °F Temperature Transmitter Output Table
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
