import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Radio, Wifi, Bell, BarChart3, Battery, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wireless Sensors & Monitoring Solutions | BAPI WAM',
  description: 'Wireless Asset Monitoring (WAM) for temperature, humidity, and door monitoring. Battery-powered sensors with cloud dashboards for remote facility management.',
};

export default function WirelessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur px-4 py-2 rounded-full text-accent-500 font-semibold mb-6">
                <Radio className="w-4 h-4" />
                <span>Wireless Asset Monitoring</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Monitor Anywhere,
                <span className="block text-accent-500 mt-2">Without Wiring</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-50 mb-8 max-w-2xl">
                BAPI WAM™ wireless sensors provide real-time temperature and humidity monitoring
                with instant alerts—no wiring required.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/wam"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Explore WAM Solutions
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  Request Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">5 min</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Setup Time</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">5-Year</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Battery Life</div>
                  </div>
                </div>
                <div className="group relative cursor-default">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-xl border-2 border-accent-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                  <div className="relative p-4 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-accent-500 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                    <div className="text-sm lg:text-base text-primary-100 font-medium">Cloud Access</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden shadow-2xl group/image">
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
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Wireless Product Line
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Complete wireless monitoring solutions for every application
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Radio,
                title: 'WAM Temperature Sensors',
                description: 'Wireless temperature monitoring for coolers, freezers, rooms, and outdoor environments.',
                features: ['±0.5°F accuracy', '900 MHz LoRa', '5-year battery', 'IP67 rated'],
                link: '/products?category=wireless-temperature'
              },
              {
                icon: Wifi,
                title: 'WAM Humidity Sensors',
                description: 'Combined temperature and humidity monitoring for climate-critical applications.',
                features: ['±2% RH accuracy', 'Condensation safe', 'LCD display', 'Remote alerts'],
                link: '/products?category=wireless-humidity'
              },
              {
                icon: Bell,
                title: 'WAM Door Sensors',
                description: 'Magnetic door switches for open/close monitoring and alert notification.',
                features: ['Instant alerts', 'Low power', 'Easy mount', 'Cloud logging'],
                link: '/products?category=wireless-door'
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

      {/* Cloud Platform Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Powerful Cloud Platform
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Monitor, analyze, and manage all your sensors from anywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Real-Time Dashboards',
                description: 'View live temperature data from all sensors on customizable dashboards'
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                description: 'Get email, SMS, or push notifications when temperatures go out of range'
              },
              {
                icon: Shield,
                title: 'Compliance Reporting',
                description: 'Automated reports for HACCP, FDA, and food safety compliance'
              },
              {
                icon: Battery,
                title: 'Battery Monitoring',
                description: 'Track battery levels and receive low-battery alerts before failure'
              },
              {
                icon: Wifi,
                title: 'Multi-Site Management',
                description: 'Manage sensors across multiple locations from a single account'
              },
              {
                icon: BarChart3,
                title: 'Historical Trends',
                description: 'Analyze temperature patterns over days, weeks, or months'
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

      {/* Installation Gallery Preview */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Real-World Installations
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              See WAM wireless sensors protecting assets in convenience stores, restaurants, and food service operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                src: '/images/applications/retail/coolers/Cooler_Front_4.webp',
                alt: 'Walk-in cooler monitoring',
                title: 'Walk-In Coolers'
              },
              {
                src: '/images/applications/retail/freezers/Freezer_Door_1.webp',
                alt: 'Freezer temperature sensor',
                title: 'Walk-In Freezers'
              },
              {
                src: '/images/applications/retail/deli-cases/Deli_Cases_All_1.webp',
                alt: 'Deli case monitoring',
                title: 'Deli Cases'
              },
              {
                src: '/images/applications/retail/convenience/Mini-Mart_Overhead_4.webp',
                alt: 'Convenience store sensors',
                title: 'Convenience Stores'
              }
            ].map((image, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
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
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
            >
              View All Installation Examples
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Go Wireless?
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Explore our complete WAM wireless monitoring solution or request a demo
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/wam"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
            >
              Explore WAM Solutions
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
