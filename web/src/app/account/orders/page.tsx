import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
            Order History
          </h1>
        </div>
      </section>

      {/* Orders Content */}
      <section className="w-full py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Coming Soon Notice */}
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-accent-600" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Order History Coming Soon
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mb-6">
              We're currently building the order history integration with our e-commerce platform. 
              Soon you'll be able to view your past orders, track shipments, and download invoices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-lg transition-all duration-300"
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600 font-semibold rounded-lg transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Placeholder Order Cards (for design reference) */}
          <div className="mt-8 space-y-4 opacity-50">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">Order #12345</p>
                    <p className="text-sm text-neutral-600">Placed on January 1, 2026</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Delivered
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <p className="text-sm text-neutral-600">Sample order placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
