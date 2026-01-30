import { Metadata } from 'next';
import Link from 'next/link';
import { 
  LifeBuoy, 
  FileText, 
  Wrench, 
  MessageSquare, 
  BookOpen, 
  AlertCircle,
  Package,
  Mail,
  Phone
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support | BAPI',
  description: 'Get expert technical support for BAPI building automation products. Access resources, contact our team, and find solutions.',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LifeBuoy className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              BAPI Support Center
            </h1>
            <p className="text-xl max-w-content mx-auto text-primary-50">
              Expert technical support for building automation professionals
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/contact"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg"
            >
              <MessageSquare className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Contact Support</h3>
              <p className="text-neutral-600">
                Speak with our technical support team
              </p>
            </Link>

            <Link
              href="/application-notes"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg"
            >
              <FileText className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Application Notes</h3>
              <p className="text-neutral-600">
                Technical guides and installation instructions
              </p>
            </Link>

            <Link
              href="/rma-request"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg"
            >
              <Package className="w-10 h-10 text-primary-500 mb-3" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">RMA Request</h3>
              <p className="text-neutral-600">
                Return merchandise authorization
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Support Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Technical Documentation */}
            <div className="bg-neutral-50 p-6 rounded-xl">
              <BookOpen className="w-10 h-10 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Technical Documentation
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/application-notes" className="text-primary-500 hover:text-primary-600">
                    Application Notes
                  </Link>
                </li>
                <li>
                  <Link href="/installations" className="text-primary-500 hover:text-primary-600">
                    Installation Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources/datasheets" className="text-primary-500 hover:text-primary-600">
                    Product Datasheets
                  </Link>
                </li>
                <li>
                  <Link href="/sensor-specs" className="text-primary-500 hover:text-primary-600">
                    Sensor Specifications
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools & Utilities */}
            <div className="bg-neutral-50 p-6 rounded-xl">
              <Wrench className="w-10 h-10 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Tools & Utilities
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/resources/selector" className="text-primary-500 hover:text-primary-600">
                    Product Selector
                  </Link>
                </li>
                <li>
                  <Link href="/resources/cross-reference" className="text-primary-500 hover:text-primary-600">
                    Cross Reference Tool
                  </Link>
                </li>
                <li>
                  <Link href="/wireless-site-verification" className="text-primary-500 hover:text-primary-600">
                    Wireless Site Verification
                  </Link>
                </li>
                <li>
                  <Link href="/catalogpricebook" className="text-primary-500 hover:text-primary-600">
                    Catalog & Price Book
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service & Returns */}
            <div className="bg-neutral-50 p-6 rounded-xl">
              <AlertCircle className="w-10 h-10 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Service & Returns
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/rma-request" className="text-primary-500 hover:text-primary-600">
                    RMA Request Form
                  </Link>
                </li>
                <li>
                  <Link href="/service-bulletin" className="text-primary-500 hover:text-primary-600">
                    Service Bulletins
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary-500 hover:text-primary-600">
                    Contact Technical Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Need Direct Support?
            </h2>
            <p className="text-lg text-neutral-600">
              Our technical support team is ready to help
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Phone className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Phone Support</h3>
                <p className="text-neutral-600 mb-2">Monday - Friday, 8am - 5pm CST</p>
                <a 
                  href="tel:+17158561203" 
                  className="text-2xl font-bold text-primary-500 hover:text-primary-600"
                >
                  (715) 856-1203
                </a>
              </div>

              <div>
                <Mail className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Email Support</h3>
                <p className="text-neutral-600 mb-2">Technical questions and support</p>
                <a 
                  href="mailto:sales@bapihvac.com" 
                  className="text-lg font-semibold text-primary-500 hover:text-primary-600"
                >
                  sales@bapihvac.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
              <Link
                href="/contact"
                className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-colors duration-normal"
              >
                Contact Support Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
