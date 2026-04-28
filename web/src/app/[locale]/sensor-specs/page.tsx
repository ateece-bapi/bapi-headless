import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import { ThermometerIcon, DropletsIcon, GaugeIcon } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'BAPI Sensors Overview & Specifications | BAPI',
  description:
    'Complete overview of BAPI sensor specifications for temperature, humidity, and pressure monitoring in building automation systems.',
};

export default function SensorSpecsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 py-20 text-white">
        {/* Background Pattern (optional) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ThermometerIcon className="mx-auto mb-6 h-20 w-20 text-primary-50" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              BAPI Sensors Overview
            </h1>
            <p className="mx-auto max-w-content text-xl text-primary-50 sm:text-2xl">
              Complete technical specifications for building automation sensors
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Temperature, Humidity & Pressure Sensor Overview
          </h2>
          <p className="text-center text-lg leading-relaxed text-neutral-700">
            There are many facilities and locations today that rely on temperature, pressure and humidity 
            sensors and transmitters to provide a stable, secure environment, such as hospitals, clean rooms 
            and data centers. The sensor or transmitter itself can make or break the system, therefore they 
            must be dependable, accurate and 100% compatible with the building control system. More demanding 
            environments, advances in technology, and changing customer needs keep the industry striving for 
            new and improved sensors and transmitters. BAPI offers a wide range of temperature, humidity and 
            pressure sensors and transmitters in all of our room, duct, immersion and outside air units so 
            that they are 100% compatible with the facility's control system.
          </p>
        </div>
      </section>

      {/* Sensor Type Cards */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Thermistors */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">THERMISTORS</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                Thermistors are thermally sensitive resistors known for exhibiting a large change in 
                resistance with only a small change in temperature. A thermistor's change in resistance 
                is non-linear. It follows a pre-defined curve which is provided by the thermistor manufacturer.
              </p>
              <Link
                href="/sensor-specs/thermistor"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                Thermistor Overview
              </Link>
            </div>

            {/* RTDs */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">RTDs</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                RTDs (Resistance Temperature Detectors) are thermally sensitive resistive elements that 
                exhibit a small change in resistance per degree of temperature change. RTDs are especially 
                recognized for excellent linearity throughout their temperature range with a high degree of 
                accuracy and repeatability.
              </p>
              <Link
                href="/sensor-specs/rtd"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                RTD Overview
              </Link>
            </div>

            {/* Semiconductors */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">SEMICONDUCTORS</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                Semiconductors are designed to exhibit a defined current output directly proportional to the 
                absolute temperature (°K). This property makes them the most linear of all the common commercial 
                HVAC/R sensing elements. By putting this current output across a resistor, a proportional output 
                voltage is produced.
              </p>
              <Link
                href="/sensor-specs/semiconductor"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                Semiconductor Overview
              </Link>
            </div>

            {/* Temperature Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">TEMPERATURE TRANSMITTERS</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                Temperature transmitters incorporate a platinum 100 Ohm or 1k Ohm RTD sensor and an amplifier. 
                These devices provide an accurate and predictable 4 to 20mA output over a specified temperature 
                range. They are specifically designed for temperature sensing and transmission over long distances 
                without degradation of the 4 to 20mA signal.
              </p>
              <Link
                href="/sensor-specs/temperature-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                Temperature Transmitters Overview
              </Link>
            </div>

            {/* Humidity Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <DropletsIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">HUMIDITY TRANSMITTERS</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                Humidity transmitters provide a high accuracy 4 to 20mA, 0 to 5V or 0 to 10V humidity measurement. 
                Accuracies of 2% or 3% Relative Humidity (RH) are available. BAPI room units are protected by a 
                molded housing with an integral filter, while duct and outside air units come with a removeable 100 
                micron sintered stainless steel filter. The sensor is unaffected by volatile organic compounds 
                (VOC's) or surface contamination.
              </p>
              <Link
                href="/sensor-specs/humidity-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                Humidity Transmitters Overview
              </Link>
            </div>

            {/* Pressure Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <GaugeIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">PRESSURE TRANSMITTERS</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                The heart of every BAPI Pressure Transmitter is a micro-machined, single-crystal silicon, 
                piezoresistive pressure sensor that changes resistance as a function of applied pressure. Since 
                silicon strain gauges have high output levels in relation to the pressure applied, the pressure 
                levels in the BAPI diaphragm can be lower than in other non-silicon strain gauges. This means a 
                more accurate measurement of lower pressure levels.
              </p>
              <Link
                href="/sensor-specs/pressure-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                Pressure Transmitters Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Products CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-12 shadow-xl">
            <ThermometerIcon className="mx-auto mb-6 h-16 w-16 text-white" />
            <h2 className="mb-4 text-3xl font-bold text-white">
              Explore Our Sensor Products
            </h2>
            <p className="mb-8 text-lg text-primary-50">
              Browse our complete line of temperature, humidity, and pressure sensors
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 transition-all hover:bg-primary-50 hover:shadow-lg"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
