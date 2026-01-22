import Link from 'next/link';
import { Hero } from './components';
import { 
  Thermometer, 
  Gauge, 
  Wind, 
  CheckCircle,
  ArrowRight,
  Zap,
  Award,
  Globe,
  Fan,
  Server,
  Utensils,
  Truck,
  Heart,
  ShoppingCart,
  Beef,
  Snowflake
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Simplified with ONE primary CTA */}
      <Hero />

      {/* Quick Stats Bar */}
      <section className="bg-primary-500 py-8 lg:py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
            {[
              { value: '30+', label: 'Years of Excellence' },
              { value: '608', label: 'Product Models' },
              { value: 'Global', label: 'Reach & Support' },
              { value: 'ISO 9001', label: 'Certified Quality' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm lg:text-base text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Industry - 8 Industries */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Innovative sensor solutions for the global market
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-neutral-600 font-medium">Browse by:</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-accent-500 text-neutral-900 rounded-lg font-semibold text-sm">
                  Industry
                </button>
                <Link 
                  href="/products"
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600 rounded-lg font-semibold text-sm transition-colors"
                >
                  Sensor Type
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              {
                name: 'HVAC/R',
                icon: Fan,
                href: '/applications/building-automation',
                description: 'Commercial HVAC and refrigeration'
              },
              {
                name: 'Data Centers',
                icon: Server,
                href: '/applications/building-automation',
                description: 'Critical temperature and humidity control'
              },
              {
                name: 'Food Service',
                icon: Utensils,
                href: '/applications/building-automation',
                description: 'Commercial kitchens and restaurants'
              },
              {
                name: 'Transportation',
                icon: Truck,
                href: '/applications/building-automation',
                description: 'Fleet monitoring and logistics'
              },
              {
                name: 'Healthcare',
                icon: Heart,
                href: '/applications/building-automation',
                description: 'Hospitals and medical facilities'
              },
              {
                name: 'Grocery',
                icon: ShoppingCart,
                href: '/applications/building-automation',
                description: 'Supermarkets and retail food'
              },
              {
                name: 'Meat Processing',
                icon: Beef,
                href: '/applications/industrial-process',
                description: 'Food processing and safety'
              },
              {
                name: 'Cold Chain',
                icon: Snowflake,
                href: '/applications/building-automation',
                description: 'Temperature-controlled logistics'
              }
            ].map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Link
                  key={industry.name}
                  href={industry.href}
                  className="group bg-white border border-neutral-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-4 flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-primary-600 mb-2">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {industry.description}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/applications"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              View All Applications
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-neutral-50 py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Popular Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Industry-leading sensors trusted by thousands of projects worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'BA/10K-3 Room Sensor',
                category: 'Temperature',
                description: '±0.2°C accuracy, wall-mount design for commercial spaces',
                price: 'Contact for pricing',
                features: ['10K-3 Thermistor', 'Wall Mount', 'BACnet/Modbus'],
                icon: Thermometer
              },
              {
                name: 'BA/RH-WD4 Room Humidity',
                category: 'Humidity',
                description: 'Combined temp/humidity for IAQ monitoring',
                price: 'Contact for pricing',
                features: ['±2% RH Accuracy', 'LCD Display', 'Multi-Protocol'],
                icon: Wind
              },
              {
                name: 'BA-DPT Differential Pressure',
                category: 'Pressure',
                description: 'Room pressurization and filter monitoring',
                price: 'Contact for pricing',
                features: ['0-10" WC Range', 'Hospital Grade', 'ASHRAE 170'],
                icon: Gauge
              }
            ].map((product) => {
              const IconComponent = product.icon;
              return (
                <div 
                  key={product.name}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image Placeholder */}
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 h-48 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-primary-500" strokeWidth={1.5} />
                  </div>
                  
                  <div className="p-6">
                    <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {product.description}
                    </p>
                    
                    <ul className="space-y-2 mb-4">
                      {product.features.map((feature) => (
                        <li key={feature} className="text-xs text-neutral-700 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <span className="text-sm font-semibold text-neutral-900">{product.price}</span>
                      <Link 
                        href="/products"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why BAPI - 3 Key Differentiators */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose BAPI?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Precision Engineering',
                description: 'Every sensor individually calibrated to NIST-traceable standards with ±0.2°C accuracy and multi-point factory testing.'
              },
              {
                icon: Zap,
                title: 'Rapid Delivery',
                description: 'Same-day shipping on stock items from our Wisconsin manufacturing facility. Global distributor network for local support.'
              },
              {
                icon: Globe,
                title: 'Expert Support',
                description: 'Dedicated application engineers with decades of HVAC experience provide free technical consulting and design review.'
              }
            ].map((reason) => {
              const IconComponent = reason.icon;
              return (
                <div key={reason.title} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{reason.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof - Customer Testimonial */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-12 lg:py-16 border-y border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-accent-500 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
          <blockquote className="text-xl lg:text-2xl font-medium text-neutral-900 mb-6 italic">
            "BAPI sensors have been the cornerstone of our building automation projects for over a decade. The accuracy and reliability are unmatched, and their technical support team is exceptional."
          </blockquote>
          <div className="text-neutral-600">
            <div className="font-semibold text-neutral-900">Michael Chen</div>
            <div className="text-sm">Senior Controls Engineer, Johnson Controls</div>
          </div>
        </div>
      </section>

      {/* Final CTA - Single Focus on Product Discovery */}
      <section className="bg-primary-500 py-12 lg:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Find Your Solution?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our complete catalog or talk to an application engineer for expert guidance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/applications"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Browse by Application
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-neutral-50 text-primary-500 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Talk to an Engineer
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-primary-400 text-primary-100">
            <p className="text-sm">
              <strong>Made in USA</strong> • Same-Day Shipping • ISO 9001:2015 Certified • 30+ Years of Excellence
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

