import { Metadata } from 'next';
import { Search, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Selector Tool | BAPI',
  description: 'Find the perfect BAPI sensor for your application. Answer a few questions to get product recommendations.',
};

export default function ProductSelectorPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Search className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Product Selector
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Find the perfect sensor for your building automation project
            </p>
          </div>
        </div>
      </section>

      {/* Selector Tool */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Step 1 of 4</h2>
                <div className="flex gap-2">
                  <div className="w-16 h-2 bg-primary-500 rounded"></div>
                  <div className="w-16 h-2 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-2 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-2 bg-neutral-200 rounded"></div>
                </div>
              </div>
              <p className="text-neutral-600">
                What type of measurement do you need?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="p-6 border-2 border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <CheckCircle className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Temperature Only</h3>
                <p className="text-sm text-neutral-600">Measure temperature in spaces, ducts, or outdoors</p>
              </button>

              <button className="p-6 border-2 border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <CheckCircle className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Temperature & Humidity</h3>
                <p className="text-sm text-neutral-600">Monitor both temperature and relative humidity</p>
              </button>

              <button className="p-6 border-2 border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <CheckCircle className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Air Quality (CO₂, VOC, PM)</h3>
                <p className="text-sm text-neutral-600">Measure CO₂, VOC, or particulate matter</p>
              </button>

              <button className="p-6 border-2 border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <CheckCircle className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="font-bold text-neutral-900 mb-2">Pressure</h3>
                <p className="text-sm text-neutral-600">Monitor differential or absolute pressure</p>
              </button>
            </div>

            <div className="flex justify-between">
              <button className="px-6 py-3 border-2 border-neutral-300 rounded-xl font-semibold hover:border-primary-500 transition-colors">
                Back
              </button>
              <button className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-xl transition-colors flex items-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Or Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="/products?category=temperature" className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 transition-all text-center">
              <h3 className="font-bold text-neutral-900">Temperature Sensors</h3>
            </a>
            <a href="/products?category=humidity" className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 transition-all text-center">
              <h3 className="font-bold text-neutral-900">Humidity Sensors</h3>
            </a>
            <a href="/products?category=wireless" className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 transition-all text-center">
              <h3 className="font-bold text-neutral-900">Wireless Products</h3>
            </a>
            <a href="/products?category=air-quality" className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 transition-all text-center">
              <h3 className="font-bold text-neutral-900">Air Quality</h3>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
