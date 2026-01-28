"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind,
  Wifi,
  FlaskConical,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

// Mock data for product categories - BRAND STANDARD ORDER
// Per BAPI Brand Guide: Temperature, Humidity, Pressure, Air Quality, Wireless, Accessories, Test Instruments
const productCategories = [
  {
    name: 'Temperature Sensors',
    slug: 'temperature-sensors',
    count: 119,
    image: '/products/temp_sensors.webp',
    icon: '/images/icons/Temperature_Icon.webp',
    description: 'High-accuracy temperature measurement solutions',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    name: 'Humidity Sensors',
    slug: 'humidity-sensors',
    count: 33,
    image: '/products/humidity_sensors.webp',
    icon: '/images/icons/Humidity_Icon.webp',
    description: 'Precise relative humidity monitoring',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Pressure Sensors',
    slug: 'pressure-sensors',
    count: 39,
    image: '/products/pressure_sensors.webp',
    icon: '/images/icons/Pressure_Icon.webp',
    description: 'Differential and static pressure transmitters',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Air Quality Sensors',
    slug: 'air-quality-sensors',
    count: 32,
    image: '/products/air_quality_sensors.webp',
    icon: '/images/icons/AirQuality_Icon.webp',
    description: 'CO₂, VOC, and particulate matter monitoring',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    name: 'Wireless Sensors',
    slug: 'wireless-sensors',
    count: 24,
    image: '/products/wireless_sensors.webp',
    icon: '/images/icons/Wireless_Icon.webp',
    description: 'Battery-powered and energy harvesting solutions',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 45,
    image: '/images/products/families/Accessories_Family_2025_US.webp',
    icon: '/images/icons/Accessories_Icon.webp',
    description: 'Mounting hardware, enclosures, and cables',
    gradient: 'from-gray-500 to-neutral-600',
  },
  {
    name: 'Test Instruments',
    slug: 'test-instruments',
    count: 8,
    image: '/products/test_products.webp',
    icon: '/images/icons/Test_Instruments_Icon.webp',
    description: 'Professional calibration and testing equipment',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'ETA Line',
    slug: 'eta-line',
    count: 70,
    image: '/products/eta_modules_products.webp',
    icon: Layers,
    description: 'Modular I/O and control solutions',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export default function MainProductPage() {
  // For page fade
  const [pageVisible, setPageVisible] = useState(false);
  // For card animation
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setPageVisible(true);
    // Staggered card animation
    const timeout = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 transition-opacity duration-500 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}
      data-testid="products-page-fade"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-100 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Products</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Precision Sensors & Controllers
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Building Automation Products
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed mb-8">
              Explore our complete range of high-accuracy sensors, controllers, and test instruments. 
              Trusted by engineers worldwide for critical HVAC applications.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">400+</div>
                <div className="text-primary-100 text-sm">Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">5 Year</div>
                <div className="text-primary-100 text-sm">Warranty</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">±0.2°C</div>
                <div className="text-primary-100 text-sm">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-20">
          {productCategories.map((cat, i) => {
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className={`group block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent relative focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: showCards ? `${i * 75}ms` : '0ms',
                }}
                tabIndex={0}
                aria-label={`View ${cat.name} category (${cat.count} products)`}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-10 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={`${cat.name} product category`}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    quality={85}
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Icon Badge - BAPI Brand Icons */}
                  <div className={`absolute top-4 right-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-xl ring-4 ring-white/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                    {typeof cat.icon === 'string' ? (
                      <Image
                        src={cat.icon}
                        alt={`${cat.name} icon`}
                        width={32}
                        height={32}
                        className="object-contain drop-shadow-sm"
                      />
                    ) : (
                      <cat.icon className="w-8 h-8 text-white drop-shadow-sm" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-7">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="relative text-xl font-bold text-gray-900 transition-colors duration-300 leading-tight">
                      {cat.name}
                      {/* BAPI Yellow underline on hover */}
                      <span className="absolute left-0 -bottom-1 h-1 w-0 bg-accent-500 rounded transition-all duration-300 ease-in-out group-hover:w-full" />
                    </h2>
                    <span className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200 text-primary-700 font-bold text-sm rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                      {cat.count}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* View Link */}
                  <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300 border-b-2 border-transparent group-hover:border-primary-600 pb-0.5">
                    <span>View Products</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            );
          })}
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 lg:p-16 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
                <Award className="w-4 h-4" />
                Featured Product Line
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                BA/10K Series Temperature Sensors
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our most popular sensors. ±0.2°C accuracy, BACnet MS/TP, and 5-year warranty. 
                Trusted in healthcare, data centers, and critical facilities worldwide.
              </p>

              <Link
                href="/products/featured/ba-series"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View BA Series
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid gap-4">
              {[
                { label: '±0.2°C Accuracy', value: 'Industry Leading' },
                { label: 'BACnet MS/TP', value: 'Native Protocol' },
                { label: '5-Year Warranty', value: 'Standard' },
                { label: 'Made in USA', value: 'Quality Assured' },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="text-primary-600 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-10 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Need Help Finding the Right Product?
              </h2>
              <p className="text-primary-50 text-lg max-w-2xl">
                Our team of experts is ready to help you select the perfect sensors and controllers 
                for your building automation project.
              </p>
            </div>
            
            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Contact Sales
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
