import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  Wind,
  Leaf,
  Heart,
  Building,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Air Quality Sensors - CO₂, VOC & IAQ | BAPI',
  description:
    'Indoor air quality sensors for CO₂, VOC, and IAQ monitoring. Improve occupant health, meet ventilation standards, and optimize HVAC efficiency.',
};

export default function AirQualityPage() {
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
            <span className="font-medium text-white">Air Quality Sensors</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 font-semibold text-accent-500 backdrop-blur">
                <Wind className="h-4 w-4" />
                <span>Indoor Air Quality</span>
              </div>

              <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
                Breathe Better with
                <span className="mt-2 block text-accent-500">Smart Ventilation</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-primary-50 lg:text-2xl">
                BAPI air quality sensors monitor CO₂, VOCs, and IAQ to optimize ventilation, improve
                occupant health, and reduce energy costs.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=air-quality"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Air Quality Sensors
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
                      ±50 ppm
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      CO₂ Accuracy
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      ASHRAE
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Compliant
                    </div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-500/20 bg-accent-500/10 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="relative p-4 text-center">
                    <div className="mb-2 text-3xl font-bold text-accent-500 transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                      30%
                    </div>
                    <div className="text-sm font-medium text-primary-100 lg:text-base">
                      Energy Savings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group/image relative aspect-square overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                <Image
                  src="/images/products/families/AirQuality_Family_2025_US.webp"
                  alt="BAPI air quality sensors family"
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

      {/* Air Quality Sensor Types */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Air Quality Monitoring Solutions
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-neutral-600">
              Comprehensive sensing for healthier, more efficient buildings
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wind,
                title: 'CO₂ Sensors',
                description:
                  'Carbon dioxide monitoring for demand-controlled ventilation and occupancy-based HVAC.',
                features: [
                  '±50 ppm accuracy',
                  'NDIR technology',
                  'Auto-calibration',
                  '0-2000 ppm range',
                ],
                link: '/products?category=co2-sensors',
              },
              {
                icon: Leaf,
                title: 'VOC Sensors',
                description:
                  'Volatile Organic Compound detection for air quality and contamination monitoring.',
                features: [
                  'ppb sensitivity',
                  'Wide chemical range',
                  'Fast response',
                  'Long lifespan',
                ],
                link: '/products?category=voc-sensors',
              },
              {
                icon: Heart,
                title: 'IAQ Sensors',
                description:
                  'Combined indoor air quality sensors measuring multiple parameters simultaneously.',
                features: [
                  'Multi-gas detection',
                  'Composite index',
                  'BACnet/Modbus',
                  'LCD display options',
                ],
                link: '/products?category=iaq-sensors',
              },
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-500 group-hover:scale-110">
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

                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transform rounded-t-xl bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Why Monitor Indoor Air Quality?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Occupant Health & Productivity',
                description:
                  'Better air quality improves cognitive performance and reduces sick building syndrome',
              },
              {
                icon: TrendingUp,
                title: 'Energy Savings',
                description:
                  'Demand-controlled ventilation reduces over-ventilation and HVAC costs by 20-30%',
              },
              {
                icon: Building,
                title: 'Code Compliance',
                description: 'Meet ASHRAE 62.1, LEED, and WELL Building Standard requirements',
              },
              {
                icon: Wind,
                title: 'Optimized Ventilation',
                description: 'Adjust fresh air based on actual occupancy and contamination levels',
              },
              {
                icon: Heart,
                title: 'Post-Pandemic Confidence',
                description:
                  'Demonstrate commitment to indoor air quality for occupants and visitors',
              },
              {
                icon: Leaf,
                title: 'Sustainability',
                description:
                  'Reduce carbon footprint while maintaining healthy indoor environments',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="bg-gradient-to-br from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
              Critical Applications
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Commercial Offices',
                description: 'Conference rooms, open offices, cubicles',
              },
              {
                title: 'Educational Facilities',
                description: 'Classrooms, lecture halls, gymnasiums',
              },
              {
                title: 'Healthcare',
                description: 'Patient rooms, waiting areas, labs',
              },
              {
                title: 'Hospitality',
                description: 'Hotel rooms, ballrooms, restaurants',
              },
              {
                title: 'Retail',
                description: 'Shopping centers, stores, showrooms',
              },
              {
                title: 'Residential',
                description: 'Apartments, condos, multi-family',
              },
              {
                title: 'Parking Garages',
                description: 'Underground and enclosed parking',
              },
              {
                title: 'Industrial',
                description: 'Manufacturing, warehouses, facilities',
              },
            ].map((app, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
              >
                <h3 className="mb-2 text-lg font-bold text-neutral-900">{app.title}</h3>
                <p className="text-sm text-neutral-600">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Improve Your Indoor Air Quality</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-50">
            Explore our air quality sensors or contact our team for application guidance
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products?category=air-quality"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 transition-all duration-300 hover:bg-accent-600 hover:shadow-2xl"
            >
              Browse Air Quality Sensors
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
