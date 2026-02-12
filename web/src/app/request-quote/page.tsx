import { Metadata } from 'next';
import { FileText, Clock, CheckCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Quote | BAPI',
  description:
    'Request a custom quote for BAPI building automation products. Get pricing for your project requirements.',
};

export default function RequestQuotePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Request a Quote</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Get custom pricing for your building automation project
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <Clock className="mx-auto mb-3 h-12 w-12 text-primary-500" />
              <h3 className="mb-2 text-lg font-bold text-neutral-900">Fast Response</h3>
              <p className="text-neutral-600">Quote within 24-48 business hours</p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary-500" />
              <h3 className="mb-2 text-lg font-bold text-neutral-900">Accurate Pricing</h3>
              <p className="text-neutral-600">Detailed pricing for your exact needs</p>
            </div>
            <div className="text-center">
              <Mail className="mx-auto mb-3 h-12 w-12 text-primary-500" />
              <h3 className="mb-2 text-lg font-bold text-neutral-900">Direct Contact</h3>
              <p className="text-neutral-600">Work with our sales team directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">Quote Request Form</h2>

            <form className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-semibold text-neutral-700"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-semibold text-neutral-700"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-semibold text-neutral-700"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-semibold text-neutral-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900">
                  Project Details
                </h3>

                <div>
                  <label
                    htmlFor="projectType"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select project type</option>
                    <option value="new-construction">New Construction</option>
                    <option value="retrofit">Retrofit</option>
                    <option value="upgrade">System Upgrade</option>
                    <option value="replacement">Replacement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="products"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Products Needed *
                  </label>
                  <textarea
                    id="products"
                    name="products"
                    rows={4}
                    required
                    placeholder="List the products and quantities you need..."
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    placeholder="e.g., 50 sensors, 10 controllers"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeline"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Project Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (1-2 weeks)</option>
                    <option value="soon">Soon (1 month)</option>
                    <option value="planning">Planning (2-3 months)</option>
                    <option value="future">Future (3+ months)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="details"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Additional Details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder="Any additional information about your project..."
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="duration-normal w-full rounded-xl bg-accent-500 px-8 py-4 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
                >
                  Submit Quote Request
                </button>
                <p className="mt-3 text-center text-sm text-neutral-600">
                  We&apos;ll respond within 24-48 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Alternative */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h3 className="mb-3 text-xl font-bold text-neutral-900">Prefer to Speak with Someone?</h3>
          <p className="mb-4 text-neutral-600">
            Call our sales team directly at{' '}
            <a
              href="tel:+17158561203"
              className="font-bold text-primary-500 hover:text-primary-600"
            >
              (715) 856-1203
            </a>
          </p>
          <p className="text-sm text-neutral-500">Monday - Friday, 8am - 5pm CST</p>
        </div>
      </section>
    </main>
  );
}
