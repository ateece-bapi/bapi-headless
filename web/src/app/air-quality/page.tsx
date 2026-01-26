import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Wind, Leaf, Heart, Building, Users, TrendingUp, ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Air Quality Sensors - CO₂, VOC & IAQ | BAPI',
  description: 'Indoor air quality sensors for CO₂, VOC, and IAQ monitoring. Improve occupant health, meet ventilation standards, and optimize HVAC efficiency.',
};

export default function AirQualityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Air Quality Sensors</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur px-4 py-2 rounded-full text-accent-500 font-semibold mb-6">
                <Wind className="w-4 h-4" />
                <span>Indoor Air Quality</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Breathe Better with
                <span className="block text-accent-500 mt-2">Smart Ventilation</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-50 mb-8 max-w-2xl">
                BAPI air quality sensors monitor CO₂, VOCs, and IAQ to optimize ventilation,
                improve occupant health, and reduce energy costs.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=air-quality"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Air Quality Sensors
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Quote
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">±50 ppm</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">CO₂ Accuracy</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">ASHRAE</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Compliant</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">30%</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Energy Savings</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8 group/image">
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
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Air Quality Monitoring Solutions
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Comprehensive sensing for healthier, more efficient buildings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wind,
                title: 'CO₂ Sensors',
                description: 'Carbon dioxide monitoring for demand-controlled ventilation and occupancy-based HVAC.',
                features: ['±50 ppm accuracy', 'NDIR technology', 'Auto-calibration', '0-2000 ppm range'],
                link: '/products?category=co2-sensors'
              },
              {
                icon: Leaf,
                title: 'VOC Sensors',
                description: 'Volatile Organic Compound detection for air quality and contamination monitoring.',
                features: ['ppb sensitivity', 'Wide chemical range', 'Fast response', 'Long lifespan'],
                link: '/products?category=voc-sensors'
              },
              {
                icon: Heart,
                title: 'IAQ Sensors',
                description: 'Combined indoor air quality sensors measuring multiple parameters simultaneously.',
                features: ['Multi-gas detection', 'Composite index', 'BACnet/Modbus', 'LCD display options'],
                link: '/products?category=iaq-sensors'
              }
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl p-8 transition-all duration-500 hover:-translate-y-2 relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <sensor.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{sensor.title}</h3>
                <p className="text-neutral-600 mb-6">{sensor.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {sensor.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs mt-0.5">✓</span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={sensor.link}
                  className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold group-hover:gap-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
                >
                  View Products
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Monitor Indoor Air Quality?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Occupant Health & Productivity',
                description: 'Better air quality improves cognitive performance and reduces sick building syndrome'
              },
              {
                icon: TrendingUp,
                title: 'Energy Savings',
                description: 'Demand-controlled ventilation reduces over-ventilation and HVAC costs by 20-30%'
              },
              {
                icon: Building,
                title: 'Code Compliance',
                description: 'Meet ASHRAE 62.1, LEED, and WELL Building Standard requirements'
              },
              {
                icon: Wind,
                title: 'Optimized Ventilation',
                description: 'Adjust fresh air based on actual occupancy and contamination levels'
              },
              {
                icon: Heart,
                title: 'Post-Pandemic Confidence',
                description: 'Demonstrate commitment to indoor air quality for occupants and visitors'
              },
              {
                icon: Leaf,
                title: 'Sustainability',
                description: 'Reduce carbon footprint while maintaining healthy indoor environments'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Critical Applications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Commercial Offices',
                description: 'Conference rooms, open offices, cubicles'
              },
              {
                title: 'Educational Facilities',
                description: 'Classrooms, lecture halls, gymnasiums'
              },
              {
                title: 'Healthcare',
                description: 'Patient rooms, waiting areas, labs'
              },
              {
                title: 'Hospitality',
                description: 'Hotel rooms, ballrooms, restaurants'
              },
              {
                title: 'Retail',
                description: 'Shopping centers, stores, showrooms'
              },
              {
                title: 'Residential',
                description: 'Apartments, condos, multi-family'
              },
              {
                title: 'Parking Garages',
                description: 'Underground and enclosed parking'
              },
              {
                title: 'Industrial',
                description: 'Manufacturing, warehouses, facilities'
              }
            ].map((app, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{app.title}</h3>
                <p className="text-sm text-neutral-600">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Improve Your Indoor Air Quality
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Explore our air quality sensors or contact our team for application guidance
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products?category=air-quality"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
            >
              Browse Air Quality Sensors
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
