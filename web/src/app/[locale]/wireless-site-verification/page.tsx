import { Metadata } from 'next';
import { Radio, Signal, MapPin, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wireless Site Verification | BAPI',
  description: 'Verify your wireless sensor deployment with BAPI site verification tool. Ensure optimal signal strength and coverage.',
};

export default function WirelessSiteVerificationPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Radio className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Wireless Site Verification
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Verify signal strength and optimize your wireless sensor deployment
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-neutral-700 leading-relaxed">
              Before deploying BAPI wireless sensors, it's important to verify that your site has adequate 
              signal coverage. This tool helps you test signal strength, identify potential interference, 
              and optimize sensor placement for reliable communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-50 p-6 rounded-xl">
              <Signal className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Signal Strength Testing</h3>
              <p className="text-sm text-neutral-600">
                Measure signal strength at proposed sensor locations
              </p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-xl">
              <MapPin className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Coverage Mapping</h3>
              <p className="text-sm text-neutral-600">
                Create coverage maps for your facility
              </p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-xl">
              <CheckCircle className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Deployment Validation</h3>
              <p className="text-sm text-neutral-600">
                Verify successful sensor installations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Verification Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Plan Layout</h3>
              <p className="text-sm text-neutral-600">
                Identify sensor locations on facility floor plan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Test Signals</h3>
              <p className="text-sm text-neutral-600">
                Use verification kit to test signal at each location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Document Results</h3>
              <p className="text-sm text-neutral-600">
                Record signal strength readings and coverage
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Optimize</h3>
              <p className="text-sm text-neutral-600">
                Adjust locations or add repeaters as needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Strength Guide */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Signal Strength Guidelines
          </h2>

          <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">RSSI Value</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Signal Quality</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Recommendation</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-mono">-70 dBm or better</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">Excellent</div>
                      <div className="text-sm text-neutral-600">Very strong signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Optimal for sensor deployment</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-mono">-71 to -80 dBm</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">Good</div>
                      <div className="text-sm text-neutral-600">Strong signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Suitable for most applications</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-mono">-81 to -90 dBm</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-amber-700">Fair</div>
                      <div className="text-sm text-neutral-600">Acceptable signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">May work, but consider optimization</td>
                    <td className="px-6 py-4 text-center">
                      <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900 font-mono">-91 dBm or worse</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-700">Poor</div>
                      <div className="text-sm text-neutral-600">Weak signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Relocate sensor or add repeater</td>
                    <td className="px-6 py-4 text-center">
                      <AlertTriangle className="w-6 h-6 text-red-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Kit */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Site Verification Kit
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                BAPI offers a complete site verification kit that includes everything you need 
                to test and validate your wireless deployment before installation.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-neutral-900">Test Transmitter</div>
                    <div className="text-sm text-neutral-600">Portable unit for signal testing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-neutral-900">Base Station Display</div>
                    <div className="text-sm text-neutral-600">Shows real-time RSSI values</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-neutral-900">Documentation Templates</div>
                    <div className="text-sm text-neutral-600">Forms for recording results</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-neutral-900">User Guide</div>
                    <div className="text-sm text-neutral-600">Step-by-step instructions</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/request-quote"
                  className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-colors text-center"
                >
                  Request Verification Kit
                </a>
                <a
                  href="/contact"
                  className="inline-block border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl transition-colors text-center"
                >
                  Contact Sales
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border-2 border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                Kit Includes:
              </h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>BA/WSP-T Test Transmitter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>BA/WBN Base Station with Display</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Power Supply & Cables</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Site Survey Documentation Forms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Quick Start Guide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Carrying Case</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Tips & Best Practices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Test During Occupancy</h3>
                  <p className="text-sm text-blue-800">
                    Test when the building is occupied to simulate real-world conditions. 
                    People and equipment can affect signal propagation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Consider Obstructions</h3>
                  <p className="text-sm text-blue-800">
                    Metal walls, concrete structures, and equipment can block wireless signals. 
                    Plan for line-of-sight when possible.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Document Everything</h3>
                  <p className="text-sm text-blue-800">
                    Record RSSI values, sensor locations, and any issues. This documentation 
                    is valuable for troubleshooting and future expansions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Use Repeaters When Needed</h3>
                  <p className="text-sm text-blue-800">
                    If you have weak signal areas, BAPI wireless repeaters can extend coverage 
                    throughout your facility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 bg-primary-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Need Help with Site Verification?
          </h2>
          <p className="text-neutral-600 mb-6">
            Our technical support team can guide you through the verification process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+17158561203"
              className="text-primary-500 hover:text-primary-600 font-bold"
            >
              Call (715) 856-1203
            </a>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <a
              href="mailto:sales@bapihvac.com"
              className="text-primary-500 hover:text-primary-600 font-bold"
            >
              sales@bapihvac.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
