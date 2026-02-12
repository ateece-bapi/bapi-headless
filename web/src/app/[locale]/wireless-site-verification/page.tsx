import { Metadata } from 'next';
import { Radio, Signal, MapPin, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wireless Site Verification | BAPI',
  description:
    'Verify your wireless sensor deployment with BAPI site verification tool. Ensure optimal signal strength and coverage.',
};

export default function WirelessSiteVerificationPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Radio className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Wireless Site Verification</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Verify signal strength and optimize your wireless sensor deployment
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mb-8 max-w-none">
            <p className="text-lg leading-relaxed text-neutral-700">
              Before deploying BAPI wireless sensors, it's important to verify that your site has
              adequate signal coverage. This tool helps you test signal strength, identify potential
              interference, and optimize sensor placement for reliable communication.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-neutral-50 p-6">
              <Signal className="mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Signal Strength Testing</h3>
              <p className="text-sm text-neutral-600">
                Measure signal strength at proposed sensor locations
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-6">
              <MapPin className="mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Coverage Mapping</h3>
              <p className="text-sm text-neutral-600">Create coverage maps for your facility</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-6">
              <CheckCircle className="mb-3 h-10 w-10 text-primary-500" />
              <h3 className="mb-2 font-bold text-neutral-900">Deployment Validation</h3>
              <p className="text-sm text-neutral-600">Verify successful sensor installations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900">
            Verification Process
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Plan Layout</h3>
              <p className="text-sm text-neutral-600">
                Identify sensor locations on facility floor plan
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Test Signals</h3>
              <p className="text-sm text-neutral-600">
                Use verification kit to test signal at each location
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Document Results</h3>
              <p className="text-sm text-neutral-600">
                Record signal strength readings and coverage
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Optimize</h3>
              <p className="text-sm text-neutral-600">
                Adjust locations or add repeaters as needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Strength Guide */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            Signal Strength Guidelines
          </h2>

          <div className="overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      RSSI Value
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Signal Quality
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">
                      Recommendation
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-neutral-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 font-mono text-neutral-900">-70 dBm or better</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">Excellent</div>
                      <div className="text-sm text-neutral-600">Very strong signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Optimal for sensor deployment</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="mx-auto h-6 w-6 text-green-600" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-neutral-900">-71 to -80 dBm</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">Good</div>
                      <div className="text-sm text-neutral-600">Strong signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Suitable for most applications</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="mx-auto h-6 w-6 text-green-600" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-neutral-900">-81 to -90 dBm</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-amber-700">Fair</div>
                      <div className="text-sm text-neutral-600">Acceptable signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      May work, but consider optimization
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AlertTriangle className="mx-auto h-6 w-6 text-amber-500" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-neutral-900">-91 dBm or worse</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-700">Poor</div>
                      <div className="text-sm text-neutral-600">Weak signal</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">Relocate sensor or add repeater</td>
                    <td className="px-6 py-4 text-center">
                      <AlertTriangle className="mx-auto h-6 w-6 text-red-600" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Kit */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-neutral-900">Site Verification Kit</h2>
              <p className="mb-6 text-lg text-neutral-600">
                BAPI offers a complete site verification kit that includes everything you need to
                test and validate your wireless deployment before installation.
              </p>

              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">Test Transmitter</div>
                    <div className="text-sm text-neutral-600">Portable unit for signal testing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">Base Station Display</div>
                    <div className="text-sm text-neutral-600">Shows real-time RSSI values</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">Documentation Templates</div>
                    <div className="text-sm text-neutral-600">Forms for recording results</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">User Guide</div>
                    <div className="text-sm text-neutral-600">Step-by-step instructions</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="/request-quote"
                  className="inline-block rounded-xl bg-accent-500 px-6 py-3 text-center font-bold text-neutral-900 transition-colors hover:bg-accent-600"
                >
                  Request Verification Kit
                </a>
                <a
                  href="/contact"
                  className="inline-block rounded-xl border-2 border-primary-500 px-6 py-3 text-center font-bold text-primary-500 transition-colors hover:bg-primary-50"
                >
                  Contact Sales
                </a>
              </div>
            </div>

            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
              <h3 className="mb-4 text-xl font-bold text-neutral-900">Kit Includes:</h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>BA/WSP-T Test Transmitter</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>BA/WBN Base Station with Display</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Power Supply & Cables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Site Survey Documentation Forms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Quick Start Guide</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Carrying Case</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            Tips & Best Practices
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-900">Test During Occupancy</h3>
                  <p className="text-sm text-blue-800">
                    Test when the building is occupied to simulate real-world conditions. People and
                    equipment can affect signal propagation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-900">Consider Obstructions</h3>
                  <p className="text-sm text-blue-800">
                    Metal walls, concrete structures, and equipment can block wireless signals. Plan
                    for line-of-sight when possible.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-900">Document Everything</h3>
                  <p className="text-sm text-blue-800">
                    Record RSSI values, sensor locations, and any issues. This documentation is
                    valuable for troubleshooting and future expansions.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-900">Use Repeaters When Needed</h3>
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
      <section className="bg-primary-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">
            Need Help with Site Verification?
          </h2>
          <p className="mb-6 text-neutral-600">
            Our technical support team can guide you through the verification process
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+17158561203"
              className="font-bold text-primary-500 hover:text-primary-600"
            >
              Call (715) 856-1203
            </a>
            <span className="hidden text-neutral-300 sm:inline">|</span>
            <a
              href="mailto:sales@bapihvac.com"
              className="font-bold text-primary-500 hover:text-primary-600"
            >
              sales@bapihvac.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
