import { Metadata } from 'next';
import { Package, FileText, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RMA Request | BAPI',
  description: 'Request a Return Merchandise Authorization (RMA) for BAPI products. Fast processing and support for returns and repairs.',
};

export default function RMARequestPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              RMA Request
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Return Merchandise Authorization for BAPI products
            </p>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            RMA Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Submit Request</h3>
              <p className="text-sm text-neutral-600">Fill out the RMA form below</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Receive RMA Number</h3>
              <p className="text-sm text-neutral-600">We&apos;ll email your RMA within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Ship Product</h3>
              <p className="text-sm text-neutral-600">Return product with RMA number</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                4
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Resolution</h3>
              <p className="text-sm text-neutral-600">Repair, replace, or credit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Important Information
            </h3>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li>• All returns must have an RMA number before shipping</li>
              <li>• Products must be returned within 30 days of receiving RMA authorization</li>
              <li>• Include a copy of the original invoice with returned products</li>
              <li>• Customer is responsible for return shipping costs unless product is defective</li>
              <li>• Write RMA number clearly on outside of shipping box</li>
            </ul>
          </div>
        </div>
      </section>

      {/* RMA Form */}
      <section className="py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              RMA Request Form
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
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

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  Product Information
                </h3>
                
                <div>
                  <label htmlFor="productModel" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Product Model Number *
                  </label>
                  <input
                    type="text"
                    id="productModel"
                    name="productModel"
                    required
                    placeholder="e.g., BA/10K-2-O"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="serialNumber" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Serial Number (if available)
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="purchaseDate" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="invoiceNumber" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Invoice/PO Number
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Quantity Being Returned *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Return Reason */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  Return Reason
                </h3>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Reason for Return *
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    placeholder="Please describe the issue or reason for return in detail..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Preferred Resolution */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                  Preferred Resolution
                </h3>
                
                <div>
                  <label htmlFor="resolution" className="block text-sm font-semibold text-neutral-700 mb-1">
                    Requested Action *
                  </label>
                  <select
                    id="resolution"
                    name="resolution"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  className="w-full bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-colors duration-normal"
                >
                  Submit RMA Request
                </button>
                <p className="text-sm text-neutral-600 mt-3 text-center">
                  You will receive an RMA number within 24 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Return Shipping Address */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Return Shipping Address
            </h3>
            <p className="text-neutral-600">
              Ship products with RMA number to:
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto text-center">
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
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            Questions About Returns?
          </h3>
          <p className="text-neutral-600 mb-4">
            Contact our customer service team for assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+17158561203" 
              className="text-primary-500 hover:text-primary-600 font-bold"
            >
              (715) 856-1203
            </a>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <a 
              href="mailto:sales@bapihvac.com" 
              className="text-primary-500 hover:text-primary-600 font-bold"
            >
              sales@bapihvac.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
