import { Metadata } from 'next';
import { Download, FileText, Printer, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalog & Price Book | BAPI',
  description:
    'Download the latest BAPI product catalog and price book for building automation sensors and controls.',
};

export default function CatalogPricebookPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Catalog & Price Book</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Download our complete product catalog and current pricing
            </p>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product Catalog */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-24 w-20 flex-shrink-0 items-center justify-center rounded bg-neutral-100">
                  <FileText className="h-10 w-10 text-primary-500" />
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-neutral-900">Product Catalog 2026</h2>
                  <p className="text-neutral-600">
                    Complete catalog featuring all BAPI sensors, controls, and accessories with
                    technical specifications, dimensions, and ordering information.
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
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
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                  <Download className="h-5 w-5" />
                  Download Catalog (PDF)
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500">
                  <Printer className="h-5 w-5" />
                  Request Printed Copy
                </button>
              </div>
            </div>

            {/* Price Book */}
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-primary-500">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-24 w-20 flex-shrink-0 items-center justify-center rounded bg-neutral-100">
                  <FileText className="h-10 w-10 text-primary-500" />
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-neutral-900">Price Book 2026</h2>
                  <p className="text-neutral-600">
                    Current list pricing for all BAPI products. Contact your sales representative
                    for volume discounts and project pricing.
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
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
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600">
                  <Download className="h-5 w-5" />
                  Download Price Book (PDF)
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500">
                  <Mail className="h-5 w-5" />
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900">
            Additional Resources
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-neutral-900">Product Selection Guide</h3>
              <p className="mb-4 text-sm text-neutral-600">
                Quick reference guide to help you select the right sensors for your application.
              </p>
              <button className="text-sm font-semibold text-primary-500 hover:text-primary-600">
                Download PDF →
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-neutral-900">Technical Specifications</h3>
              <p className="mb-4 text-sm text-neutral-600">
                Detailed technical specs for all BAPI sensors and controls.
              </p>
              <button className="text-sm font-semibold text-primary-500 hover:text-primary-600">
                View Specs →
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="mb-2 font-bold text-neutral-900">Installation Guides</h3>
              <p className="mb-4 text-sm text-neutral-600">
                Step-by-step installation instructions for BAPI products.
              </p>
              <button className="text-sm font-semibold text-primary-500 hover:text-primary-600">
                View Guides →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-primary-50 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-neutral-900">
              Need Help Finding the Right Products?
            </h2>
            <p className="mb-6 text-neutral-600">
              Our technical sales team can help you select the best sensors for your project
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+17158561203"
                className="inline-block rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
              >
                Call (715) 856-1203
              </a>
              <a
                href="/request-quote"
                className="inline-block rounded-xl border-2 border-primary-500 px-6 py-3 font-bold text-primary-500 transition-colors hover:bg-primary-50"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h3 className="mb-3 text-xl font-bold text-neutral-900">Stay Updated</h3>
          <p className="mb-6 text-neutral-600">
            Get notified when we release new catalog versions and pricing updates
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-primary-500"
            />
            <button className="whitespace-nowrap rounded-lg bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
