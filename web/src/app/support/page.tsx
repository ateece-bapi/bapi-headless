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
  Phone,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'Support | BAPI',
  description:
    'Get expert technical support for BAPI building automation products. Access resources, contact our team, and find solutions.',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 py-16 text-white">
        <PageContainer size="content">
          <div className="text-center">
            <LifeBuoy className="duration-normal mx-auto mb-4 h-16 w-16 transition-transform hover:rotate-12 hover:scale-110" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">BAPI Support Center</h1>
            <p className="mx-auto max-w-3xl text-xl text-primary-50">
              Expert technical support for building automation professionals
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Quick Actions */}
      <section className="bg-neutral-50 py-12">
        <PageContainer size="content">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/contact"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <MessageSquare className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">Contact Support</h3>
              <p className="leading-relaxed text-neutral-600">
                Speak with our technical support team
              </p>
            </Link>

            <Link
              href="/application-notes"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <FileText className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">Application Notes</h3>
              <p className="leading-relaxed text-neutral-600">
                Technical guides and installation instructions
              </p>
            </Link>

            <Link
              href="/rma-request"
              className="duration-normal group rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <Package className="duration-normal mb-3 h-10 w-10 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">RMA Request</h3>
              <p className="leading-relaxed text-neutral-600">Return merchandise authorization</p>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Support Resources */}
      <section className="py-16">
        <PageContainer size="content">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            Support Resources
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Technical Documentation */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <BookOpen className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Technical Documentation</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/application-notes"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Application Notes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/installations"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Installation Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/datasheets"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Product Datasheets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sensor-specs"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Sensor Specifications
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools & Utilities */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <Wrench className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Tools & Utilities</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/resources/selector"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Product Selector
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/cross-reference"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Cross Reference Tool
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wireless-site-verification"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Wireless Site Verification
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogpricebook"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Catalog & Price Book
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service & Returns */}
            <div className="duration-normal rounded-xl bg-neutral-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <AlertCircle className="duration-normal mb-4 h-10 w-10 text-accent-500 transition-transform hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold text-neutral-900">Service & Returns</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link
                    href="/rma-request"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    RMA Request Form
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service-bulletin"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Service Bulletins
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="duration-normal text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Contact Technical Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Contact Section */}
      <section className="bg-neutral-50 py-16">
        <PageContainer size="content">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900">Need Direct Support?</h2>
            <p className="text-lg text-neutral-600">Our technical support team is ready to help</p>
          </div>

          <div className="duration-normal rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="group">
                <Phone className="duration-normal mb-3 h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-bold text-neutral-900">Phone Support</h3>
                <p className="mb-2 text-neutral-600">Monday - Friday, 8am - 5pm CST</p>
                <a
                  href="tel:+17158561203"
                  className="duration-normal text-2xl font-bold text-primary-500 transition-colors hover:text-primary-600"
                >
                  (715) 856-1203
                </a>
              </div>

              <div className="group">
                <Mail className="duration-normal mb-3 h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-bold text-neutral-900">Email Support</h3>
                <p className="mb-2 text-neutral-600">Technical questions and support</p>
                <a
                  href="mailto:sales@bapihvac.com"
                  className="duration-normal text-lg font-semibold text-primary-500 transition-colors hover:text-primary-600"
                >
                  sales@bapihvac.com
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-8 text-center">
              <Link
                href="/contact"
                className="duration-normal inline-block rounded-xl bg-accent-500 px-8 py-3 font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-accent-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-500/50"
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
