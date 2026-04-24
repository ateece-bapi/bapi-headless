import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import { ThermometerIcon, DropletsIcon, WindIcon, GaugeIcon, SearchIcon, DownloadIcon } from '@/lib/icons';
import { LocalizedTemperatureSensorTable } from '@/components/sensors/LocalizedTemperatureSensorTable';

export const metadata: Metadata = {
  title: 'BAPI Sensors Overview & Specifications | BAPI',
  description:
    'Complete overview of BAPI sensor specifications for temperature, humidity, pressure, and air quality monitoring.',
};

export default function SensorSpecsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ThermometerIcon className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">BAPI Sensors Overview</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Complete technical specifications for building automation sensors
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="#temperature"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <ThermometerIcon className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Temperature</h3>
              <p className="mt-1 text-sm text-neutral-700">Thermistors & RTDs</p>
            </a>
            <a
              href="#humidity"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <DropletsIcon className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Humidity</h3>
              <p className="mt-1 text-sm text-neutral-700">RH Sensors</p>
            </a>
            <a
              href="#pressure"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <GaugeIcon className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Pressure</h3>
              <p className="mt-1 text-sm text-neutral-700">Differential & Absolute</p>
            </a>
            <a
              href="#air-quality"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <WindIcon className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Air Quality</h3>
              <p className="mt-1 text-sm text-neutral-700">CO₂, VOC, PM</p>
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">
            Temperature, Humidity & Pressure Sensor Overview
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-neutral-700">
            <p>
              There are many facilities and locations today that rely on temperature, pressure and
              humidity sensors and transmitters to provide a stable, secure environment, such as
              hospitals, clean rooms and data centers. The sensor or transmitter itself can make or
              break the system, therefore they must be dependable, accurate and 100% compatible
              with the building control system. More demanding environments, advances in
              technology, and changing customer needs keep the industry striving for new and
              improved sensors and transmitters. As the industry continues to change, BAPI will be
              at the forefront providing high performance solutions for real world applications.
            </p>
            <p>
              BAPI offers a wide range of temperature, humidity and pressure sensors and
              transmitters in all of our room, duct, immersion and outside air units so that they
              are 100% compatible with the facility&apos;s control system.
            </p>
          </div>
        </div>
      </section>

      {/* Temperature Sensors */}
      <section id="temperature" className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Temperature Sensors</h2>

          {/* Thermistors */}
          <div className="mb-12 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">THERMISTORS</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              Thermistors are thermally sensitive resistors known for exhibiting a large change in
              resistance with only a small change in temperature. A thermistor&apos;s change in
              resistance is non-linear. It follows a pre-defined curve which is provided by the
              thermistor manufacturer.
            </p>
            <Link
              href="/sensor-specs/thermistor"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About Thermistors →
            </Link>
          </div>

          <LocalizedTemperatureSensorTable />

          {/* RTDs */}
          <div className="mb-8 mt-12 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">RTDs</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              RTDs (Resistance Temperature Detectors) are thermally sensitive resistive elements
              that exhibit a small change in resistance per degree of temperature change. RTDs are
              especially recognized for excellent linearity throughout their temperature range with
              a high degree of accuracy and repeatability.
            </p>
            <Link
              href="/sensor-specs/rtd"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About RTDs →
            </Link>
          </div>

          {/* Semiconductors */}
          <div className="mb-8 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">SEMICONDUCTORS</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              Semiconductors are designed to exhibit a defined current output directly proportional
              to the absolute temperature (°K). This property makes them the most linear of all the
              common commercial HVAC/R sensing elements. By putting this current output across a
              resistor, a proportional output voltage is produced.
            </p>
            <Link
              href="/sensor-specs/semiconductor"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About Semiconductors →
            </Link>
          </div>

          {/* Temperature Transmitters */}
          <div className="mb-8 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">TEMPERATURE TRANSMITTERS</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              Temperature transmitters incorporate a platinum 100 Ohm or 1k Ohm RTD sensor and an
              amplifier. These devices provide an accurate and predictable 4 to 20mA output over a
              specified temperature range. They are specifically designed for temperature sensing
              and transmission over long distances without degradation of the 4 to 20mA signal.
            </p>
            <Link
              href="/sensor-specs/temperature-transmitters"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About Temperature Transmitters →
            </Link>
          </div>

          <Link
            href="/products?category=temperature"
            className="inline-flex items-center font-semibold text-primary-500 hover:text-primary-600"
          >
            View All Temperature Sensors →
          </Link>
        </div>
      </section>

      {/* Humidity Sensors */}
      <section id="humidity" className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Humidity Sensors</h2>

          <div className="mb-8 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">HUMIDITY TRANSMITTERS</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              Humidity transmitters provide a high accuracy 4 to 20mA, 0 to 5V or 0 to 10V humidity
              measurement. Accuracies of 2% or 3% Relative Humidity (RH) are available. BAPI room
              units are protected by a molded housing with an integral filter, while duct and
              outside air units come with a removeable 100 micron sintered stainless steel filter.
              The sensor is unaffected by volatile organic compounds (VOC&apos;s) or surface
              contamination.
            </p>
            <Link
              href="/sensor-specs/humidity-transmitters"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About Humidity Transmitters →
            </Link>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Sensor Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Capacitive RH Sensor</td>
                    <td className="px-6 py-4 text-neutral-700">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-700">±2% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-700">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">High Accuracy RH</td>
                    <td className="px-6 py-4 text-neutral-700">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-700">±1.5% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-700">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Wireless RH Sensor</td>
                    <td className="px-6 py-4 text-neutral-700">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-700">±2% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-700">Wireless (900MHz)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Link
            href="/products?category=humidity"
            className="inline-flex items-center font-semibold text-primary-500 hover:text-primary-600"
          >
            View All Humidity Sensors →
          </Link>
        </div>
      </section>

      {/* Pressure Sensors */}
      <section id="pressure" className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Pressure Sensors</h2>

          <div className="mb-8 rounded-xl border-2 border-neutral-200 bg-white p-8">
            <h3 className="mb-4 text-2xl font-bold text-neutral-900">PRESSURE TRANSMITTERS</h3>
            <p className="mb-6 text-lg leading-relaxed text-neutral-700">
              The heart of every BAPI Pressure Transmitter is a micro-machined, single-crystal
              silicon, piezoresistive pressure sensor that changes resistance as a function of
              applied pressure. Since silicon strain gauges have high output levels in relation to
              the pressure applied, the pressure levels in the BAPI diaphragm can be lower than in
              other non-silicon strain gauges. This means a more accurate measurement of lower
              pressure levels.
            </p>
            <Link
              href="/sensor-specs/pressure-transmitters"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Learn More About Pressure Transmitters →
            </Link>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Sensor Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Differential Pressure</td>
                    <td className="px-6 py-4 text-neutral-700">0-0.25&quot; to 0-10&quot;</td>
                    <td className="px-6 py-4 text-neutral-700">±1% FS</td>
                    <td className="px-6 py-4 text-neutral-700">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Absolute Pressure</td>
                    <td className="px-6 py-4 text-neutral-700">0-30 PSI</td>
                    <td className="px-6 py-4 text-neutral-700">±0.5% FS</td>
                    <td className="px-6 py-4 text-neutral-700">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Link
            href="/products?category=pressure"
            className="inline-flex items-center font-semibold text-primary-500 hover:text-primary-600"
          >
            View All Pressure Sensors →
          </Link>
        </div>
      </section>

      {/* Air Quality Sensors */}
      <section id="air-quality" className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Air Quality Sensors</h2>

          <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Sensor Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">CO₂ Sensor (NDIR)</td>
                    <td className="px-6 py-4 text-neutral-700">0-2000 PPM</td>
                    <td className="px-6 py-4 text-neutral-700">±50 PPM ±5% reading</td>
                    <td className="px-6 py-4 text-neutral-700">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">VOC Sensor</td>
                    <td className="px-6 py-4 text-neutral-700">0-2000 PPB</td>
                    <td className="px-6 py-4 text-neutral-700">±10% reading</td>
                    <td className="px-6 py-4 text-neutral-700">0-10V, Modbus</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">PM2.5/PM10</td>
                    <td className="px-6 py-4 text-neutral-700">0-500 μg/m³</td>
                    <td className="px-6 py-4 text-neutral-700">±15% reading</td>
                    <td className="px-6 py-4 text-neutral-700">0-10V, Modbus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Link
            href="/air-quality"
            className="inline-flex items-center font-semibold text-primary-500 hover:text-primary-600"
          >
            View All Air Quality Sensors →
          </Link>
        </div>
      </section>

      {/* Download Resources */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            Download Complete Specifications
          </h2>
          <p className="mb-6 text-neutral-700">
            Get the full technical specification guide for all BAPI sensors
          </p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
            <DownloadIcon className="h-5 w-5" />
            Download Specs Guide (PDF)
          </button>
        </div>
      </section>
    </div>
  );
}
