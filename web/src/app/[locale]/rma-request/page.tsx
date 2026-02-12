import { Metadata } from 'next';
import { Package, FileText, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RMA Request | BAPI',
  description:
    'Request a Return Merchandise Authorization (RMA) for BAPI products. Fast processing and support for returns and repairs.',
};

export default function RMARequestPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">RMA Request</h1>
            <p className="mx-auto max-w-content text-xl text-primary-50">
              Return Merchandise Authorization for BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900">RMA Process</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Submit Request</h3>
              <p className="text-sm text-neutral-600">Fill out the RMA form below</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Receive RMA Number</h3>
              <p className="text-sm text-neutral-600">We&apos;ll email your RMA within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Ship Product</h3>
              <p className="text-sm text-neutral-600">Return product with RMA number</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-2 font-bold text-neutral-900">Resolution</h3>
              <p className="text-sm text-neutral-600">Repair, replace, or credit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
            <h3 className="mb-3 flex items-center text-lg font-bold text-amber-900">
              <FileText className="mr-2 h-5 w-5" />
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• All returns must have an RMA number before shipping</li>
              <li>• Products must be returned within 30 days of receiving RMA authorization</li>
              <li>• Include a copy of the original invoice with returned products</li>
              <li>
                • Customer is responsible for return shipping costs unless product is defective
              </li>
              <li>• Write RMA number clearly on outside of shipping box</li>
            </ul>
          </div>
        </div>
      </section>

      {/* RMA Form */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">RMA Request Form</h2>

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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
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

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900">
                  Product Information
                </h3>

                <div>
                  <label
                    htmlFor="productModel"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Product Model Number *
                  </label>
                  <input
                    type="text"
                    id="productModel"
                    name="productModel"
                    required
                    placeholder="e.g., BA/10K-2-O"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="serialNumber"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Serial Number (if available)
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="purchaseDate"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invoiceNumber"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Invoice/PO Number
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Quantity Being Returned *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Return Reason */}
              <div className="space-y-4">
                <h3 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900">
                  Return Reason
                </h3>

                <div>
                  <label
                    htmlFor="reason"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Reason for Return *
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong-item">Wrong Item Received</option>
                    <option value="not-needed">No Longer Needed</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    placeholder="Please describe the issue or reason for return in detail..."
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Preferred Resolution */}
              <div className="space-y-4">
                <h3 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900">
                  Preferred Resolution
                </h3>

                <div>
                  <label
                    htmlFor="resolution"
                    className="mb-1 block text-sm font-semibold text-neutral-700"
                  >
                    Requested Action *
                  </label>
                  <select
                    id="resolution"
                    name="resolution"
                    required
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select preferred resolution</option>
                    <option value="repair">Repair Product</option>
                    <option value="replacement">Replace Product</option>
                    <option value="credit">Issue Credit</option>
                    <option value="refund">Refund</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="duration-normal w-full rounded-xl bg-accent-500 px-8 py-4 font-bold text-neutral-900 transition-colors hover:bg-accent-600"
                >
                  Submit RMA Request
                </button>
                <p className="mt-3 text-center text-sm text-neutral-600">
                  You will receive an RMA number within 24 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Return Shipping Address */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-2xl font-bold text-neutral-900">Return Shipping Address</h3>
            <p className="text-neutral-600">Ship products with RMA number to:</p>
          </div>
          <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow-lg">
            <p className="font-semibold text-neutral-900">Building Automation Products Inc.</p>
            <p className="text-neutral-600">750 North Royal Avenue</p>
            <p className="text-neutral-600">Gays Mills, WI 54631</p>
            <p className="text-neutral-600">USA</p>
            <p className="mt-4 text-sm text-neutral-500">
              <strong>Important:</strong> Write RMA number on outside of box
            </p>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h3 className="mb-3 text-xl font-bold text-neutral-900">Questions About Returns?</h3>
          <p className="mb-4 text-neutral-600">Contact our customer service team for assistance</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+17158561203"
              className="font-bold text-primary-500 hover:text-primary-600"
            >
              (715) 856-1203
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
