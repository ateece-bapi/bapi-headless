import { Metadata } from 'next';
import Link from 'next/link';
import { Thermometer, Droplet, Wind, Gauge, Search, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BAPI Sensors Overview & Specifications | BAPI',
  description:
    'Complete overview of BAPI sensor specifications for temperature, humidity, pressure, and air quality monitoring.',
};

export default function SensorSpecsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Thermometer className="mx-auto mb-4 h-16 w-16" />
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
              <Thermometer className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Temperature</h3>
              <p className="mt-1 text-sm text-neutral-600">Thermistors & RTDs</p>
            </a>
            <a
              href="#humidity"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <Droplet className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Humidity</h3>
              <p className="mt-1 text-sm text-neutral-600">RH Sensors</p>
            </a>
            <a
              href="#pressure"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <Gauge className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Pressure</h3>
              <p className="mt-1 text-sm text-neutral-600">Differential & Absolute</p>
            </a>
            <a
              href="#air-quality"
              className="rounded-xl border-2 border-neutral-200 bg-white p-6 text-center transition-all hover:border-primary-500"
            >
              <Wind className="mx-auto mb-2 h-10 w-10 text-primary-500" />
              <h3 className="font-bold text-neutral-900">Air Quality</h3>
              <p className="mt-1 text-sm text-neutral-600">CO₂, VOC, PM</p>
            </a>
          </div>
        </div>
      </section>

      {/* Temperature Sensors */}
      <section id="temperature" className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Temperature Sensors</h2>

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
                    <td className="px-6 py-4 text-neutral-900">10K-2 Thermistor</td>
                    <td className="px-6 py-4 text-neutral-600">-40°F to 212°F</td>
                    <td className="px-6 py-4 text-neutral-600">±0.2°F @ 77°F</td>
                    <td className="px-6 py-4 text-neutral-600">Resistance</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">10K-3 Thermistor</td>
                    <td className="px-6 py-4 text-neutral-600">-40°F to 257°F</td>
                    <td className="px-6 py-4 text-neutral-600">±0.2°F @ 77°F</td>
                    <td className="px-6 py-4 text-neutral-600">Resistance</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">100Ω Platinum RTD</td>
                    <td className="px-6 py-4 text-neutral-600">-40°F to 257°F</td>
                    <td className="px-6 py-4 text-neutral-600">±0.3°F @ 77°F</td>
                    <td className="px-6 py-4 text-neutral-600">Resistance</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">1000Ω Platinum RTD</td>
                    <td className="px-6 py-4 text-neutral-600">-40°F to 257°F</td>
                    <td className="px-6 py-4 text-neutral-600">±0.3°F @ 77°F</td>
                    <td className="px-6 py-4 text-neutral-600">Resistance</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
      <section id="humidity" className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Humidity Sensors</h2>

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
                    <td className="px-6 py-4 text-neutral-600">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-600">±2% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-600">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">High Accuracy RH</td>
                    <td className="px-6 py-4 text-neutral-600">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-600">±1.5% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-600">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Wireless RH Sensor</td>
                    <td className="px-6 py-4 text-neutral-600">0-100% RH</td>
                    <td className="px-6 py-4 text-neutral-600">±2% (10-90%RH)</td>
                    <td className="px-6 py-4 text-neutral-600">Wireless (900MHz)</td>
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
      <section id="pressure" className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-900">Pressure Sensors</h2>

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
                    <td className="px-6 py-4 text-neutral-600">0-0.25" to 0-10"</td>
                    <td className="px-6 py-4 text-neutral-600">±1% FS</td>
                    <td className="px-6 py-4 text-neutral-600">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Absolute Pressure</td>
                    <td className="px-6 py-4 text-neutral-600">0-30 PSI</td>
                    <td className="px-6 py-4 text-neutral-600">±0.5% FS</td>
                    <td className="px-6 py-4 text-neutral-600">0-5V, 0-10V, 4-20mA</td>
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
      <section id="air-quality" className="bg-neutral-50 py-16">
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
                    <td className="px-6 py-4 text-neutral-600">0-2000 PPM</td>
                    <td className="px-6 py-4 text-neutral-600">±50 PPM ±5% reading</td>
                    <td className="px-6 py-4 text-neutral-600">0-5V, 0-10V, 4-20mA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">VOC Sensor</td>
                    <td className="px-6 py-4 text-neutral-600">0-2000 PPB</td>
                    <td className="px-6 py-4 text-neutral-600">±10% reading</td>
                    <td className="px-6 py-4 text-neutral-600">0-10V, Modbus</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">PM2.5/PM10</td>
                    <td className="px-6 py-4 text-neutral-600">0-500 μg/m³</td>
                    <td className="px-6 py-4 text-neutral-600">±15% reading</td>
                    <td className="px-6 py-4 text-neutral-600">0-10V, Modbus</td>
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
      <section className="bg-primary-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            Download Complete Specifications
          </h2>
          <p className="mb-6 text-neutral-600">
            Get the full technical specification guide for all BAPI sensors
          </p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
            <Download className="h-5 w-5" />
            Download Specs Guide (PDF)
          </button>
        </div>
      </section>
    </main>
  );
}
