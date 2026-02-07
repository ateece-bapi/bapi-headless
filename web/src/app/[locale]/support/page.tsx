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
import PageContainer from '@/components/layout/PageContainer';
import { generatePageMetadata } from '@/lib/metadata';

/**
 * AI-optimized metadata for support center
 * Enhanced for technical resource discovery
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Technical Support - Expert Help for Building Automation Products',
  description: 'Expert technical support for BAPI building automation products. Access installation docs, troubleshooting guides, RMA requests, and live chat with engineers. Free technical assistance for all BAPI sensors, controllers, and wireless systems.',
  path: 'support',
  keywords: [
    'building automation support',
    'HVAC sensor technical support',
    'BACnet controller help',
    'sensor installation guide',
    'technical documentation',
    'troubleshooting guide',
    'RMA request',
    'warranty support',
    'sensor calibration',
    'installation assistance',
  ],
  type: 'website',
});

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
        <PageContainer size="content">
          <div className="text-center">
            <LifeBuoy className="w-16 h-16 mx-auto mb-4 transition-transform duration-normal hover:scale-110 hover:rotate-12" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              BAPI Support Center
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-primary-50">
              Expert technical support for building automation professionals
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-neutral-50">
        <PageContainer size="content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/contact"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg hover:-translate-y-1 group"
            >
              <MessageSquare className="w-10 h-10 text-primary-500 mb-3 transition-transform duration-normal group-hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Contact Support</h3>
              <p className="text-neutral-600 leading-relaxed">
                Speak with our technical support team
              </p>
            </Link>

            <Link
              href="/application-notes"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg hover:-translate-y-1 group"
            >
              <FileText className="w-10 h-10 text-primary-500 mb-3 transition-transform duration-normal group-hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Application Notes</h3>
              <p className="text-neutral-600 leading-relaxed">
                Technical guides and installation instructions
              </p>
            </Link>

            <Link
              href="/rma-request"
              className="bg-white p-6 rounded-xl border-2 border-neutral-200 hover:border-primary-500 transition-all duration-normal hover:shadow-lg hover:-translate-y-1 group"
            >
              <Package className="w-10 h-10 text-primary-500 mb-3 transition-transform duration-normal group-hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">RMA Request</h3>
              <p className="text-neutral-600 leading-relaxed">
                Return merchandise authorization
              </p>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Support Resources */}
      <section className="py-16">
        <PageContainer size="content">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Support Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Technical Documentation */}
            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <BookOpen className="w-10 h-10 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Technical Documentation
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/application-notes" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Application Notes
                  </Link>
                </li>
                <li>
                  <Link href="/installations" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Installation Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources/datasheets" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Product Datasheets
                  </Link>
                </li>
                <li>
                  <Link href="/sensor-specs" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Sensor Specifications
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools & Utilities */}
            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <Wrench className="w-10 h-10 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Tools & Utilities
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/resources/selector" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Product Selector
                  </Link>
                </li>
                <li>
                  <Link href="/resources/cross-reference" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Cross Reference Tool
                  </Link>
                </li>
                <li>
                  <Link href="/wireless-site-verification" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Wireless Site Verification
                  </Link>
                </li>
                <li>
                  <Link href="/catalogpricebook" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Catalog & Price Book
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service & Returns */}
            <div className="bg-neutral-50 p-6 rounded-xl transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
              <AlertCircle className="w-10 h-10 text-accent-500 mb-4 transition-transform duration-normal hover:scale-110" />
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Service & Returns
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="/rma-request" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    RMA Request Form
                  </Link>
                </li>
                <li>
                  <Link href="/service-bulletin" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Service Bulletins
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary-500 hover:text-primary-600 transition-colors duration-normal">
                    Contact Technical Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-neutral-50">
        <PageContainer size="content">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Need Direct Support?
            </h2>
            <p className="text-lg text-neutral-600">
              Our technical support team is ready to help
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-normal hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <Phone className="w-8 h-8 text-primary-500 mb-3 transition-transform duration-normal group-hover:scale-110" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Phone Support</h3>
                <p className="text-neutral-600 mb-2">Monday - Friday, 8am - 5pm CST</p>
                <a 
                  href="tel:+17158561203" 
                  className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors duration-normal"
                >
                  (715) 856-1203
                </a>
              </div>

              <div className="group">
                <Mail className="w-8 h-8 text-primary-500 mb-3 transition-transform duration-normal group-hover:scale-110" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Email Support</h3>
                <p className="text-neutral-600 mb-2">Technical questions and support</p>
                <a 
                  href="mailto:sales@bapihvac.com" 
                  className="text-lg font-semibold text-primary-500 hover:text-primary-600 transition-colors duration-normal"
                >
                  sales@bapihvac.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
              <Link
                href="/contact"
                className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-8 py-3 rounded-xl transition-all duration-normal hover:scale-105 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
              >
                Contact Support Team
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
