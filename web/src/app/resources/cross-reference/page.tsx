import { Metadata } from 'next';
import { RefreshCw, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cross Reference Tool | BAPI',
  description: 'Find BAPI equivalents for competitor products. Cross-reference tool for building automation sensors.',
};

export default function CrossReferencePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Cross Reference Tool
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Find BAPI equivalents for competitor products
            </p>
          </div>
        </div>
      </section>

      {/* Search Tool */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Find BAPI Equivalent
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Select Manufacturer
                </label>
                <select
                  id="manufacturer"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose manufacturer...</option>
                  <option value="honeywell">Honeywell</option>
                  <option value="johnson">Johnson Controls</option>
                  <option value="siemens">Siemens</option>
                  <option value="schneider">Schneider Electric</option>
                  <option value="belimo">Belimo</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Enter Competitor Model Number
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    id="model"
                    placeholder="e.g., C7400A2100"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Find BAPI Equivalent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cross References */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">
            Popular Cross References
          </h2>

          <div className="space-y-4">
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Competitor</div>
                  <div className="font-bold text-neutral-900">Honeywell C7400A2100</div>
                  <div className="text-sm text-neutral-600">Room Temperature Sensor</div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">BAPI Equivalent</div>
                  <div className="font-bold text-primary-500">BA/10K-2-R</div>
                  <div className="text-sm text-neutral-600">10K Type 2 Room Sensor</div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Competitor</div>
                  <div className="font-bold text-neutral-900">Johnson Controls TE-6000</div>
                  <div className="text-sm text-neutral-600">Temperature & Humidity Sensor</div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">BAPI Equivalent</div>
                  <div className="font-bold text-primary-500">BA/RH-AS-R2</div>
                  <div className="text-sm text-neutral-600">RH & Temp Room Sensor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-neutral-600 mb-6">
            Contact our technical sales team for assistance with cross-referencing
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Sales Team
          </a>
        </div>
      </section>
    </main>
  );
}
