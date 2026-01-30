import { Metadata } from 'next';
import { Download, FileText, Printer, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalog & Price Book | BAPI',
  description: 'Download the latest BAPI product catalog and price book for building automation sensors and controls.',
};

export default function CatalogPricebookPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Catalog & Price Book
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Download our complete product catalog and current pricing
            </p>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Catalog */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-24 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="w-10 h-10 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Product Catalog 2026
                  </h2>
                  <p className="text-neutral-600">
                    Complete catalog featuring all BAPI sensors, controls, and accessories with 
                    technical specifications, dimensions, and ordering information.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Version:</span>
                  <span className="font-semibold text-neutral-900">2026.1 (January 2026)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Pages:</span>
                  <span className="font-semibold text-neutral-900">124 pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">File Size:</span>
                  <span className="font-semibold text-neutral-900">8.5 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Format:</span>
                  <span className="font-semibold text-neutral-900">PDF</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-colors">
                  <Download className="w-5 h-5" />
                  Download Catalog (PDF)
                </button>
                <button className="w-full flex items-center justify-center gap-2 border-2 border-neutral-300 hover:border-primary-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Printer className="w-5 h-5" />
                  Request Printed Copy
                </button>
              </div>
            </div>

            {/* Price Book */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500 transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-24 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="w-10 h-10 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Price Book 2026
                  </h2>
                  <p className="text-neutral-600">
                    Current list pricing for all BAPI products. Contact your sales representative 
                    for volume discounts and project pricing.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Version:</span>
                  <span className="font-semibold text-neutral-900">2026.1 (January 2026)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Pages:</span>
                  <span className="font-semibold text-neutral-900">32 pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">File Size:</span>
                  <span className="font-semibold text-neutral-900">2.1 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Format:</span>
                  <span className="font-semibold text-neutral-900">PDF</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-colors">
                  <Download className="w-5 h-5" />
                  Download Price Book (PDF)
                </button>
                <button className="w-full flex items-center justify-center gap-2 border-2 border-neutral-300 hover:border-primary-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Mail className="w-5 h-5" />
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Additional Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-2">Product Selection Guide</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Quick reference guide to help you select the right sensors for your application.
              </p>
              <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                Download PDF →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-2">Technical Specifications</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Detailed technical specs for all BAPI sensors and controls.
              </p>
              <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                View Specs →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-2">Installation Guides</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Step-by-step installation instructions for BAPI products.
              </p>
              <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                View Guides →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Need Help Finding the Right Products?
            </h2>
            <p className="text-neutral-600 mb-6">
              Our technical sales team can help you select the best sensors for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+17158561203"
                className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Call (715) 856-1203
              </a>
              <a
                href="/request-quote"
                className="inline-block border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            Stay Updated
          </h3>
          <p className="text-neutral-600 mb-6">
            Get notified when we release new catalog versions and pricing updates
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
