import { Metadata } from 'next';
import Link from 'next/link';
import { Thermometer, Droplet, Wind, Gauge, Search, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BAPI Sensors Overview & Specifications | BAPI',
  description: 'Complete overview of BAPI sensor specifications for temperature, humidity, pressure, and air quality monitoring.',
};

export default function SensorSpecsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Thermometer className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              BAPI Sensors Overview
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Complete technical specifications for building automation sensors
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="#temperature" className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all text-center">
              <Thermometer className="w-10 h-10 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-900">Temperature</h3>
              <p className="text-sm text-neutral-600 mt-1">Thermistors & RTDs</p>
            </a>
            <a href="#humidity" className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all text-center">
              <Droplet className="w-10 h-10 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-900">Humidity</h3>
              <p className="text-sm text-neutral-600 mt-1">RH Sensors</p>
            </a>
            <a href="#pressure" className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all text-center">
              <Gauge className="w-10 h-10 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-900">Pressure</h3>
              <p className="text-sm text-neutral-600 mt-1">Differential & Absolute</p>
            </a>
            <a href="#air-quality" className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all text-center">
              <Wind className="w-10 h-10 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-900">Air Quality</h3>
              <p className="text-sm text-neutral-600 mt-1">CO₂, VOC, PM</p>
            </a>
          </div>
        </div>
      </section>

      {/* Temperature Sensors */}
      <section id="temperature" className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Temperature Sensors
          </h2>
          
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Sensor Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Range</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Accuracy</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Output</th>
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
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold"
          >
            View All Temperature Sensors →
          </Link>
        </div>
      </section>

      {/* Humidity Sensors */}
      <section id="humidity" className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Humidity Sensors
          </h2>
          
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Sensor Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Range</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Accuracy</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Output</th>
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
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold"
          >
            View All Humidity Sensors →
          </Link>
        </div>
      </section>

      {/* Pressure Sensors */}
      <section id="pressure" className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Pressure Sensors
          </h2>
          
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Sensor Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Range</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Accuracy</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Output</th>
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
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold"
          >
            View All Pressure Sensors →
          </Link>
        </div>
      </section>

      {/* Air Quality Sensors */}
      <section id="air-quality" className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Air Quality Sensors
          </h2>
          
          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Sensor Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Range</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Accuracy</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Output</th>
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
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold"
          >
            View All Air Quality Sensors →
          </Link>
        </div>
      </section>

      {/* Download Resources */}
      <section className="py-12 bg-primary-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Download Complete Specifications
          </h2>
          <p className="text-neutral-600 mb-6">
            Get the full technical specification guide for all BAPI sensors
          </p>
          <button className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
            Download Specs Guide (PDF)
          </button>
        </div>
      </section>
    </main>
  );
}
