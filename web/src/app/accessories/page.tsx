import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Box, Cable, Wrench, Shield, Layers, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HVAC Sensor Accessories & Mounting Hardware | BAPI',
  description: 'Mounting kits, enclosures, cables, and accessories for BAPI sensors. Complete your installation with professional-grade components.',
};

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur px-4 py-2 rounded-full text-accent-500 font-semibold mb-6">
                <Package className="w-4 h-4" />
                <span>Installation Accessories</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Complete Your
                <span className="block text-accent-500 mt-2">Professional Installation</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-50 mb-8 max-w-2xl">
                BAPI accessories and mounting hardware ensure clean, reliable sensor
                installations that last for decades.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=accessories"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
                >
                  Browse Accessories
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Request Quote
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-accent-500">NEMA</div>
                  <div className="text-sm lg:text-base text-primary-100 mt-1">Rated</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-accent-500">UL</div>
                  <div className="text-sm lg:text-base text-primary-100 mt-1">Listed</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-accent-500">Made USA</div>
                  <div className="text-sm lg:text-base text-primary-100 mt-1">Quality</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8">
                <Image
                  src="/images/products/families/Accessories_Family_2025_US.webp"
                  alt="BAPI accessories family"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessory Categories */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Accessory Categories
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Everything you need for professional sensor installations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Box,
                title: 'Mounting Kits',
                description: 'Universal and application-specific mounting hardware for clean, professional installations.',
                features: ['Wall mounting', 'Duct mounting', 'Pipe mounting', 'Universal kits'],
                link: '/products?category=mounting-kits'
              },
              {
                icon: Shield,
                title: 'Enclosures & Shields',
                description: 'Protective housings, weather shields, and NEMA-rated enclosures for harsh environments.',
                features: ['NEMA 4X rated', 'Weather shields', 'Tamper guards', 'Custom options'],
                link: '/products?category=enclosures'
              },
              {
                icon: Cable,
                title: 'Cables & Wiring',
                description: 'Pre-made sensor cables, extension cables, and wiring accessories for reliable connections.',
                features: ['Custom lengths', 'Shielded cable', 'Quick connects', 'Plenum rated'],
                link: '/products?category=cables'
              }
            ].map((category, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl p-8 transition-all duration-500 hover:-translate-y-2 relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{category.title}</h3>
                <p className="text-neutral-600 mb-6">{category.description}</p>
                
                <ul className="space-y-2 mb-8">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={category.link}
                  className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold group-hover:gap-4 transition-all duration-300"
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

      {/* Additional Accessories */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Additional Products
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wrench,
                title: 'Installation Tools',
                description: 'Specialized tools for sensor installation and commissioning'
              },
              {
                icon: Layers,
                title: 'Averaging Elements',
                description: 'Duct averaging sensors for large duct applications'
              },
              {
                icon: Shield,
                title: 'Replacement Parts',
                description: 'Sensor elements, covers, and component replacements'
              },
              {
                icon: Package,
                title: 'Custom Solutions',
                description: 'Application-specific accessories and custom assemblies'
              }
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-6 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                  <product.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{product.title}</h3>
                <p className="text-sm text-neutral-600">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why BAPI Accessories?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Engineered Together',
                description: 'Accessories designed specifically for BAPI sensors ensure perfect fit and compatibility'
              },
              {
                title: 'Professional Appearance',
                description: 'Clean, finished installations that reflect the quality of your work'
              },
              {
                title: 'Durability',
                description: 'High-quality materials and construction for installations that last decades'
              },
              {
                title: 'Code Compliance',
                description: 'UL-listed and NEMA-rated options meet building code requirements'
              },
              {
                title: 'Installation Speed',
                description: 'Pre-engineered solutions save time on every installation'
              },
              {
                title: 'Complete System',
                description: 'One-stop shopping for all sensor and accessory needs'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
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
            Complete Your Installation
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Explore our full line of accessories or contact us for custom solutions
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products?category=accessories"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
            >
              Browse All Accessories
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
