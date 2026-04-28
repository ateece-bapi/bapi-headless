'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronLeftIcon } from '@/lib/icons';

export default function RTDOverviewPage() {
  const [activeTab, setActiveTab] = useState<'385' | '375' | 'nickel'>('385');

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
            RTD Overview
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl">
            Resistance Temperature Detectors with excellent linearity,
            accuracy, and repeatability
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            RTD Description
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              BAPI RTDs (Resistance Temperature Detectors) are thermally
              sensitive resistive elements that exhibit a small change in
              resistance per degree of temperature change. RTDs are especially
              recognized for excellent linearity throughout their temperature
              range with a high degree of accuracy and repeatability.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              RTDs supplied in BAPI products feature a standard
              interchangeability tolerance of ±0.3°C measured at 0°C. Higher
              accuracy sensors are also available. The Class A line has an
              interchangeability tolerance of ± 0.15°C measured at 0°C. Please
              call for availability and pricing on Class A RTDs. Whether
              standard or Class A, BAPI RTDs have such a high accuracy that they
              can be interchanged without the expense of offsetting the
              controller.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Most RTD sensing elements can be packaged to withstand an
              extremely broad temperature range (‑200 to 600°C). For most
              purposes, the standard operating range should be sufficient, but
              we also have RTDs with a higher or lower operating temperature
              range. BAPI offers 1KΩ Platinum RTDs with various ranges to meet
              your specific application needs.
            </p>
          </div>
        </section>

        {/* Definition of Specification Terms */}
        <section className="max-w-4xl mx-auto mb-16 bg-neutral-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Definition of Specification Terms
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Tolerance of Resistance (Accuracy)
              </h3>
              <p className="text-neutral-700">
                The maximum amount that RTDs following the same curve will differ
                from each other.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Stability (drift)
              </h3>
              <p className="text-neutral-700">
                The amount that the RTD resistance characteristics will change.
                BAPI uses only the highest quality, film platinum RTD sensors with
                very small drift values.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Operating Range
              </h3>
              <p className="text-neutral-700">
                The operating range shown is for the RTD sensor only. The mounting
                package may further limit the operating range and is described on
                each mounting type specification.
              </p>
            </div>
          </div>
        </section>

        {/* RTD Specifications Table */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            RTD Specifications
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden mb-8">
            <div className="grid divide-y divide-neutral-200">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Tolerance of Resistance (Accuracy)
                  </h3>
                  <p className="text-neutral-700">
                    Range: ±0.06 of the absolute ohm value at 0°C in accordance
                    with Standard 1/3 DIN
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Tolerance % (%)
                  </h3>
                  <p className="text-neutral-700">
                    Range: ±0.0 ± (0.02 x t (0.0111 + t)); t= temp °C <br />
                    Example: At 0°C - Range ±0.02°C, At 100°C - Range ±0.13°C <br />
                    Averaging Standard: ±0.0 ± (0.0052 + (0.01 x temp °C))
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Stability (drift)
                  </h3>
                  <p className="text-neutral-700">
                    ±0.1°C over a 5,000 continuous hours at 65°C
                  </p>
                </div>
                <div className="p-6 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Sensitivity
                  </h3>
                  <p className="text-neutral-700">
                    1KΩ: 2.13Ω/°C (at 70°F)
                    <br />
                    100Ω: 0.385Ω/°C
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Self Heating (in RTD only)
                </h3>
                <p className="text-neutral-700">0.4°C/mW in air</p>
              </div>
            </div>
          </div>

          {/* Standard & Internal Temperature Ranges */}
          <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <h3 className="text-xl font-bold text-neutral-900 p-6 bg-neutral-50 border-b-2 border-neutral-200">
              Standard & Internal Temperature Ranges for the 1KΩ Platinum RTD
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-neutral-900">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-neutral-900">
                      Reference Resistance
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-neutral-900">
                      Temperature Coefficient
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-neutral-900">
                      Operating Range
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      1KΩ (375)
                    </td>
                    <td className="px-6 py-4 text-neutral-700">1000Ω±1000</td>
                    <td className="px-6 py-4 text-neutral-700">3.75 (Ω/°C)</td>
                    <td className="px-6 py-4 text-neutral-700">
                      -80 to 200°C
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      1KΩ (385)
                    </td>
                    <td className="px-6 py-4 text-neutral-700">1000.0±1.0Ω</td>
                    <td className="px-6 py-4 text-neutral-700">3.850 (Ω/°C)</td>
                    <td className="px-6 py-4 text-neutral-700">
                      -65 to 260°C
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      1KΩ (392)
                    </td>
                    <td className="px-6 py-4 text-neutral-700">1000.0±2.0Ω</td>
                    <td className="px-6 py-4 text-neutral-700">3.916 (Ω/°C)</td>
                    <td className="px-6 py-4 text-neutral-700">
                      -70 to 205°C
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-sm text-neutral-600">
              *Available as a 1KΩ, high accuracy sensor. Consult the factory +/- 0.2°Ω high
              accuracy standard element.
            </div>
          </div>
        </section>

        {/* Accuracy Comparison */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Interchangeability Tolerance Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-50 rounded-lg p-6 border-2 border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                Standard RTD
              </h3>
              <div className="space-y-2">
                <p className="text-neutral-700">
                  <span className="font-semibold">Tolerance:</span> ±0.3°C at
                  0°C
                </p>
                <p className="text-neutral-700">
                  <span className="font-semibold">Best For:</span> General HVAC
                  applications
                </p>
                <p className="text-neutral-700">
                  <span className="font-semibold">Benefit:</span> Cost-effective
                  high accuracy
                </p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-600">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-neutral-900">
                  Class A RTD
                </h3>
                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                  PREMIUM
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-neutral-700">
                  <span className="font-semibold">Tolerance:</span> ±0.15°C at
                  0°C
                </p>
                <p className="text-neutral-700">
                  <span className="font-semibold">Best For:</span> Critical
                  applications
                </p>
                <p className="text-neutral-700">
                  <span className="font-semibold">Benefit:</span> Maximum
                  precision
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-4xl mx-auto mb-16 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Key RTD Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                ±0.15°C
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Exceptional Accuracy
              </h3>
              <p className="text-sm text-neutral-700">
                Class A RTDs provide industry-leading accuracy for critical
                applications
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                Linear
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Excellent Linearity
              </h3>
              <p className="text-sm text-neutral-700">
                Predictable output throughout the entire temperature range
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-primary-600 text-3xl font-bold mb-3">
                -200°C to 600°C
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Wide Range
              </h3>
              <p className="text-sm text-neutral-700">
                Extremely broad temperature range for diverse applications
              </p>
            </div>
          </div>
        </section>

        {/* Output Tables Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            RTD Output Tables
          </h2>
          <p className="text-center text-neutral-700 mb-8 max-w-3xl mx-auto">
            Detailed resistance vs. temperature tables showing precise ohm values
            for each RTD type across their full operating range. These tables are
            essential for system integration and troubleshooting.
          </p>

          {/* Tab Navigation */}
          <div className="mb-8 border-b-2 border-neutral-200">
            <div className="flex flex-wrap gap-2 -mb-0.5">
              <button
                onClick={() => setActiveTab('385')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === '385'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                aria-selected={activeTab === '385'}
                role="tab"
              >
                1KΩ Platinum
              </button>
              <button
                onClick={() => setActiveTab('375')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === '375'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                aria-selected={activeTab === '375'}
                role="tab"
              >
                1K (375)
              </button>
              <button
                onClick={() => setActiveTab('nickel')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'nickel'
                    ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-b-4 border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                aria-selected={activeTab === 'nickel'}
                role="tab"
              >
                1K (Ni) Nickel
              </button>
            </div>
          </div>

          {/* 1KΩ (385) Platinum RTD Table */}
          {activeTab === '385' && (
          <div className="mb-12 bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">

            <h3 className="text-2xl font-bold text-center text-neutral-900 py-6 bg-neutral-50 border-b-2 border-neutral-200">
              1KΩ PLATINUM RTD OUTPUT TABLE
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  <tr><td className="px-4 py-2">-40</td><td className="px-4 py-2">-40.00</td><td className="px-4 py-2">842.7</td><td className="px-4 py-2">14</td><td className="px-4 py-2">-10.00</td><td className="px-4 py-2">960.9</td><td className="px-4 py-2">68</td><td className="px-4 py-2">20.00</td><td className="px-4 py-2">1077.9</td></tr>
                  <tr><td className="px-4 py-2">-38</td><td className="px-4 py-2">-38.89</td><td className="px-4 py-2">847.0</td><td className="px-4 py-2">16</td><td className="px-4 py-2">-8.89</td><td className="px-4 py-2">965.2</td><td className="px-4 py-2">70</td><td className="px-4 py-2">21.11</td><td className="px-4 py-2">1082.2</td></tr>
                  <tr><td className="px-4 py-2">-36</td><td className="px-4 py-2">-37.78</td><td className="px-4 py-2">851.2</td><td className="px-4 py-2">18</td><td className="px-4 py-2">-7.78</td><td className="px-4 py-2">969.4</td><td className="px-4 py-2">72</td><td className="px-4 py-2">22.22</td><td className="px-4 py-2">1086.4</td></tr>
                  <tr><td className="px-4 py-2">-34</td><td className="px-4 py-2">-36.67</td><td className="px-4 py-2">855.5</td><td className="px-4 py-2">20</td><td className="px-4 py-2">-6.67</td><td className="px-4 py-2">973.7</td><td className="px-4 py-2">74</td><td className="px-4 py-2">23.33</td><td className="px-4 py-2">1090.6</td></tr>
                  <tr><td className="px-4 py-2">-32</td><td className="px-4 py-2">-35.56</td><td className="px-4 py-2">859.8</td><td className="px-4 py-2">22</td><td className="px-4 py-2">-5.56</td><td className="px-4 py-2">977.9</td><td className="px-4 py-2">76</td><td className="px-4 py-2">24.44</td><td className="px-4 py-2">1094.9</td></tr>
                  <tr><td className="px-4 py-2">-30</td><td className="px-4 py-2">-34.44</td><td className="px-4 py-2">864.0</td><td className="px-4 py-2">24</td><td className="px-4 py-2">-4.44</td><td className="px-4 py-2">982.2</td><td className="px-4 py-2">78</td><td className="px-4 py-2">25.56</td><td className="px-4 py-2">1099.1</td></tr>
                  <tr><td className="px-4 py-2">-28</td><td className="px-4 py-2">-33.33</td><td className="px-4 py-2">868.3</td><td className="px-4 py-2">26</td><td className="px-4 py-2">-3.33</td><td className="px-4 py-2">986.4</td><td className="px-4 py-2">80</td><td className="px-4 py-2">26.67</td><td className="px-4 py-2">1103.4</td></tr>
                  <tr><td className="px-4 py-2">-26</td><td className="px-4 py-2">-32.22</td><td className="px-4 py-2">872.6</td><td className="px-4 py-2">28</td><td className="px-4 py-2">-2.22</td><td className="px-4 py-2">990.7</td><td className="px-4 py-2">82</td><td className="px-4 py-2">27.78</td><td className="px-4 py-2">1107.6</td></tr>
                  <tr><td className="px-4 py-2">-24</td><td className="px-4 py-2">-31.11</td><td className="px-4 py-2">876.8</td><td className="px-4 py-2">30</td><td className="px-4 py-2">-1.11</td><td className="px-4 py-2">994.9</td><td className="px-4 py-2">84</td><td className="px-4 py-2">28.89</td><td className="px-4 py-2">1111.9</td></tr>
                  <tr><td className="px-4 py-2">-22</td><td className="px-4 py-2">-30.00</td><td className="px-4 py-2">881.1</td><td className="px-4 py-2">32</td><td className="px-4 py-2">0.00</td><td className="px-4 py-2">1000.0</td><td className="px-4 py-2">86</td><td className="px-4 py-2">30.00</td><td className="px-4 py-2">1116.1</td></tr>
                  <tr><td className="px-4 py-2">-20</td><td className="px-4 py-2">-28.89</td><td className="px-4 py-2">885.4</td><td className="px-4 py-2">34</td><td className="px-4 py-2">1.11</td><td className="px-4 py-2">1004.3</td><td className="px-4 py-2">88</td><td className="px-4 py-2">31.11</td><td className="px-4 py-2">1120.4</td></tr>
                  <tr><td className="px-4 py-2">-18</td><td className="px-4 py-2">-27.78</td><td className="px-4 py-2">889.6</td><td className="px-4 py-2">36</td><td className="px-4 py-2">2.22</td><td className="px-4 py-2">1008.5</td><td className="px-4 py-2">90</td><td className="px-4 py-2">32.22</td><td className="px-4 py-2">1124.7</td></tr>
                  <tr><td className="px-4 py-2">-16</td><td className="px-4 py-2">-26.67</td><td className="px-4 py-2">893.9</td><td className="px-4 py-2">38</td><td className="px-4 py-2">3.33</td><td className="px-4 py-2">1012.8</td><td className="px-4 py-2">92</td><td className="px-4 py-2">33.33</td><td className="px-4 py-2">1128.9</td></tr>
                  <tr><td className="px-4 py-2">-14</td><td className="px-4 py-2">-25.56</td><td className="px-4 py-2">898.1</td><td className="px-4 py-2">40</td><td className="px-4 py-2">4.44</td><td className="px-4 py-2">1017.1</td><td className="px-4 py-2">94</td><td className="px-4 py-2">34.44</td><td className="px-4 py-2">1133.2</td></tr>
                  <tr><td className="px-4 py-2">-12</td><td className="px-4 py-2">-24.44</td><td className="px-4 py-2">902.4</td><td className="px-4 py-2">42</td><td className="px-4 py-2">5.56</td><td className="px-4 py-2">1021.3</td><td className="px-4 py-2">96</td><td className="px-4 py-2">35.56</td><td className="px-4 py-2">1137.4</td></tr>
                  <tr><td className="px-4 py-2">-10</td><td className="px-4 py-2">-23.33</td><td className="px-4 py-2">906.7</td><td className="px-4 py-2">44</td><td className="px-4 py-2">6.67</td><td className="px-4 py-2">1025.6</td><td className="px-4 py-2">98</td><td className="px-4 py-2">36.67</td><td className="px-4 py-2">1141.7</td></tr>
                  <tr><td className="px-4 py-2">-8</td><td className="px-4 py-2">-22.22</td><td className="px-4 py-2">910.9</td><td className="px-4 py-2">46</td><td className="px-4 py-2">7.78</td><td className="px-4 py-2">1029.9</td><td className="px-4 py-2">100</td><td className="px-4 py-2">37.78</td><td className="px-4 py-2">1145.9</td></tr>
                  <tr><td className="px-4 py-2">-6</td><td className="px-4 py-2">-21.11</td><td className="px-4 py-2">915.2</td><td className="px-4 py-2">48</td><td className="px-4 py-2">8.89</td><td className="px-4 py-2">1034.1</td><td className="px-4 py-2">102</td><td className="px-4 py-2">38.89</td><td className="px-4 py-2">1150.2</td></tr>
                  <tr><td className="px-4 py-2">-4</td><td className="px-4 py-2">-20.00</td><td className="px-4 py-2">919.4</td><td className="px-4 py-2">50</td><td className="px-4 py-2">10.00</td><td className="px-4 py-2">1039.0</td><td className="px-4 py-2">104</td><td className="px-4 py-2">40.00</td><td className="px-4 py-2">1154.4</td></tr>
                  <tr><td className="px-4 py-2">-2</td><td className="px-4 py-2">-18.89</td><td className="px-4 py-2">923.7</td><td className="px-4 py-2">52</td><td className="px-4 py-2">11.11</td><td className="px-4 py-2">1043.2</td><td className="px-4 py-2">106</td><td className="px-4 py-2">41.11</td><td className="px-4 py-2">1158.7</td></tr>
                  <tr><td className="px-4 py-2">0</td><td className="px-4 py-2">-17.78</td><td className="px-4 py-2">928.0</td><td className="px-4 py-2">54</td><td className="px-4 py-2">12.22</td><td className="px-4 py-2">1047.5</td><td className="px-4 py-2">108</td><td className="px-4 py-2">42.22</td><td className="px-4 py-2">1163.0</td></tr>
                  <tr><td className="px-4 py-2">2</td><td className="px-4 py-2">-16.67</td><td className="px-4 py-2">932.2</td><td className="px-4 py-2">56</td><td className="px-4 py-2">13.33</td><td className="px-4 py-2">1051.8</td><td className="px-4 py-2">110</td><td className="px-4 py-2">43.33</td><td className="px-4 py-2">1167.2</td></tr>
                  <tr><td className="px-4 py-2">4</td><td className="px-4 py-2">-15.56</td><td className="px-4 py-2">936.5</td><td className="px-4 py-2">58</td><td className="px-4 py-2">14.44</td><td className="px-4 py-2">1056.0</td><td className="px-4 py-2">112</td><td className="px-4 py-2">44.44</td><td className="px-4 py-2">1171.5</td></tr>
                  <tr><td className="px-4 py-2">6</td><td className="px-4 py-2">-14.44</td><td className="px-4 py-2">940.7</td><td className="px-4 py-2">60</td><td className="px-4 py-2">15.56</td><td className="px-4 py-2">1060.3</td><td className="px-4 py-2">114</td><td className="px-4 py-2">45.56</td><td className="px-4 py-2">1175.7</td></tr>
                  <tr><td className="px-4 py-2">8</td><td className="px-4 py-2">-13.33</td><td className="px-4 py-2">945.0</td><td className="px-4 py-2">62</td><td className="px-4 py-2">16.67</td><td className="px-4 py-2">1064.6</td><td className="px-4 py-2">116</td><td className="px-4 py-2">46.67</td><td className="px-4 py-2">1180.0</td></tr>
                  <tr><td className="px-4 py-2">10</td><td className="px-4 py-2">-12.22</td><td className="px-4 py-2">949.3</td><td className="px-4 py-2">64</td><td className="px-4 py-2">17.78</td><td className="px-4 py-2">1068.8</td><td className="px-4 py-2">118</td><td className="px-4 py-2">47.78</td><td className="px-4 py-2">1184.3</td></tr>
                  <tr><td className="px-4 py-2">12</td><td className="px-4 py-2">-11.11</td><td className="px-4 py-2">953.5</td><td className="px-4 py-2">66</td><td className="px-4 py-2">18.89</td><td className="px-4 py-2">1073.1</td><td className="px-4 py-2">120</td><td className="px-4 py-2">48.89</td><td className="px-4 py-2">1188.5</td></tr>
                  <tr><td className="px-4 py-2">122</td><td className="px-4 py-2">50.00</td><td className="px-4 py-2">1192.8</td><td className="px-4 py-2">124</td><td className="px-4 py-2">51.11</td><td className="px-4 py-2">1197.0</td><td className="px-4 py-2">176</td><td className="px-4 py-2">80.00</td><td className="px-4 py-2">1309.7</td></tr>
                  <tr><td className="px-4 py-2">126</td><td className="px-4 py-2">52.22</td><td className="px-4 py-2">1201.3</td><td className="px-4 py-2">128</td><td className="px-4 py-2">53.33</td><td className="px-4 py-2">1205.5</td><td className="px-4 py-2">178</td><td className="px-4 py-2">81.11</td><td className="px-4 py-2">1313.9</td></tr>
                  <tr><td className="px-4 py-2">130</td><td className="px-4 py-2">54.44</td><td className="px-4 py-2">1209.8</td><td className="px-4 py-2">132</td><td className="px-4 py-2">55.56</td><td className="px-4 py-2">1214.0</td><td className="px-4 py-2">180</td><td className="px-4 py-2">82.22</td><td className="px-4 py-2">1318.2</td></tr>
                  <tr><td className="px-4 py-2">134</td><td className="px-4 py-2">56.67</td><td className="px-4 py-2">1218.3</td><td className="px-4 py-2">136</td><td className="px-4 py-2">57.78</td><td className="px-4 py-2">1222.5</td><td className="px-4 py-2">182</td><td className="px-4 py-2">83.33</td><td className="px-4 py-2">1322.4</td></tr>
                  <tr><td className="px-4 py-2">138</td><td className="px-4 py-2">58.89</td><td className="px-4 py-2">1226.8</td><td className="px-4 py-2">140</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">1231.1</td><td className="px-4 py-2">184</td><td className="px-4 py-2">84.44</td><td className="px-4 py-2">1326.7</td></tr>
                  <tr><td className="px-4 py-2">142</td><td className="px-4 py-2">61.11</td><td className="px-4 py-2">1235.3</td><td className="px-4 py-2">144</td><td className="px-4 py-2">62.22</td><td className="px-4 py-2">1239.6</td><td className="px-4 py-2">185</td><td className="px-4 py-2">85.00</td><td className="px-4 py-2">1328.6</td></tr>
                  <tr><td className="px-4 py-2">146</td><td className="px-4 py-2">63.33</td><td className="px-4 py-2">1243.8</td><td className="px-4 py-2">148</td><td className="px-4 py-2">64.44</td><td className="px-4 py-2">1248.1</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">150</td><td className="px-4 py-2">65.56</td><td className="px-4 py-2">1252.4</td><td className="px-4 py-2">152</td><td className="px-4 py-2">66.67</td><td className="px-4 py-2">1256.6</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">154</td><td className="px-4 py-2">67.78</td><td className="px-4 py-2">1260.9</td><td className="px-4 py-2">156</td><td className="px-4 py-2">68.89</td><td className="px-4 py-2">1265.1</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">158</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">1269.4</td><td className="px-4 py-2">160</td><td className="px-4 py-2">71.11</td><td className="px-4 py-2">1273.6</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">162</td><td className="px-4 py-2">72.22</td><td className="px-4 py-2">1277.9</td><td className="px-4 py-2">164</td><td className="px-4 py-2">73.33</td><td className="px-4 py-2">1282.1</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">166</td><td className="px-4 py-2">74.44</td><td className="px-4 py-2">1286.4</td><td className="px-4 py-2">168</td><td className="px-4 py-2">75.56</td><td className="px-4 py-2">1290.6</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">170</td><td className="px-4 py-2">76.67</td><td className="px-4 py-2">1294.9</td><td className="px-4 py-2">172</td><td className="px-4 py-2">77.78</td><td className="px-4 py-2">1299.1</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">174</td><td className="px-4 py-2">78.89</td><td className="px-4 py-2">1303.3</td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td><td className="px-4 py-2"></td></tr>
                  <tr><td className="px-4 py-2">140</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">1231.7</td><td className="px-4 py-2">194</td><td className="px-4 py-2">90.00</td><td className="px-4 py-2">1348.6</td><td className="px-4 py-2">248</td><td className="px-4 py-2">120.00</td><td className="px-4 py-2">1465.5</td></tr>
                  <tr><td className="px-4 py-2">142</td><td className="px-4 py-2">61.11</td><td className="px-4 py-2">1235.9</td><td className="px-4 py-2">196</td><td className="px-4 py-2">91.11</td><td className="px-4 py-2">1352.8</td><td className="px-4 py-2">250</td><td className="px-4 py-2">121.11</td><td className="px-4 py-2">1469.8</td></tr>
                  <tr><td className="px-4 py-2">144</td><td className="px-4 py-2">62.22</td><td className="px-4 py-2">1240.2</td><td className="px-4 py-2">198</td><td className="px-4 py-2">92.22</td><td className="px-4 py-2">1357.1</td><td className="px-4 py-2">252</td><td className="px-4 py-2">122.22</td><td className="px-4 py-2">1474.0</td></tr>
                  <tr><td className="px-4 py-2">146</td><td className="px-4 py-2">63.33</td><td className="px-4 py-2">1244.4</td><td className="px-4 py-2">200</td><td className="px-4 py-2">93.33</td><td className="px-4 py-2">1361.3</td><td className="px-4 py-2">254</td><td className="px-4 py-2">123.33</td><td className="px-4 py-2">1478.3</td></tr>
                  <tr><td className="px-4 py-2">148</td><td className="px-4 py-2">64.44</td><td className="px-4 py-2">1248.7</td><td className="px-4 py-2">202</td><td className="px-4 py-2">94.44</td><td className="px-4 py-2">1365.6</td><td className="px-4 py-2">256</td><td className="px-4 py-2">124.44</td><td className="px-4 py-2">1482.5</td></tr>
                  <tr><td className="px-4 py-2">150</td><td className="px-4 py-2">65.56</td><td className="px-4 py-2">1252.9</td><td className="px-4 py-2">204</td><td className="px-4 py-2">95.56</td><td className="px-4 py-2">1369.9</td><td className="px-4 py-2">258</td><td className="px-4 py-2">125.56</td><td className="px-4 py-2">1486.8</td></tr>
                  <tr><td className="px-4 py-2">152</td><td className="px-4 py-2">66.67</td><td className="px-4 py-2">1257.2</td><td className="px-4 py-2">206</td><td className="px-4 py-2">96.67</td><td className="px-4 py-2">1374.1</td><td className="px-4 py-2">260</td><td className="px-4 py-2">126.67</td><td className="px-4 py-2">1491.0</td></tr>
                  <tr><td className="px-4 py-2">154</td><td className="px-4 py-2">67.78</td><td className="px-4 py-2">1261.4</td><td className="px-4 py-2">208</td><td className="px-4 py-2">97.78</td><td className="px-4 py-2">1378.4</td><td className="px-4 py-2">262</td><td className="px-4 py-2">127.78</td><td className="px-4 py-2">1495.3</td></tr>
                  <tr><td className="px-4 py-2">156</td><td className="px-4 py-2">68.89</td><td className="px-4 py-2">1265.7</td><td className="px-4 py-2">210</td><td className="px-4 py-2">98.89</td><td className="px-4 py-2">1382.6</td><td className="px-4 py-2">264</td><td className="px-4 py-2">128.89</td><td className="px-4 py-2">1499.5</td></tr>
                  <tr><td className="px-4 py-2">158</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">1270.6</td><td className="px-4 py-2">212</td><td className="px-4 py-2">100.00</td><td className="px-4 py-2">1387.5</td><td className="px-4 py-2">266</td><td className="px-4 py-2">130.00</td><td className="px-4 py-2">1504.4</td></tr>
                  <tr><td className="px-4 py-2">160</td><td className="px-4 py-2">71.11</td><td className="px-4 py-2">1274.8</td><td className="px-4 py-2">214</td><td className="px-4 py-2">101.11</td><td className="px-4 py-2">1391.7</td><td className="px-4 py-2">268</td><td className="px-4 py-2">131.11</td><td className="px-4 py-2">1508.7</td></tr>
                  <tr><td className="px-4 py-2">162</td><td className="px-4 py-2">72.22</td><td className="px-4 py-2">1279.1</td><td className="px-4 py-2">216</td><td className="px-4 py-2">102.22</td><td className="px-4 py-2">1396.0</td><td className="px-4 py-2">270</td><td className="px-4 py-2">132.22</td><td className="px-4 py-2">1512.9</td></tr>
                  <tr><td className="px-4 py-2">164</td><td className="px-4 py-2">73.33</td><td className="px-4 py-2">1283.3</td><td className="px-4 py-2">218</td><td className="px-4 py-2">103.33</td><td className="px-4 py-2">1400.2</td><td className="px-4 py-2">272</td><td className="px-4 py-2">133.33</td><td className="px-4 py-2">1517.2</td></tr>
                  <tr><td className="px-4 py-2">166</td><td className="px-4 py-2">74.44</td><td className="px-4 py-2">1287.6</td><td className="px-4 py-2">220</td><td className="px-4 py-2">104.44</td><td className="px-4 py-2">1404.5</td><td className="px-4 py-2">274</td><td className="px-4 py-2">134.44</td><td className="px-4 py-2">1521.4</td></tr>
                  <tr><td className="px-4 py-2">168</td><td className="px-4 py-2">75.56</td><td className="px-4 py-2">1291.8</td><td className="px-4 py-2">222</td><td className="px-4 py-2">105.56</td><td className="px-4 py-2">1408.7</td><td className="px-4 py-2">276</td><td className="px-4 py-2">135.56</td><td className="px-4 py-2">1525.7</td></tr>
                  <tr><td className="px-4 py-2">170</td><td className="px-4 py-2">76.67</td><td className="px-4 py-2">1296.1</td><td className="px-4 py-2">224</td><td className="px-4 py-2">106.67</td><td className="px-4 py-2">1413.0</td><td className="px-4 py-2">278</td><td className="px-4 py-2">136.67</td><td className="px-4 py-2">1529.9</td></tr>
                  <tr><td className="px-4 py-2">172</td><td className="px-4 py-2">77.78</td><td className="px-4 py-2">1300.3</td><td className="px-4 py-2">226</td><td className="px-4 py-2">107.78</td><td className="px-4 py-2">1417.2</td><td className="px-4 py-2">280</td><td className="px-4 py-2">137.78</td><td className="px-4 py-2">1534.2</td></tr>
                  <tr><td className="px-4 py-2">174</td><td className="px-4 py-2">78.89</td><td className="px-4 py-2">1304.6</td><td className="px-4 py-2">228</td><td className="px-4 py-2">108.89</td><td className="px-4 py-2">1421.5</td><td className="px-4 py-2">282</td><td className="px-4 py-2">138.89</td><td className="px-4 py-2">1538.4</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* 1K (375) Platinum RTD Table */}
          {activeTab === '375' && (
          <div className="mb-12 bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <h3 className="text-2xl font-bold text-center text-neutral-900 py-6 bg-neutral-50 border-b-2 border-neutral-200">
              1K (375) PLATINUM RTD OUTPUT TABLE
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  <tr><td className="px-4 py-2">-40.00</td><td className="px-4 py-2">-40.00</td><td className="px-4 py-2">850.00</td><td className="px-4 py-2">36.00</td><td className="px-4 py-2">2.22</td><td className="px-4 py-2">1008.33</td><td className="px-4 py-2">112.00</td><td className="px-4 py-2">44.44</td><td className="px-4 py-2">1166.67</td></tr>
                  <tr><td className="px-4 py-2">-38.00</td><td className="px-4 py-2">-38.89</td><td className="px-4 py-2">854.17</td><td className="px-4 py-2">38.00</td><td className="px-4 py-2">3.33</td><td className="px-4 py-2">1012.50</td><td className="px-4 py-2">114.00</td><td className="px-4 py-2">45.56</td><td className="px-4 py-2">1170.83</td></tr>
                  <tr><td className="px-4 py-2">-36.00</td><td className="px-4 py-2">-37.78</td><td className="px-4 py-2">858.33</td><td className="px-4 py-2">40.00</td><td className="px-4 py-2">4.44</td><td className="px-4 py-2">1016.67</td><td className="px-4 py-2">116.00</td><td className="px-4 py-2">46.67</td><td className="px-4 py-2">1175.00</td></tr>
                  <tr><td className="px-4 py-2">-34.00</td><td className="px-4 py-2">-36.67</td><td className="px-4 py-2">862.50</td><td className="px-4 py-2">42.00</td><td className="px-4 py-2">5.56</td><td className="px-4 py-2">1020.83</td><td className="px-4 py-2">118.00</td><td className="px-4 py-2">47.78</td><td className="px-4 py-2">1179.17</td></tr>
                  <tr><td className="px-4 py-2">-32.00</td><td className="px-4 py-2">-35.56</td><td className="px-4 py-2">866.67</td><td className="px-4 py-2">44.00</td><td className="px-4 py-2">6.67</td><td className="px-4 py-2">1025.00</td><td className="px-4 py-2">120.00</td><td className="px-4 py-2">48.89</td><td className="px-4 py-2">1183.33</td></tr>
                  <tr><td className="px-4 py-2">-30.00</td><td className="px-4 py-2">-34.44</td><td className="px-4 py-2">870.83</td><td className="px-4 py-2">46.00</td><td className="px-4 py-2">7.78</td><td className="px-4 py-2">1029.17</td><td className="px-4 py-2">122.00</td><td className="px-4 py-2">50.00</td><td className="px-4 py-2">1187.50</td></tr>
                  <tr><td className="px-4 py-2">-28.00</td><td className="px-4 py-2">-33.33</td><td className="px-4 py-2">875.00</td><td className="px-4 py-2">48.00</td><td className="px-4 py-2">8.89</td><td className="px-4 py-2">1033.33</td><td className="px-4 py-2">124.00</td><td className="px-4 py-2">51.11</td><td className="px-4 py-2">1191.67</td></tr>
                  <tr><td className="px-4 py-2">-26.00</td><td className="px-4 py-2">-32.22</td><td className="px-4 py-2">879.17</td><td className="px-4 py-2">50.00</td><td className="px-4 py-2">10.00</td><td className="px-4 py-2">1037.50</td><td className="px-4 py-2">126.00</td><td className="px-4 py-2">52.22</td><td className="px-4 py-2">1195.83</td></tr>
                  <tr><td className="px-4 py-2">-24.00</td><td className="px-4 py-2">-31.11</td><td className="px-4 py-2">883.33</td><td className="px-4 py-2">52.00</td><td className="px-4 py-2">11.11</td><td className="px-4 py-2">1041.67</td><td className="px-4 py-2">128.00</td><td className="px-4 py-2">53.33</td><td className="px-4 py-2">1200.00</td></tr>
                  <tr><td className="px-4 py-2">-22.00</td><td className="px-4 py-2">-30.00</td><td className="px-4 py-2">887.50</td><td className="px-4 py-2">54.00</td><td className="px-4 py-2">12.22</td><td className="px-4 py-2">1045.83</td><td className="px-4 py-2">130.00</td><td className="px-4 py-2">54.44</td><td className="px-4 py-2">1204.17</td></tr>
                  <tr><td className="px-4 py-2">-20.00</td><td className="px-4 py-2">-28.89</td><td className="px-4 py-2">891.67</td><td className="px-4 py-2">56.00</td><td className="px-4 py-2">13.33</td><td className="px-4 py-2">1050.00</td><td className="px-4 py-2">132.00</td><td className="px-4 py-2">55.56</td><td className="px-4 py-2">1208.33</td></tr>
                  <tr><td className="px-4 py-2">-18.00</td><td className="px-4 py-2">-27.78</td><td className="px-4 py-2">895.83</td><td className="px-4 py-2">58.00</td><td className="px-4 py-2">14.44</td><td className="px-4 py-2">1054.17</td><td className="px-4 py-2">134.00</td><td className="px-4 py-2">56.67</td><td className="px-4 py-2">1212.50</td></tr>
                  <tr><td className="px-4 py-2">-16.00</td><td className="px-4 py-2">-26.67</td><td className="px-4 py-2">900.00</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">15.56</td><td className="px-4 py-2">1058.33</td><td className="px-4 py-2">136.00</td><td className="px-4 py-2">57.78</td><td className="px-4 py-2">1216.67</td></tr>
                  <tr><td className="px-4 py-2">-14.00</td><td className="px-4 py-2">-25.56</td><td className="px-4 py-2">904.17</td><td className="px-4 py-2">62.00</td><td className="px-4 py-2">16.67</td><td className="px-4 py-2">1062.50</td><td className="px-4 py-2">138.00</td><td className="px-4 py-2">58.89</td><td className="px-4 py-2">1220.83</td></tr>
                  <tr><td className="px-4 py-2">-12.00</td><td className="px-4 py-2">-24.44</td><td className="px-4 py-2">908.33</td><td className="px-4 py-2">64.00</td><td className="px-4 py-2">17.78</td><td className="px-4 py-2">1066.67</td><td className="px-4 py-2">140.00</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">1225.00</td></tr>
                  <tr><td className="px-4 py-2">-10.00</td><td className="px-4 py-2">-23.33</td><td className="px-4 py-2">912.50</td><td className="px-4 py-2">66.00</td><td className="px-4 py-2">18.89</td><td className="px-4 py-2">1070.83</td><td className="px-4 py-2">142.00</td><td className="px-4 py-2">61.11</td><td className="px-4 py-2">1229.17</td></tr>
                  <tr><td className="px-4 py-2">-8.00</td><td className="px-4 py-2">-22.22</td><td className="px-4 py-2">916.67</td><td className="px-4 py-2">68.00</td><td className="px-4 py-2">20.00</td><td className="px-4 py-2">1075.00</td><td className="px-4 py-2">144.00</td><td className="px-4 py-2">62.22</td><td className="px-4 py-2">1233.33</td></tr>
                  <tr><td className="px-4 py-2">-6.00</td><td className="px-4 py-2">-21.11</td><td className="px-4 py-2">920.83</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">21.11</td><td className="px-4 py-2">1079.17</td><td className="px-4 py-2">146.00</td><td className="px-4 py-2">63.33</td><td className="px-4 py-2">1237.50</td></tr>
                  <tr><td className="px-4 py-2">-4.00</td><td className="px-4 py-2">-20.00</td><td className="px-4 py-2">925.00</td><td className="px-4 py-2">72.00</td><td className="px-4 py-2">22.22</td><td className="px-4 py-2">1083.33</td><td className="px-4 py-2">148.00</td><td className="px-4 py-2">64.44</td><td className="px-4 py-2">1241.67</td></tr>
                  <tr><td className="px-4 py-2">-2.00</td><td className="px-4 py-2">-18.89</td><td className="px-4 py-2">929.17</td><td className="px-4 py-2">74.00</td><td className="px-4 py-2">23.33</td><td className="px-4 py-2">1087.50</td><td className="px-4 py-2">150.00</td><td className="px-4 py-2">65.56</td><td className="px-4 py-2">1245.83</td></tr>
                  <tr><td className="px-4 py-2">0.00</td><td className="px-4 py-2">-17.78</td><td className="px-4 py-2">933.33</td><td className="px-4 py-2">76.00</td><td className="px-4 py-2">24.44</td><td className="px-4 py-2">1091.67</td><td className="px-4 py-2">152.00</td><td className="px-4 py-2">66.67</td><td className="px-4 py-2">1250.00</td></tr>
                  <tr><td className="px-4 py-2">2.00</td><td className="px-4 py-2">-16.67</td><td className="px-4 py-2">937.50</td><td className="px-4 py-2">78.00</td><td className="px-4 py-2">25.56</td><td className="px-4 py-2">1095.83</td><td className="px-4 py-2">154.00</td><td className="px-4 py-2">67.78</td><td className="px-4 py-2">1254.17</td></tr>
                  <tr><td className="px-4 py-2">4.00</td><td className="px-4 py-2">-15.56</td><td className="px-4 py-2">941.67</td><td className="px-4 py-2">80.00</td><td className="px-4 py-2">26.67</td><td className="px-4 py-2">1100.00</td><td className="px-4 py-2">156.00</td><td className="px-4 py-2">68.89</td><td className="px-4 py-2">1258.33</td></tr>
                  <tr><td className="px-4 py-2">6.00</td><td className="px-4 py-2">-14.44</td><td className="px-4 py-2">945.83</td><td className="px-4 py-2">82.00</td><td className="px-4 py-2">27.78</td><td className="px-4 py-2">1104.17</td><td className="px-4 py-2">158.00</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">1262.50</td></tr>
                  <tr><td className="px-4 py-2">8.00</td><td className="px-4 py-2">-13.33</td><td className="px-4 py-2">950.00</td><td className="px-4 py-2">84.00</td><td className="px-4 py-2">28.89</td><td className="px-4 py-2">1108.33</td><td className="px-4 py-2">160.00</td><td className="px-4 py-2">71.11</td><td className="px-4 py-2">1266.67</td></tr>
                  <tr><td className="px-4 py-2">10.00</td><td className="px-4 py-2">-12.22</td><td className="px-4 py-2">954.17</td><td className="px-4 py-2">86.00</td><td className="px-4 py-2">30.00</td><td className="px-4 py-2">1112.50</td><td className="px-4 py-2">162.00</td><td className="px-4 py-2">72.22</td><td className="px-4 py-2">1270.83</td></tr>
                  <tr><td className="px-4 py-2">12.00</td><td className="px-4 py-2">-11.11</td><td className="px-4 py-2">958.33</td><td className="px-4 py-2">88.00</td><td className="px-4 py-2">31.11</td><td className="px-4 py-2">1116.67</td><td className="px-4 py-2">164.00</td><td className="px-4 py-2">73.33</td><td className="px-4 py-2">1275.00</td></tr>
                  <tr><td className="px-4 py-2">14.00</td><td className="px-4 py-2">-10.00</td><td className="px-4 py-2">962.50</td><td className="px-4 py-2">90.00</td><td className="px-4 py-2">32.22</td><td className="px-4 py-2">1120.83</td><td className="px-4 py-2">166.00</td><td className="px-4 py-2">74.44</td><td className="px-4 py-2">1279.17</td></tr>
                  <tr><td className="px-4 py-2">16.00</td><td className="px-4 py-2">-8.89</td><td className="px-4 py-2">966.67</td><td className="px-4 py-2">92.00</td><td className="px-4 py-2">33.33</td><td className="px-4 py-2">1125.00</td><td className="px-4 py-2">168.00</td><td className="px-4 py-2">75.56</td><td className="px-4 py-2">1283.33</td></tr>
                  <tr><td className="px-4 py-2">18.00</td><td className="px-4 py-2">-7.78</td><td className="px-4 py-2">970.83</td><td className="px-4 py-2">94.00</td><td className="px-4 py-2">34.44</td><td className="px-4 py-2">1129.17</td><td className="px-4 py-2">170.00</td><td className="px-4 py-2">76.67</td><td className="px-4 py-2">1287.50</td></tr>
                  <tr><td className="px-4 py-2">20.00</td><td className="px-4 py-2">-6.67</td><td className="px-4 py-2">975.00</td><td className="px-4 py-2">96.00</td><td className="px-4 py-2">35.56</td><td className="px-4 py-2">1133.33</td><td className="px-4 py-2">172.00</td><td className="px-4 py-2">77.78</td><td className="px-4 py-2">1291.67</td></tr>
                  <tr><td className="px-4 py-2">22.00</td><td className="px-4 py-2">-5.56</td><td className="px-4 py-2">979.17</td><td className="px-4 py-2">98.00</td><td className="px-4 py-2">36.67</td><td className="px-4 py-2">1137.50</td><td className="px-4 py-2">174.00</td><td className="px-4 py-2">78.89</td><td className="px-4 py-2">1295.83</td></tr>
                  <tr><td className="px-4 py-2">24.00</td><td className="px-4 py-2">-4.44</td><td className="px-4 py-2">983.33</td><td className="px-4 py-2">100.00</td><td className="px-4 py-2">37.78</td><td className="px-4 py-2">1141.67</td><td className="px-4 py-2">176.00</td><td className="px-4 py-2">80.00</td><td className="px-4 py-2">1300.00</td></tr>
                  <tr><td className="px-4 py-2">26.00</td><td className="px-4 py-2">-3.33</td><td className="px-4 py-2">987.50</td><td className="px-4 py-2">102.00</td><td className="px-4 py-2">38.89</td><td className="px-4 py-2">1145.83</td><td className="px-4 py-2">178.00</td><td className="px-4 py-2">81.11</td><td className="px-4 py-2">1304.17</td></tr>
                  <tr><td className="px-4 py-2">28.00</td><td className="px-4 py-2">-2.22</td><td className="px-4 py-2">991.67</td><td className="px-4 py-2">104.00</td><td className="px-4 py-2">40.00</td><td className="px-4 py-2">1150.00</td><td className="px-4 py-2">180.00</td><td className="px-4 py-2">82.22</td><td className="px-4 py-2">1308.33</td></tr>
                  <tr><td className="px-4 py-2">30.00</td><td className="px-4 py-2">-1.11</td><td className="px-4 py-2">995.83</td><td className="px-4 py-2">106.00</td><td className="px-4 py-2">41.11</td><td className="px-4 py-2">1154.17</td><td className="px-4 py-2">182.00</td><td className="px-4 py-2">83.33</td><td className="px-4 py-2">1312.50</td></tr>
                  <tr><td className="px-4 py-2">32.00</td><td className="px-4 py-2">0.00</td><td className="px-4 py-2">1000.00</td><td className="px-4 py-2">108.00</td><td className="px-4 py-2">42.22</td><td className="px-4 py-2">1158.33</td><td className="px-4 py-2">184.00</td><td className="px-4 py-2">84.44</td><td className="px-4 py-2">1316.67</td></tr>
                  <tr><td className="px-4 py-2">34.00</td><td className="px-4 py-2">1.11</td><td className="px-4 py-2">1004.17</td><td className="px-4 py-2">110.00</td><td className="px-4 py-2">43.33</td><td className="px-4 py-2">1162.50</td><td className="px-4 py-2">186.00</td><td className="px-4 py-2">85.56</td><td className="px-4 py-2">1320.83</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* 1K (Ni) Nickel RTD Table */}
          {activeTab === 'nickel' && (
          <div className="mb-12 bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
            <h3 className="text-2xl font-bold text-center text-neutral-900 py-6 bg-neutral-50 border-b-2 border-neutral-200">
              1K (Ni) NICKEL RTD OUTPUT TABLE
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">Ohms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  <tr><td className="px-4 py-2">-40.00</td><td className="px-4 py-2">-40.00</td><td className="px-4 py-2">804.4</td><td className="px-4 py-2">36.00</td><td className="px-4 py-2">2.22</td><td className="px-4 py-2">1011.8</td><td className="px-4 py-2">112.00</td><td className="px-4 py-2">44.44</td><td className="px-4 py-2">1228.3</td></tr>
                  <tr><td className="px-4 py-2">-38.00</td><td className="px-4 py-2">-38.89</td><td className="px-4 py-2">810.0</td><td className="px-4 py-2">38.00</td><td className="px-4 py-2">3.33</td><td className="px-4 py-2">1017.3</td><td className="px-4 py-2">114.00</td><td className="px-4 py-2">45.56</td><td className="px-4 py-2">1233.9</td></tr>
                  <tr><td className="px-4 py-2">-36.00</td><td className="px-4 py-2">-37.78</td><td className="px-4 py-2">815.5</td><td className="px-4 py-2">40.00</td><td className="px-4 py-2">4.44</td><td className="px-4 py-2">1022.9</td><td className="px-4 py-2">116.00</td><td className="px-4 py-2">46.67</td><td className="px-4 py-2">1239.4</td></tr>
                  <tr><td className="px-4 py-2">-34.00</td><td className="px-4 py-2">-36.67</td><td className="px-4 py-2">821.1</td><td className="px-4 py-2">42.00</td><td className="px-4 py-2">5.56</td><td className="px-4 py-2">1028.4</td><td className="px-4 py-2">118.00</td><td className="px-4 py-2">47.78</td><td className="px-4 py-2">1245.0</td></tr>
                  <tr><td className="px-4 py-2">-32.00</td><td className="px-4 py-2">-35.56</td><td className="px-4 py-2">826.6</td><td className="px-4 py-2">44.00</td><td className="px-4 py-2">6.67</td><td className="px-4 py-2">1034.0</td><td className="px-4 py-2">120.00</td><td className="px-4 py-2">48.89</td><td className="px-4 py-2">1250.5</td></tr>
                  <tr><td className="px-4 py-2">-30.00</td><td className="px-4 py-2">-34.44</td><td className="px-4 py-2">832.2</td><td className="px-4 py-2">46.00</td><td className="px-4 py-2">7.78</td><td className="px-4 py-2">1039.5</td><td className="px-4 py-2">122.00</td><td className="px-4 py-2">50.00</td><td className="px-4 py-2">1256.1</td></tr>
                  <tr><td className="px-4 py-2">-28.00</td><td className="px-4 py-2">-33.33</td><td className="px-4 py-2">837.7</td><td className="px-4 py-2">48.00</td><td className="px-4 py-2">8.89</td><td className="px-4 py-2">1045.1</td><td className="px-4 py-2">124.00</td><td className="px-4 py-2">51.11</td><td className="px-4 py-2">1261.6</td></tr>
                  <tr><td className="px-4 py-2">-26.00</td><td className="px-4 py-2">-32.22</td><td className="px-4 py-2">843.3</td><td className="px-4 py-2">50.00</td><td className="px-4 py-2">10.00</td><td className="px-4 py-2">1050.6</td><td className="px-4 py-2">126.00</td><td className="px-4 py-2">52.22</td><td className="px-4 py-2">1267.2</td></tr>
                  <tr><td className="px-4 py-2">-24.00</td><td className="px-4 py-2">-31.11</td><td className="px-4 py-2">848.8</td><td className="px-4 py-2">52.00</td><td className="px-4 py-2">11.11</td><td className="px-4 py-2">1056.2</td><td className="px-4 py-2">128.00</td><td className="px-4 py-2">53.33</td><td className="px-4 py-2">1272.7</td></tr>
                  <tr><td className="px-4 py-2">-22.00</td><td className="px-4 py-2">-30.00</td><td className="px-4 py-2">854.4</td><td className="px-4 py-2">54.00</td><td className="px-4 py-2">12.22</td><td className="px-4 py-2">1061.7</td><td className="px-4 py-2">130.00</td><td className="px-4 py-2">54.44</td><td className="px-4 py-2">1278.3</td></tr>
                  <tr><td className="px-4 py-2">-20.00</td><td className="px-4 py-2">-28.89</td><td className="px-4 py-2">859.9</td><td className="px-4 py-2">56.00</td><td className="px-4 py-2">13.33</td><td className="px-4 py-2">1067.3</td><td className="px-4 py-2">132.00</td><td className="px-4 py-2">55.56</td><td className="px-4 py-2">1283.8</td></tr>
                  <tr><td className="px-4 py-2">-18.00</td><td className="px-4 py-2">-27.78</td><td className="px-4 py-2">865.5</td><td className="px-4 py-2">58.00</td><td className="px-4 py-2">14.44</td><td className="px-4 py-2">1072.8</td><td className="px-4 py-2">134.00</td><td className="px-4 py-2">56.67</td><td className="px-4 py-2">1289.4</td></tr>
                  <tr><td className="px-4 py-2">-16.00</td><td className="px-4 py-2">-26.67</td><td className="px-4 py-2">871.0</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">15.56</td><td className="px-4 py-2">1078.4</td><td className="px-4 py-2">136.00</td><td className="px-4 py-2">57.78</td><td className="px-4 py-2">1294.9</td></tr>
                  <tr><td className="px-4 py-2">-14.00</td><td className="px-4 py-2">-25.56</td><td className="px-4 py-2">876.6</td><td className="px-4 py-2">62.00</td><td className="px-4 py-2">16.67</td><td className="px-4 py-2">1083.9</td><td className="px-4 py-2">138.00</td><td className="px-4 py-2">58.89</td><td className="px-4 py-2">1300.5</td></tr>
                  <tr><td className="px-4 py-2">-12.00</td><td className="px-4 py-2">-24.44</td><td className="px-4 py-2">882.1</td><td className="px-4 py-2">64.00</td><td className="px-4 py-2">17.78</td><td className="px-4 py-2">1089.5</td><td className="px-4 py-2">140.00</td><td className="px-4 py-2">60.00</td><td className="px-4 py-2">1306.0</td></tr>
                  <tr><td className="px-4 py-2">-10.00</td><td className="px-4 py-2">-23.33</td><td className="px-4 py-2">887.7</td><td className="px-4 py-2">66.00</td><td className="px-4 py-2">18.89</td><td className="px-4 py-2">1095.0</td><td className="px-4 py-2">142.00</td><td className="px-4 py-2">61.11</td><td className="px-4 py-2">1311.6</td></tr>
                  <tr><td className="px-4 py-2">-8.00</td><td className="px-4 py-2">-22.22</td><td className="px-4 py-2">893.2</td><td className="px-4 py-2">68.00</td><td className="px-4 py-2">20.00</td><td className="px-4 py-2">1100.6</td><td className="px-4 py-2">144.00</td><td className="px-4 py-2">62.22</td><td className="px-4 py-2">1317.1</td></tr>
                  <tr><td className="px-4 py-2">-6.00</td><td className="px-4 py-2">-21.11</td><td className="px-4 py-2">898.8</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">21.11</td><td className="px-4 py-2">1106.1</td><td className="px-4 py-2">146.00</td><td className="px-4 py-2">63.33</td><td className="px-4 py-2">1322.7</td></tr>
                  <tr><td className="px-4 py-2">-4.00</td><td className="px-4 py-2">-20.00</td><td className="px-4 py-2">904.3</td><td className="px-4 py-2">72.00</td><td className="px-4 py-2">22.22</td><td className="px-4 py-2">1111.7</td><td className="px-4 py-2">148.00</td><td className="px-4 py-2">64.44</td><td className="px-4 py-2">1328.2</td></tr>
                  <tr><td className="px-4 py-2">-2.00</td><td className="px-4 py-2">-18.89</td><td className="px-4 py-2">909.9</td><td className="px-4 py-2">74.00</td><td className="px-4 py-2">23.33</td><td className="px-4 py-2">1117.2</td><td className="px-4 py-2">150.00</td><td className="px-4 py-2">65.56</td><td className="px-4 py-2">1333.8</td></tr>
                  <tr><td className="px-4 py-2">0.00</td><td className="px-4 py-2">-17.78</td><td className="px-4 py-2">915.4</td><td className="px-4 py-2">76.00</td><td className="px-4 py-2">24.44</td><td className="px-4 py-2">1122.8</td><td className="px-4 py-2">152.00</td><td className="px-4 py-2">66.67</td><td className="px-4 py-2">1339.3</td></tr>
                  <tr><td className="px-4 py-2">2.00</td><td className="px-4 py-2">-16.67</td><td className="px-4 py-2">921.0</td><td className="px-4 py-2">78.00</td><td className="px-4 py-2">25.56</td><td className="px-4 py-2">1128.3</td><td className="px-4 py-2">154.00</td><td className="px-4 py-2">67.78</td><td className="px-4 py-2">1344.9</td></tr>
                  <tr><td className="px-4 py-2">4.00</td><td className="px-4 py-2">-15.56</td><td className="px-4 py-2">926.5</td><td className="px-4 py-2">80.00</td><td className="px-4 py-2">26.67</td><td className="px-4 py-2">1133.9</td><td className="px-4 py-2">156.00</td><td className="px-4 py-2">68.89</td><td className="px-4 py-2">1350.4</td></tr>
                  <tr><td className="px-4 py-2">6.00</td><td className="px-4 py-2">-14.44</td><td className="px-4 py-2">932.1</td><td className="px-4 py-2">82.00</td><td className="px-4 py-2">27.78</td><td className="px-4 py-2">1139.4</td><td className="px-4 py-2">158.00</td><td className="px-4 py-2">70.00</td><td className="px-4 py-2">1356.0</td></tr>
                  <tr><td className="px-4 py-2">8.00</td><td className="px-4 py-2">-13.33</td><td className="px-4 py-2">937.6</td><td className="px-4 py-2">84.00</td><td className="px-4 py-2">28.89</td><td className="px-4 py-2">1145.0</td><td className="px-4 py-2">160.00</td><td className="px-4 py-2">71.11</td><td className="px-4 py-2">1361.5</td></tr>
                  <tr><td className="px-4 py-2">10.00</td><td className="px-4 py-2">-12.22</td><td className="px-4 py-2">943.2</td><td className="px-4 py-2">86.00</td><td className="px-4 py-2">30.00</td><td className="px-4 py-2">1150.5</td><td className="px-4 py-2">162.00</td><td className="px-4 py-2">72.22</td><td className="px-4 py-2">1367.1</td></tr>
                  <tr><td className="px-4 py-2">12.00</td><td className="px-4 py-2">-11.11</td><td className="px-4 py-2">948.7</td><td className="px-4 py-2">88.00</td><td className="px-4 py-2">31.11</td><td className="px-4 py-2">1156.1</td><td className="px-4 py-2">164.00</td><td className="px-4 py-2">73.33</td><td className="px-4 py-2">1372.6</td></tr>
                  <tr><td className="px-4 py-2">14.00</td><td className="px-4 py-2">-10.00</td><td className="px-4 py-2">954.3</td><td className="px-4 py-2">90.00</td><td className="px-4 py-2">32.22</td><td className="px-4 py-2">1161.6</td><td className="px-4 py-2">166.00</td><td className="px-4 py-2">74.44</td><td className="px-4 py-2">1378.2</td></tr>
                  <tr><td className="px-4 py-2">16.00</td><td className="px-4 py-2">-8.89</td><td className="px-4 py-2">959.8</td><td className="px-4 py-2">92.00</td><td className="px-4 py-2">33.33</td><td className="px-4 py-2">1167.2</td><td className="px-4 py-2">168.00</td><td className="px-4 py-2">75.56</td><td className="px-4 py-2">1383.7</td></tr>
                  <tr><td className="px-4 py-2">18.00</td><td className="px-4 py-2">-7.78</td><td className="px-4 py-2">965.4</td><td className="px-4 py-2">94.00</td><td className="px-4 py-2">34.44</td><td className="px-4 py-2">1172.7</td><td className="px-4 py-2">170.00</td><td className="px-4 py-2">76.67</td><td className="px-4 py-2">1389.3</td></tr>
                  <tr><td className="px-4 py-2">20.00</td><td className="px-4 py-2">-6.67</td><td className="px-4 py-2">970.9</td><td className="px-4 py-2">96.00</td><td className="px-4 py-2">35.56</td><td className="px-4 py-2">1178.3</td><td className="px-4 py-2">172.00</td><td className="px-4 py-2">77.78</td><td className="px-4 py-2">1394.8</td></tr>
                  <tr><td className="px-4 py-2">22.00</td><td className="px-4 py-2">-5.56</td><td className="px-4 py-2">976.5</td><td className="px-4 py-2">98.00</td><td className="px-4 py-2">36.67</td><td className="px-4 py-2">1183.8</td><td className="px-4 py-2">174.00</td><td className="px-4 py-2">78.89</td><td className="px-4 py-2">1400.4</td></tr>
                  <tr><td className="px-4 py-2">24.00</td><td className="px-4 py-2">-4.44</td><td className="px-4 py-2">982.0</td><td className="px-4 py-2">100.00</td><td className="px-4 py-2">37.78</td><td className="px-4 py-2">1189.4</td><td className="px-4 py-2">176.00</td><td className="px-4 py-2">80.00</td><td className="px-4 py-2">1405.9</td></tr>
                  <tr><td className="px-4 py-2">26.00</td><td className="px-4 py-2">-3.33</td><td className="px-4 py-2">987.6</td><td className="px-4 py-2">102.00</td><td className="px-4 py-2">38.89</td><td className="px-4 py-2">1194.9</td><td className="px-4 py-2">178.00</td><td className="px-4 py-2">81.11</td><td className="px-4 py-2">1411.5</td></tr>
                  <tr><td className="px-4 py-2">28.00</td><td className="px-4 py-2">-2.22</td><td className="px-4 py-2">993.1</td><td className="px-4 py-2">104.00</td><td className="px-4 py-2">40.00</td><td className="px-4 py-2">1200.5</td><td className="px-4 py-2">180.00</td><td className="px-4 py-2">82.22</td><td className="px-4 py-2">1417.0</td></tr>
                  <tr><td className="px-4 py-2">30.00</td><td className="px-4 py-2">-1.11</td><td className="px-4 py-2">998.7</td><td className="px-4 py-2">106.00</td><td className="px-4 py-2">41.11</td><td className="px-4 py-2">1206.0</td><td className="px-4 py-2">182.00</td><td className="px-4 py-2">83.33</td><td className="px-4 py-2">1422.6</td></tr>
                  <tr><td className="px-4 py-2">32.00</td><td className="px-4 py-2">0.00</td><td className="px-4 py-2">1000.0</td><td className="px-4 py-2">108.00</td><td className="px-4 py-2">42.22</td><td className="px-4 py-2">1211.6</td><td className="px-4 py-2">184.00</td><td className="px-4 py-2">84.44</td><td className="px-4 py-2">1428.1</td></tr>
                  <tr><td className="px-4 py-2">34.00</td><td className="px-4 py-2">1.11</td><td className="px-4 py-2">1006.2</td><td className="px-4 py-2">110.00</td><td className="px-4 py-2">43.33</td><td className="px-4 py-2">1217.1</td><td className="px-4 py-2">186.00</td><td className="px-4 py-2">85.56</td><td className="px-4 py-2">1433.7</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Additional note */}
          <div className="bg-blue-50 border border-primary-200 rounded-lg p-6 max-w-3xl mx-auto mt-12">
            <p className="text-neutral-800 text-sm">
              <strong>Note:</strong> Resistance values are calculated using industry-standard coefficients: IEC 60751 (α = 0.00385) for platinum RTDs and (α = 0.00672) for nickel RTDs. The 1K (375) table uses α = 0.00375. For complete
              tables covering the full temperature range or other RTD types,
              please contact BAPI technical support or refer to our downloadable
              specification sheets.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Need Help Selecting an RTD?
          </h2>
          <p className="text-neutral-700 mb-6">
            Our technical team can help you choose between standard and Class A
            RTDs for your application.
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
