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
    title: `RTD Overview | BAPI`,
    description:
      'Resistance Temperature Detectors (RTDs) with excellent linearity and accuracy for precise temperature measurement',
  };
}

export default async function RTDOverviewPage() {
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

          {/* 1KΩ (385) Platinum RTD Table */}
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional note */}
          <div className="bg-blue-50 border border-primary-200 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-neutral-800 text-sm">
              <strong>Note:</strong> Resistance values are calculated using the
              IEC 60751 standard for platinum RTDs (α = 0.00385). For complete
              tables covering the full temperature range or other RTD types,
              please contact BAPI technical support or refer to our downloadable
              specification sheets.
            </p>
          </div>
        </section>

        {/* RTD Types Comparison */}
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Available RTD Types
          </h2>
          <div className="grid gap-8">
            {[
              {
                type: '100Ω Platinum RTD',
                desc: 'Standard 100Ω platinum sensor with 0.385Ω/°C coefficient',
                spec: 'IEC 60751 Class A',
              },
              {
                type: '1KΩ (375) Platinum RTD',
                desc: '1000Ω platinum with 3.75Ω/°C coefficient',
                spec: 'Operating range: -80 to 200°C',
              },
              {
                type: '1KΩ (385) Platinum RTD',
                desc: '1000Ω platinum with 3.85Ω/°C coefficient (DIN 43760)',
                spec: 'Operating range: -65 to 260°C',
              },
              {
                type: '1KΩ (Ni) Nickel RTD',
                desc: '1000Ω nickel sensor for standard HVAC applications',
                spec: 'Operating range: -70 to 205°C',
              },
            ].map(({ type, desc, spec }) => (
              <div
                key={type}
                className="bg-white border-2 border-neutral-200 rounded-lg p-8"
              >
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {type}
                </h3>
                <p className="text-neutral-600 mb-2">{desc}</p>
                <p className="text-sm text-neutral-500 mb-6 font-mono">{spec}</p>
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-2 border-neutral-300 rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-neutral-700 font-semibold mb-2">
                    Complete Resistance vs. Temperature Table
                  </p>
                  <p className="text-sm text-neutral-600 mb-6">
                    Full output tables with ohm values at 1°C increments are
                    available in technical datasheets and product documentation.
                  </p>
                  <Link
                    href="/support"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Request Detailed Specifications →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">
              Need Custom RTD Specifications?
            </h3>
            <p className="text-neutral-700 mb-4">
              BAPI can provide RTD sensors with custom resistance values,
              temperature coefficients, and operating ranges for specialized
              applications. Our technical team can help you select the right RTD
              type and provide complete output tables for your specific
              requirements.
            </p>
            <div className="flex gap-4">
              <Link
                href="/support"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                Contact Technical Support →
              </Link>
              <Link
                href="/products/temperature-sensors"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                Browse RTD Products →
              </Link>
            </div>
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
