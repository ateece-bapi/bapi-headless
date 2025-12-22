
import Link from 'next/link';
import Image from 'next/image';

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
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 px-4 text-sm" aria-label="Breadcrumb">
        <ol className="container mx-auto flex items-center space-x-2">
          <li>
            <Link href="/" className="text-primary-600 hover:underline">Home</Link>
          </li>
          <li className="text-neutral-400">/</li>
          <li className="text-neutral-700 font-semibold">Products</li>
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
          {productCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="group block rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg focus:shadow-lg transition overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
              tabIndex={0}
              aria-label={`View ${cat.name} category (${cat.count} products)`}
            >
              <div className="relative w-full aspect-[4/3] bg-neutral-50 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={`${cat.name} product category`}
                    fill
                    className="object-contain p-4 sm:p-6 group-hover:scale-105 group-focus:scale-105 transition-transform duration-200 drop-shadow-md bg-gradient-to-br from-primary-50 to-white"
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    quality={85}
                    priority={cat.slug === 'temperature-sensors'}
                    loading={cat.slug === 'temperature-sensors' ? 'eager' : 'lazy'}
                  />
              </div>
                <div className="p-5 flex flex-col items-start">
                  <h2 className="text-xl font-extrabold text-primary-700 group-hover:text-accent-600 group-focus:text-accent-600 mb-1 tracking-tight drop-shadow-sm">
                    {cat.name}
                  </h2>
                  <div className="text-xs sm:text-sm text-neutral-400 font-medium mb-1 uppercase tracking-wide">
                    {cat.count} products
                  </div>
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
