import { Metadata } from 'next';
import { FileText, Clock, CheckCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Quote | BAPI',
  description: 'Request a custom quote for BAPI building automation products. Get pricing for your project requirements.',
};

export default function RequestQuotePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Request a Quote
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Get custom pricing for your building automation project
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Fast Response</h3>
              <p className="text-neutral-600">Quote within 24-48 business hours</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Accurate Pricing</h3>
              <p className="text-neutral-600">Detailed pricing for your exact needs</p>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Direct Contact</h3>
              <p className="text-neutral-600">Work with our sales team directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Quote Request Form
            </h2>

            <form className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-neutral-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-neutral-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  Project Details
                </h3>
                
                <div>
                  <label htmlFor="projectType" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label htmlFor="products" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Products Needed *
                  </label>
                  <textarea
                    id="products"
                    name="products"
                    rows={4}
                    required
                    placeholder="List the products and quantities you need..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    placeholder="e.g., 50 sensors, 10 controllers"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Project Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (1-2 weeks)</option>
                    <option value="soon">Soon (1 month)</option>
                    <option value="planning">Planning (2-3 months)</option>
                    <option value="future">Future (3+ months)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder="Any additional information about your project..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-colors duration-normal"
                >
                  Submit Quote Request
                </button>
                <p className="text-sm text-neutral-600 mt-3 text-center">
                  We&apos;ll respond within 24-48 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Alternative */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            Prefer to Speak with Someone?
          </h3>
          <p className="text-neutral-600 mb-4">
            Call our sales team directly at{' '}
            <a href="tel:+17158561203" className="text-primary-500 hover:text-primary-600 font-bold">
              (715) 856-1203
            </a>
          </p>
          <p className="text-sm text-neutral-500">
            Monday - Friday, 8am - 5pm CST
          </p>
        </div>
      </section>
    </main>
  );
}
