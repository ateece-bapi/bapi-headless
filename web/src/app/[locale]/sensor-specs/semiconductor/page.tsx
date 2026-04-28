'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';
import {
  ad592Standard,
  ad59210K,
  type AD592Data,
  type AD59210KData,
} from '@/data/semiconductorTables';

type SemiconductorType = 'AD592' | 'AD592-10K';

// Helper component for AD592 Standard table (4 columns: °F, °C, µA, Volts)
function AD592StandardTable({ data }: { data: AD592Data }) {
  const rowsPerColumn = Math.ceil(data.length / 3);
  const column1 = data.slice(0, rowsPerColumn);
  const column2 = data.slice(rowsPerColumn, rowsPerColumn * 2);
  const column3 = data.slice(rowsPerColumn * 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[column1, column2, column3].map((column, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-neutral-300">
            <thead>
              <tr className="bg-neutral-200">
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °F
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °C
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  µA
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  Volts
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([tempF, tempC, microAmps, volts], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempF}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempC}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {microAmps}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {volts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// Helper component for AD592-10K table (3 columns: °F, °C, Volts)
function AD59210KTable({ data }: { data: AD59210KData }) {
  const rowsPerColumn = Math.ceil(data.length / 3);
  const column1 = data.slice(0, rowsPerColumn);
  const column2 = data.slice(rowsPerColumn, rowsPerColumn * 2);
  const column3 = data.slice(rowsPerColumn * 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[column1, column2, column3].map((column, idx) => (
        <div key={idx} className="overflow-x-auto">
          <table className="w-full border border-neutral-300">
            <thead>
              <tr className="bg-neutral-200">
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °F
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  °C
                </th>
                <th className="px-2 py-1 border border-neutral-300 text-center text-sm font-bold text-neutral-900">
                  Volts
                </th>
              </tr>
            </thead>
            <tbody>
              {column.map(([tempF, tempC, volts], rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-50">
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempF}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {tempC}
                  </td>
                  <td className="px-2 py-1 border border-neutral-300 text-center text-sm">
                    {volts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default function SemiconductorOverviewPage() {
  const [activeTab, setActiveTab] = useState<SemiconductorType>('AD592');
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

        {/* Custom Offset Definition and Example */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Custom Offset Definition and Example
          </h2>

          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-8">
            <p className="text-neutral-700 leading-relaxed mb-8">
              This is how BAPI calculates the offset value provided on the sensor label:
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  Therm Reading
                </h3>
                <p className="text-neutral-700">
                  The actual temperature reading according to a thermometer 
                  that is certified traceable to recognized standards by the 
                  National Institute of Standards and Technology (NIST).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  Sensor Reading
                </h3>
                <p className="text-neutral-700">
                  The temperature reading according to the AD592 sensor, 
                  using the output in either µA or mV and converting the output 
                  to a Fahrenheit temperature.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 underline">
                  Offset
                </h3>
                <p className="text-neutral-700">
                  The difference between the Thermometer Reading and the 
                  Sensor Reading
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-neutral-300 rounded-lg p-6 mb-6">
              <p className="text-neutral-700 font-medium mb-4">
                To maximize the sensor accuracy, simply add the offset value of the sensor reading into the controller.
              </p>

              <div className="space-y-4 text-neutral-700">
                <div className="border-l-4 border-primary-600 pl-4">
                  <p className="mb-2">
                    <span className="font-semibold">e.g. Therm Reading 74.6</span>
                    <span className="mx-4">Sensor Reading 73.0</span>
                    <span>Offset +1.6</span>
                  </p>
                  <p className="text-sm">
                    Correction: Add (+1.6) °F to the sensor for an accurate reading: 73 + 1.6 = 74.6°F
                  </p>
                </div>

                <div className="border-l-4 border-primary-600 pl-4">
                  <p className="mb-2">
                    <span className="font-semibold">e.g. Therm Reading 75.4</span>
                    <span className="mx-4">Sensor Reading 77.2</span>
                    <span>Offset -1.8</span>
                  </p>
                  <p className="text-sm">
                    Correction: Add (-1.8) °F to the sensor for an accurate reading: 77.2 + (-1.8) = 75.4°F
                  </p>
                </div>
              </div>
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

        {/* Output Curve Chart */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Typical Semiconductor Output Curve
          </h2>
          <div className="bg-white rounded-lg border-2 border-neutral-200 p-6 flex justify-center">
            <img
              src="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/Semiconductor_Output_Table.png"
              alt="Typical Semiconductor Output showing Current (µA) and Voltage (V) vs Temperature"
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-center text-sm text-neutral-600 mt-4">
            Figure 1 - Typical Semiconductor Temperature Output
          </p>
        </section>

        {/* Output Tables Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Semiconductor Output Tables
          </h2>

          {/* Tab Navigation */}
          <div className="border-b-2 border-neutral-200 mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max px-2">
              <button
                onClick={() => setActiveTab('AD592')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'AD592'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === 'AD592'}
              >
                AD592 Standard
              </button>
              <button
                onClick={() => setActiveTab('AD592-10K')}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'AD592-10K'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                role="tab"
                aria-selected={activeTab === 'AD592-10K'}
              >
                AD592-10K
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'AD592' && (
              <div className="bg-white rounded-lg">
                <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                  AD592 Standard Semiconductor Output Table
                </h3>
                <p className="text-center text-neutral-600 mb-6">
                  Standard AD592 current (µA) and voltage (V) output vs temperature
                </p>
                <AD592StandardTable data={ad592Standard} />
              </div>
            )}

            {activeTab === 'AD592-10K' && (
              <div className="bg-white rounded-lg">
                <h3 className="text-2xl font-bold text-center text-neutral-900 mb-4">
                  AD592-10K Semiconductor Output Table
                </h3>
                <p className="text-center text-neutral-600 mb-6">
                  AD592 Semiconductor with 10K shunt resistor - voltage (V) output vs temperature
                </p>
                <AD59210KTable data={ad59210K} />
              </div>
            )}
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
