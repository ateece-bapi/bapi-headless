import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  Radio,
  Wifi,
  Bell,
  BarChart3,
  Battery,
  Shield,
  ChevronRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Wireless Sensors & Monitoring Solutions | BAPI WAM',
  description:
    'Wireless Asset Monitoring (WAM) for temperature, humidity, and door monitoring. Battery-powered sensors with cloud dashboards for remote facility management.',
};

export default function WirelessPage() {
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
            <span className="font-medium text-white">Wireless Asset Monitoring</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <Radio className="h-4 w-4" />
                <span>Wireless Asset Monitoring</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Monitor Anywhere,
                <span className="mt-2 block text-accent-500">Without Wiring</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                BAPI WAM™ wireless sensors provide real-time temperature and humidity monitoring
                with instant alerts—no wiring required.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/wam"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Explore WAM Solutions
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-12">
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      5 min
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Setup Time
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
                      Battery Life
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      24/7
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Cloud Access
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/wam/dashboards/WAM_Graphic.webp"
                  alt="WAM wireless monitoring dashboard"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAM Product Categories */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Wireless Product Line
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Complete wireless monitoring solutions for every application
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Radio,
                title: 'WAM Temperature Sensors',
                description:
                  'Wireless temperature monitoring for coolers, freezers, rooms, and outdoor environments.',
                features: ['±0.5°F accuracy', '900 MHz LoRa', '5-year battery', 'IP67 rated'],
                link: '/products?category=wireless-temperature',
              },
              {
                icon: Wifi,
                title: 'WAM Humidity Sensors',
                description:
                  'Combined temperature and humidity monitoring for climate-critical applications.',
                features: ['±2% RH accuracy', 'Condensation safe', 'LCD display', 'Remote alerts'],
                link: '/products?category=wireless-humidity',
              },
              {
                icon: Bell,
                title: 'WAM Door Sensors',
                description:
                  'Magnetic door switches for open/close monitoring and alert notification.',
                features: ['Instant alerts', 'Low power', 'Easy mount', 'Cloud logging'],
                link: '/products?category=wireless-door',
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

      {/* Cloud Platform Features */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Powerful Cloud Platform
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Monitor, analyze, and manage all your sensors from anywhere
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: 'Real-Time Dashboards',
                description:
                  'View live temperature data from all sensors on customizable dashboards',
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                description:
                  'Get email, SMS, or push notifications when temperatures go out of range',
              },
              {
                icon: Shield,
                title: 'Compliance Reporting',
                description: 'Automated reports for HACCP, FDA, and food safety compliance',
              },
              {
                icon: Battery,
                title: 'Battery Monitoring',
                description: 'Track battery levels and receive low-battery alerts before failure',
              },
              {
                icon: Wifi,
                title: 'Multi-Site Management',
                description: 'Manage sensors across multiple locations from a single account',
              },
              {
                icon: BarChart3,
                title: 'Historical Trends',
                description: 'Analyze temperature patterns over days, weeks, or months',
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

      {/* Installation Gallery Preview */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Real-World Installations
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              See WAM wireless sensors protecting assets in convenience stores, restaurants, and
              food service operations
            </p>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                src: '/images/applications/retail/coolers/Cooler_Front_4.webp',
                alt: 'Walk-in cooler monitoring',
                title: 'Walk-In Coolers',
              },
              {
                src: '/images/applications/retail/freezers/Freezer_Door_1.webp',
                alt: 'Freezer temperature sensor',
                title: 'Walk-In Freezers',
              },
              {
                src: '/images/applications/retail/deli-cases/Deli_Cases_All_1.webp',
                alt: 'Deli case monitoring',
                title: 'Deli Cases',
              },
              {
                src: '/images/applications/retail/convenience/Mini-Mart_Overhead_4.webp',
                alt: 'Convenience store sensors',
                title: 'Convenience Stores',
              },
            ].map((image, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-neutral-900">{image.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/wam#installations"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-xl"
            >
              View All Installation Examples
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Ready to Go Wireless?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Explore our complete WAM wireless monitoring solution or request a demo
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/wam"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-2xl"
            >
              Explore WAM Solutions
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
