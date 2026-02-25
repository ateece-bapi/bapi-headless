import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  Thermometer,
  Droplets,
  Gauge,
  Building2,
  Factory,
  Hospital,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Temperature, Humidity & Pressure Sensors | BAPI',
  description:
    'Industry-leading HVAC sensors for building automation. Precise temperature, humidity, and pressure monitoring for commercial, industrial, and institutional applications.',
};

export default function SensorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-700 via-primary-500 to-primary-700 py-20 text-white lg:py-32">
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
            <span className="font-medium text-white">Sensors</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Precision Sensors for
                <span className="mt-2 block text-accent-500">Building Automation</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                Measure what matters. BAPI sensors deliver the accuracy and reliability your HVAC
                systems depend on for optimal comfort and efficiency.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=sensors"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Sensors
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
                      ±1%
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
                      5-Year
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Warranty
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      30+
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">Years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-[16/10] overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                <Image
                  src="/images/products/families/BAPI_Full_Family_withWireless_11Kpix_2025_US.webp"
                  alt="BAPI complete sensor family with wireless monitoring"
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

      {/* Sensor Types */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Sensor Technologies
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Comprehensive sensing solutions for every building automation application
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Thermometer,
                title: 'Temperature Sensors',
                description:
                  'Precision thermistors and RTDs for accurate temperature monitoring in rooms, ducts, and outdoor environments.',
                features: [
                  '±0.5°F accuracy',
                  '10K Type III thermistors',
                  'Platinum RTDs',
                  'Immersion & averaging',
                ],
                link: '/products?category=temperature',
              },
              {
                icon: Droplets,
                title: 'Humidity Sensors',
                description:
                  'Reliable RH sensing for comfort control, process monitoring, and moisture management.',
                features: [
                  '±2% RH accuracy',
                  'Long-term stability',
                  'Drift compensation',
                  'Condensation resistant',
                ],
                link: '/products?category=humidity',
              },
              {
                icon: Gauge,
                title: 'Pressure Sensors',
                description:
                  'Differential and static pressure transducers for air flow measurement and filter monitoring.',
                features: [
                  '±1% FS accuracy',
                  'Low & high ranges',
                  'Barometric options',
                  'Bidirectional',
                ],
                link: '/products?category=pressure',
              },
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="group rounded-xl bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 transition-transform duration-500 group-hover:scale-110">
                  <sensor.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-neutral-900">{sensor.title}</h3>
                <p className="mb-6 text-neutral-600">{sensor.description}</p>

                <ul className="mb-8 space-y-3">
                  {sensor.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                        ✓
                      </span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={sensor.link}
                  className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-primary-500 transition-all duration-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group-hover:gap-4"
                >
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform rounded-t-xl bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Industry Applications
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Trusted by facilities worldwide for mission-critical monitoring
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: 'Commercial Buildings',
                description: 'Office towers, retail, hospitality',
              },
              {
                icon: Hospital,
                title: 'Healthcare',
                description: 'Hospitals, labs, clean rooms',
              },
              {
                icon: Factory,
                title: 'Industrial',
                description: 'Manufacturing, warehouses, process',
              },
              {
                icon: ShoppingCart,
                title: 'Retail & Food Service',
                description: 'Grocery, restaurants, convenience',
              },
            ].map((app, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-neutral-200 bg-linear-to-br from-neutral-50 to-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500 transition-transform duration-300 group-hover:scale-110">
                  <app.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">{app.title}</h3>
                <p className="text-sm text-neutral-600">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-linear-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why Choose BAPI Sensors?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Industry-Leading Accuracy',
                description:
                  'Precision calibration and quality components ensure reliable measurements',
              },
              {
                title: '5-Year Warranty',
                description:
                  'Comprehensive coverage on all sensors demonstrates our confidence in quality',
              },
              {
                title: 'Made in USA',
                description:
                  'Designed and manufactured in North Dakota for superior quality control',
              },
              {
                title: 'BACnet & Modbus',
                description:
                  'Direct protocol support plus analog outputs for universal compatibility',
              },
              {
                title: 'NSF Certified Options',
                description: 'Food-safe sensors certified for commercial food service applications',
              },
              {
                title: '40+ Years Experience',
                description: 'Decades of innovation in building automation sensing technology',
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-primary-700 via-primary-500 to-primary-700 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
            Ready to Upgrade Your Building Automation?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Explore our complete line of sensors or contact our team for expert guidance
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products?category=sensors"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Browse All Sensors
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
