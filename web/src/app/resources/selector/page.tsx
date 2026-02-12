import { Metadata } from 'next';
import { Search, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Selector Tool | BAPI',
  description:
    'Find the perfect BAPI sensor for your application. Answer a few questions to get product recommendations.',
};

export default function ProductSelectorPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Search className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Product Selector</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Find the perfect sensor for your building automation project
            </p>
          </div>
        </div>
      </section>

      {/* Selector Tool */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Step 1 of 4</h2>
                <div className="flex gap-2">
                  <div className="h-2 w-16 rounded bg-primary-500"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                  <div className="h-2 w-16 rounded bg-neutral-200"></div>
                </div>
              </div>
              <p className="text-neutral-600">What type of measurement do you need?</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Temperature Only</h3>
                <p className="text-sm text-neutral-600">
                  Measure temperature in spaces, ducts, or outdoors
                </p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Temperature & Humidity</h3>
                <p className="text-sm text-neutral-600">
                  Monitor both temperature and relative humidity
                </p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Air Quality (CO₂, VOC, PM)</h3>
                <p className="text-sm text-neutral-600">Measure CO₂, VOC, or particulate matter</p>
              </button>

              <button className="rounded-xl border-2 border-neutral-300 p-6 text-left transition-all hover:border-primary-500 hover:bg-primary-50">
                <CheckCircle className="mb-3 h-8 w-8 text-primary-500" />
                <h3 className="mb-2 font-bold text-neutral-900">Pressure</h3>
                <p className="text-sm text-neutral-600">
                  Monitor differential or absolute pressure
                </p>
              </button>
            </div>

            <div className="flex justify-between">
              <button className="rounded-xl border-2 border-neutral-300 px-6 py-3 font-semibold transition-colors hover:border-primary-500">
                Back
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900">
            Or Browse by Category
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <a
              href="/products?category=temperature"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">Temperature Sensors</h3>
            </a>
            <a
              href="/products?category=humidity"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">Humidity Sensors</h3>
            </a>
            <a
              href="/products?category=wireless"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">Wireless Products</h3>
            </a>
            <a
              href="/products?category=air-quality"
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-primary-500"
            >
              <h3 className="font-bold text-neutral-900">Air Quality</h3>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
