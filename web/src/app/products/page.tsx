
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Mock data for product categories
const productCategories = [
  {
    name: 'Test Instruments',
    slug: 'test-instruments',
    count: 8,
    image: '/products/test_products.webp',
  },
  {
    name: 'Temperature Sensors',
    slug: 'temperature-sensors',
    count: 119,
    image: '/products/temp_sensors.webp',
  },
  {
    name: 'Humidity Sensors',
    slug: 'humidity-sensors',
    count: 33,
    image: '/products/humidity_sensors.webp',
  },
  {
    name: 'Pressure Sensors',
    slug: 'pressure-sensors',
    count: 39,
    image: '/products/pressure_sensors.webp',
  },
  {
    name: 'Wireless Sensors',
    slug: 'wireless-sensors',
    count: 24,
    image: '/products/wireless_sensors.webp',
  },
  {
    name: 'Air Quality Sensors',
    slug: 'air-quality-sensors',
    count: 32,
    image: '/products/air_quality_sensors.webp',
  },
  {
    name: 'ETA Line',
    slug: 'eta-line',
    count: 70,
    image: '/products/eta_modules_products.webp',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 74,
    image: '/products/accessories_products.webp',
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

  // Fade out on navigation (optional, for future: use router events)

  return (
    <div
      className={`min-h-screen bg-white flex flex-col transition-opacity duration-500 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}
      data-testid="products-page-fade"
    >
      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 px-4 text-sm" aria-label="Breadcrumb">
        <ol className="container mx-auto flex items-center space-x-2">
          <li>
            <Link href="/" className="text-primary-600 hover:underline">Home</Link>
          </li>
          <li className="text-neutral-400">/</li>
          <li className="text-primary-700 font-bold">Products</li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-2 tracking-tight">Products</h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          Explore our full range of building automation sensors and control modules. Select a category below to get started.
        </p>
      </header>

      {/* Category Grid */}
      <main className="container mx-auto px-4 flex-1">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className={`group block rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-2xl focus:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-primary-50/60 focus:bg-primary-50/60 group-hover:scale-[1.02] group-focus:scale-[1.02]
                ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{
                transitionDelay: showCards ? `${i * 100 + 150}ms` : '0ms',
              }}
              tabIndex={0}
              aria-label={`View ${cat.name} category (${cat.count} products)`}
            >
              <div className="relative w-full aspect-4/3 bg-neutral-50 flex items-center justify-center">
                <Image
                  src={cat.image}
                  alt={`${cat.name} product category`}
                  fill
                  className="object-contain p-4 sm:p-6 group-hover:scale-105 group-focus:scale-105 transition-transform duration-200 drop-shadow-md bg-linear-to-br from-primary-50 to-white"
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  quality={85}
                  priority={cat.slug === 'temperature-sensors'}
                  loading={cat.slug === 'temperature-sensors' ? 'eager' : 'lazy'}
                />
              </div>
              <div className="p-5 flex flex-col items-start">
                <h2 className="relative text-2xl font-black text-primary-700 group-hover:text-primary-800 group-focus:text-primary-800 mb-1 tracking-tight drop-shadow-sm">
                  {cat.name}
                  <span
                    className="absolute left-0 -bottom-2 h-1.5 w-0 bg-yellow-400 rounded transition-all duration-300 ease-in-out group-hover:w-full group-focus:w-full"
                    style={{ backgroundColor: '#FFD600' }}
                    aria-hidden="true"
                  />
                </h2>
                {/* Product count removed for cleaner UI */}
                {/* Optional: Add a short description for branding polish */}
                {/* <p className="text-xs text-neutral-500 mt-1">High quality {cat.name.toLowerCase()} for every application.</p> */}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 bg-white mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-600">
          <p>&copy; 2025 BAPI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
