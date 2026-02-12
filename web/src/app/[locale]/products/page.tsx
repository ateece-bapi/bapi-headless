'use client';
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
  Award,
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
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/3 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-primary-100"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-white">Products</span>
          </nav>

          {/* Header */}
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Precision Sensors & Controllers
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Building Automation Products
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-primary-50 md:text-2xl">
              Explore our complete range of high-accuracy sensors, controllers, and test
              instruments. Trusted by engineers worldwide for critical HVAC applications.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">400+</div>
                <div className="text-sm text-primary-100">Products</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">5 Year</div>
                <div className="text-sm text-primary-100">Warranty</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">±0.2°C</div>
                <div className="text-sm text-primary-100">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productCategories.map((cat, i) => {
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:border-transparent hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} `}
                style={{
                  transitionDelay: showCards ? `${i * 75}ms` : '0ms',
                }}
                tabIndex={0}
                aria-label={`View ${cat.name} category (${cat.count} products)`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Product Image */}
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white p-10">
                  <Image
                    src={cat.image}
                    alt={`${cat.name} product category`}
                    fill
                    className="object-contain p-8 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    quality={85}
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Icon Badge - BAPI Brand Icons */}
                  <div
                    className={`absolute right-4 top-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-xl ring-4 ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}
                  >
                    {typeof cat.icon === 'string' ? (
                      <Image
                        src={cat.icon}
                        alt={`${cat.name} icon`}
                        width={32}
                        height={32}
                        className="object-contain drop-shadow-sm"
                      />
                    ) : (
                      <cat.icon className="h-8 w-8 text-white drop-shadow-sm" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-7">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="relative text-xl font-bold leading-tight text-gray-900 transition-colors duration-300">
                      {cat.name}
                      {/* BAPI Yellow underline on hover */}
                      <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
                    </h2>
                    <span className="flex-shrink-0 rounded-lg border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 px-3 py-1.5 text-sm font-bold text-primary-700 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                      {cat.count}
                    </span>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-600">
                    {cat.description}
                  </p>

                  {/* View Link */}
                  <div className="inline-flex items-center gap-2 border-b-2 border-transparent pb-0.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3 group-hover:border-primary-600">
                    <span>View Products</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        {/* Featured Section */}
        <div className="mb-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-10 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <Award className="h-4 w-4" />
                Featured Product Line
              </div>

              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                BA/10K Series Temperature Sensors
              </h2>

              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Our most popular sensors. ±0.2°C accuracy, BACnet MS/TP, and 5-year warranty.
                Trusted in healthcare, data centers, and critical facilities worldwide.
              </p>

              <Link
                href="/products/featured/ba-series"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                View BA Series
                <ArrowRight className="h-5 w-5" />
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
                  className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="font-medium text-primary-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
                Need Help Finding the Right Product?
              </h2>
              <p className="max-w-2xl text-lg text-primary-50">
                Our team of experts is ready to help you select the perfect sensors and controllers
                for your building automation project.
              </p>
            </div>

            <Link
              href="/company/contact-us"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Contact Sales
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
