import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Wrench, Smartphone, Zap, CheckCircle, Search, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blu-Test™ HVAC Diagnostic Tools | BAPI',
  description: 'Professional Bluetooth test instruments for HVAC technicians. Verify sensor accuracy, diagnose issues, and commission systems with the Blu-Test app.',
};

export default function TestInstrumentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur px-4 py-2 rounded-full text-accent-500 font-semibold mb-6">
                <Smartphone className="w-4 h-4" />
                <span>Bluetooth Test Equipment</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Professional Tools for
                <span className="block text-accent-500 mt-2">HVAC Diagnostics</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-50 mb-8 max-w-2xl">
                Blu-Test™ instruments connect to your smartphone for fast, accurate
                sensor verification and system commissioning.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=test-instruments"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Browse Blu-Test Products
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
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">±0.3°F</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Accuracy</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">NIST</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Traceable</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">iOS/Android</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">App</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8 group/image">
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
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Blu-Test Product Line
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Professional-grade test instruments for every diagnostic need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wrench,
                title: 'Blu-Test Temperature',
                description: 'Precision temperature reference with ±0.3°F accuracy for sensor verification and calibration.',
                features: ['NIST traceable', 'Bluetooth app', 'Data logging', 'Long battery life'],
                link: '/products?category=blu-test-temp'
              },
              {
                icon: Smartphone,
                title: 'Blu-Test Humidity',
                description: 'Combined temperature and humidity reference for comprehensive sensor testing.',
                features: ['±1.5% RH accuracy', 'Dew point calc', 'Trending graphs', 'Export reports'],
                link: '/products?category=blu-test-humidity'
              },
              {
                icon: Zap,
                title: 'Blu-Test Pressure',
                description: 'Digital manometer for differential pressure measurement and airflow diagnostics.',
                features: ['±1% accuracy', 'Auto-zero', 'Min/max/avg', 'Multiple units'],
                link: '/products?category=blu-test-pressure'
              }
            ].map((product, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl p-8 transition-all duration-500 hover:-translate-y-2 relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <product.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{product.title}</h3>
                <p className="text-neutral-600 mb-6">{product.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs mt-0.5">✓</span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={product.link}
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

      {/* App Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Powerful Mobile App
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Free iOS and Android app for real-time readings and reporting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Real-Time Display',
                description: 'See live sensor readings with large, easy-to-read numbers'
              },
              {
                icon: CheckCircle,
                title: 'Data Logging',
                description: 'Record measurements over time for trend analysis'
              },
              {
                icon: Search,
                title: 'Min/Max/Average',
                description: 'Track statistical data during testing sessions'
              },
              {
                icon: Shield,
                title: 'Calibration Certificates',
                description: 'Generate and export NIST-traceable documentation'
              },
              {
                icon: Zap,
                title: 'Quick Compare',
                description: 'Compare Blu-Test readings to installed sensors instantly'
              },
              {
                icon: Smartphone,
                title: 'Share Reports',
                description: 'Email PDF reports directly from the app'
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Professional Applications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Sensor Verification',
                description: 'Quickly verify installed sensor accuracy against NIST-traceable reference',
                benefits: ['Save diagnostic time', 'Prove sensor performance', 'Document results']
              },
              {
                title: 'System Commissioning',
                description: 'Commission new HVAC systems with professional documentation',
                benefits: ['Generate reports', 'Track all zones', 'Meet code requirements']
              },
              {
                title: 'Troubleshooting',
                description: 'Isolate sensor issues vs. controller or HVAC problems',
                benefits: ['Faster diagnosis', 'Reduce callbacks', 'Improve confidence']
              },
              {
                title: 'Preventive Maintenance',
                description: 'Regular sensor checks prevent drift and maintain system efficiency',
                benefits: ['Catch drift early', 'Maintain accuracy', 'Prevent comfort issues']
              }
            ].map((useCase, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-8 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">{useCase.title}</h3>
                <p className="text-neutral-600 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-accent-500 mt-1">★</span>
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Upgrade Your Test Equipment
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Professional-grade diagnostics for HVAC technicians and building engineers
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products?category=test-instruments"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
            >
              Browse Blu-Test Products
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
