import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Thermometer, Droplets, Gauge, Building2, Factory, Hospital, ShoppingCart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Temperature, Humidity & Pressure Sensors | BAPI',
  description: 'Industry-leading HVAC sensors for building automation. Precise temperature, humidity, and pressure monitoring for commercial, industrial, and institutional applications.',
};

export default function SensorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Precision Sensors for
                <span className="block text-accent-500 mt-2">Building Automation</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-50 mb-8 max-w-2xl">
                Measure what matters. BAPI sensors deliver the accuracy and reliability
                your HVAC systems depend on for optimal comfort and efficiency.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=sensors"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Sensors
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
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">±1%</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Accuracy</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">5-Year</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Warranty</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">30+</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8 group/image">
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
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Sensor Technologies
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Comprehensive sensing solutions for every building automation application
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Thermometer,
                title: 'Temperature Sensors',
                description: 'Precision thermistors and RTDs for accurate temperature monitoring in rooms, ducts, and outdoor environments.',
                features: ['±0.5°F accuracy', '10K Type III thermistors', 'Platinum RTDs', 'Immersion & averaging'],
                link: '/products?category=temperature'
              },
              {
                icon: Droplets,
                title: 'Humidity Sensors',
                description: 'Reliable RH sensing for comfort control, process monitoring, and moisture management.',
                features: ['±2% RH accuracy', 'Long-term stability', 'Drift compensation', 'Condensation resistant'],
                link: '/products?category=humidity'
              },
              {
                icon: Gauge,
                title: 'Pressure Sensors',
                description: 'Differential and static pressure transducers for air flow measurement and filter monitoring.',
                features: ['±1% FS accuracy', 'Low & high ranges', 'Barometric options', 'Bidirectional'],
                link: '/products?category=pressure'
              }
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl p-8 transition-all duration-500 hover:-translate-y-2"
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

      {/* Applications */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Industry Applications
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Trusted by facilities worldwide for mission-critical monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: 'Commercial Buildings',
                description: 'Office towers, retail, hospitality'
              },
              {
                icon: Hospital,
                title: 'Healthcare',
                description: 'Hospitals, labs, clean rooms'
              },
              {
                icon: Factory,
                title: 'Industrial',
                description: 'Manufacturing, warehouses, process'
              },
              {
                icon: ShoppingCart,
                title: 'Retail & Food Service',
                description: 'Grocery, restaurants, convenience'
              }
            ].map((app, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-neutral-50 to-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{app.title}</h3>
                <p className="text-sm text-neutral-600">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose BAPI Sensors?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Industry-Leading Accuracy',
                description: 'Precision calibration and quality components ensure reliable measurements'
              },
              {
                title: '5-Year Warranty',
                description: 'Comprehensive coverage on all sensors demonstrates our confidence in quality'
              },
              {
                title: 'Made in USA',
                description: 'Designed and manufactured in North Dakota for superior quality control'
              },
              {
                title: 'BACnet & Modbus',
                description: 'Direct protocol support plus analog outputs for universal compatibility'
              },
              {
                title: 'NSF Certified Options',
                description: 'Food-safe sensors certified for commercial food service applications'
              },
              {
                title: '40+ Years Experience',
                description: 'Decades of innovation in building automation sensing technology'
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Upgrade Your Building Automation?
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Explore our complete line of sensors or contact our team for expert guidance
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products?category=sensors"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Browse All Sensors
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
