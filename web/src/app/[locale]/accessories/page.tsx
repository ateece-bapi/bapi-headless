import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  Box,
  Cable,
  Wrench,
  Shield,
  Layers,
  Package,
  ChevronRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'HVAC Sensor Accessories & Mounting Hardware | BAPI',
  description:
    'Mounting kits, enclosures, cables, and accessories for BAPI sensors. Complete your installation with professional-grade components.',
};

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br relative overflow-hidden from-primary-700 via-primary-600 to-primary-500 py-20 text-white lg:py-32">
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
            <span className="font-medium text-white">Accessories</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <Package className="h-4 w-4" />
                <span>Installation Accessories</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Complete Your
                <span className="mt-2 block text-accent-500">Professional Installation</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                BAPI accessories and mounting hardware ensure clean, reliable sensor installations
                that last for decades.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=accessories"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Accessories
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
                      100+
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">SKUs</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      Same Day
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Shipping
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      Universal
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Compatibility
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-square overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                <Image
                  src="/images/products/families/Accessories_Family_2025_US.webp"
                  alt="BAPI accessories family"
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

      {/* Accessory Categories */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Accessory Categories
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Everything you need for professional sensor installations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Box,
                title: 'Mounting Kits',
                description:
                  'Universal and application-specific mounting hardware for clean, professional installations.',
                features: ['Wall mounting', 'Duct mounting', 'Pipe mounting', 'Universal kits'],
                link: '/products?category=mounting-kits',
              },
              {
                icon: Shield,
                title: 'Enclosures & Shields',
                description:
                  'Protective housings, weather shields, and NEMA-rated enclosures for harsh environments.',
                features: ['NEMA 4X rated', 'Weather shields', 'Tamper guards', 'Custom options'],
                link: '/products?category=enclosures',
              },
              {
                icon: Cable,
                title: 'Cables & Wiring',
                description:
                  'Pre-made sensor cables, extension cables, and wiring accessories for reliable connections.',
                features: ['Custom lengths', 'Shielded cable', 'Quick connects', 'Plenum rated'],
                link: '/products?category=cables',
              },
            ].map((category, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="bg-linear-to-br mb-6 flex h-16 w-16 items-center justify-center rounded-xl from-primary-500 to-primary-700 transition-transform duration-500 group-hover:scale-110">
                  <category.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-neutral-900">{category.title}</h3>
                <p className="mb-6 text-neutral-600">{category.description}</p>

                <ul className="mb-8 space-y-3">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                        ✓
                      </span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={category.link}
                  className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-primary-500 transition-all duration-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group-hover:gap-4"
                >
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="bg-linear-to-r absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform rounded-t-xl from-primary-400 via-primary-600 to-primary-400 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Accessories */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Additional Products
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Wrench,
                title: 'Installation Tools',
                description: 'Specialized tools for sensor installation and commissioning',
              },
              {
                icon: Layers,
                title: 'Averaging Elements',
                description: 'Duct averaging sensors for large duct applications',
              },
              {
                icon: Shield,
                title: 'Replacement Parts',
                description: 'Sensor elements, covers, and component replacements',
              },
              {
                icon: Package,
                title: 'Custom Solutions',
                description: 'Application-specific accessories and custom assemblies',
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-linear-to-br rounded-xl border border-neutral-200 from-neutral-50 to-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
                  <product.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">{product.title}</h3>
                <p className="text-sm text-neutral-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-linear-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why BAPI Accessories?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Engineered Together',
                description:
                  'Accessories designed specifically for BAPI sensors ensure perfect fit and compatibility',
              },
              {
                title: 'Professional Appearance',
                description: 'Clean, finished installations that reflect the quality of your work',
              },
              {
                title: 'Durability',
                description:
                  'High-quality materials and construction for installations that last decades',
              },
              {
                title: 'Code Compliance',
                description: 'UL-listed and NEMA-rated options meet building code requirements',
              },
              {
                title: 'Installation Speed',
                description: 'Pre-engineered solutions save time on every installation',
              },
              {
                title: 'Complete System',
                description: 'One-stop shopping for all sensor and accessory needs',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-500" />
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Complete Your Installation</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Explore our full line of accessories or contact us for custom solutions
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products?category=accessories"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-2xl"
            >
              Browse All Accessories
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
