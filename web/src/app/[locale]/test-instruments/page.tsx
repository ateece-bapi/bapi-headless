import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  Wrench,
  Smartphone,
  Zap,
  CheckCircle,
  Search,
  Shield,
  ChevronRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Blu-Test™ HVAC Diagnostic Tools | BAPI',
  description:
    'Professional Bluetooth test instruments for HVAC technicians. Verify sensor accuracy, diagnose issues, and commission systems with the Blu-Test app.',
};

export default function TestInstrumentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 py-20 text-white lg:py-32">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-white">Test Instruments</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <Smartphone className="h-4 w-4" />
                <span>Bluetooth Test Equipment</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Professional Tools for
                <span className="mt-2 block text-accent-500">HVAC Diagnostics</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                Blu-Test™ instruments connect to your smartphone for fast, accurate sensor
                verification and system commissioning.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=test-instruments"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Blu-Test Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Quote
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-12">
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      ±0.3°F
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Accuracy
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      NIST
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Traceable
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      iOS/Android
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">App</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-[16/10] overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                <Image
                  src="/images/products/families/Blu-Test_Family_2025_US.webp"
                  alt="Blu-Test HVAC diagnostic tools family"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain transition-transform duration-700 group-hover/image:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blu-Test Product Categories */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Blu-Test Product Line
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Professional-grade test instruments for every diagnostic need
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: 'Blu-Test Temperature',
                description:
                  'Precision temperature reference with ±0.3°F accuracy for sensor verification and calibration.',
                features: ['NIST traceable', 'Bluetooth app', 'Data logging', 'Long battery life'],
                link: '/products?category=blu-test-temp',
              },
              {
                icon: Smartphone,
                title: 'Blu-Test Humidity',
                description:
                  'Combined temperature and humidity reference for comprehensive sensor testing.',
                features: [
                  '±1.5% RH accuracy',
                  'Dew point calc',
                  'Trending graphs',
                  'Export reports',
                ],
                link: '/products?category=blu-test-humidity',
              },
              {
                icon: Zap,
                title: 'Blu-Test Pressure',
                description:
                  'Digital manometer for differential pressure measurement and airflow diagnostics.',
                features: ['±1% accuracy', 'Auto-zero', 'Min/max/avg', 'Multiple units'],
                link: '/products?category=blu-test-pressure',
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-500 group-hover:scale-110">
                  <product.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-neutral-900">{product.title}</h3>
                <p className="mb-6 text-neutral-600">{product.description}</p>

                <ul className="mb-8 space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                        ✓
                      </span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={product.link}
                  className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-primary-500 transition-all duration-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group-hover:gap-4"
                >
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform rounded-t-xl bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Powerful Mobile App
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Free iOS and Android app for real-time readings and reporting
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: 'Real-Time Display',
                description: 'See live sensor readings with large, easy-to-read numbers',
              },
              {
                icon: CheckCircle,
                title: 'Data Logging',
                description: 'Record measurements over time for trend analysis',
              },
              {
                icon: Search,
                title: 'Min/Max/Average',
                description: 'Track statistical data during testing sessions',
              },
              {
                icon: Shield,
                title: 'Calibration Certificates',
                description: 'Generate and export NIST-traceable documentation',
              },
              {
                icon: Zap,
                title: 'Quick Compare',
                description: 'Compare Blu-Test readings to installed sensors instantly',
              },
              {
                icon: Smartphone,
                title: 'Share Reports',
                description: 'Email PDF reports directly from the app',
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Professional Applications
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: 'Sensor Verification',
                description:
                  'Quickly verify installed sensor accuracy against NIST-traceable reference',
                benefits: ['Save diagnostic time', 'Prove sensor performance', 'Document results'],
              },
              {
                title: 'System Commissioning',
                description: 'Commission new HVAC systems with professional documentation',
                benefits: ['Generate reports', 'Track all zones', 'Meet code requirements'],
              },
              {
                title: 'Troubleshooting',
                description: 'Isolate sensor issues vs. controller or HVAC problems',
                benefits: ['Faster diagnosis', 'Reduce callbacks', 'Improve confidence'],
              },
              {
                title: 'Preventive Maintenance',
                description: 'Regular sensor checks prevent drift and maintain system efficiency',
                benefits: ['Catch drift early', 'Maintain accuracy', 'Prevent comfort issues'],
              },
            ].map((useCase, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200 bg-white p-8 shadow-md transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
              >
                <h3 className="mb-4 text-2xl font-bold text-neutral-900">{useCase.title}</h3>
                <p className="mb-6 text-neutral-600">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="mt-1 text-accent-500">★</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Upgrade Your Test Equipment</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Professional-grade diagnostics for HVAC technicians and building engineers
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products?category=test-instruments"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-2xl"
            >
              Browse Blu-Test Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
