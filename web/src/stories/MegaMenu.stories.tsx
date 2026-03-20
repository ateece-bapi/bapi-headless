/* eslint-disable @next/next/no-html-link-for-pages */
/**
 * MegaMenu Component Stories
 *
 * Documents the desktop mega menu navigation system used in the header.
 * Note: Uses <a> tags for documentation purposes (not actual navigation in Storybook).
 *
 * **MegaMenu Features:**
 * - 3 top-level items: Products (with dropdown), Support, Company
 * - Products dropdown with 7 product category columns
 * - Each column has BAPI brand icon + 3–4 product links (up to 4 per category)
 * - Featured product showcase with badge
 * - Hover intent delay (80ms to open, 140ms to close)
 * - Keyboard navigation (ArrowDown, Enter, Space, Escape)
 * - Focus management and ARIA attributes
 * - Outside click detection
 * - Smooth animations (300ms transitions)
 *
 * **Product Categories (Current Implementation):**
 * 1. Temperature (Red/Orange icon)
 * 2. Humidity (Blue/Cyan icon)
 * 3. Pressure (Purple/Pink icon)
 * 4. Air Quality (Teal/Cyan icon)
 * 5. Wireless (Green/Emerald icon)
 * 6. Accessories (Gray/Neutral icon)
 * 7. Test Instruments (Cyan/Blue icon)
 *
 * Note: Sensors category exists in brand guidelines but not yet implemented in mega menu.
 *
 * **Accessibility:**
 * - WCAG 2.1 AA compliant (comprehensive automated test coverage)
 * - Proper ARIA roles and attributes
 * - Keyboard navigation support
 * - Focus indicators
 * - Screen reader announcements
 *
 * **Note:**
 * Due to the complexity of the MegaMenu (next-intl, routing, state hooks),
 * these stories document the visual appearance and structure.
 * Full interactive functionality requires the complete app context.
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Image from 'next/image';
import { ChevronDownIcon, CheckCircleIcon, AlertTriangleIcon } from '@/lib/icons';

const meta: Meta = {
  title: 'Components/MegaMenu',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Desktop navigation with expandable mega menu for product categories. Features 8 BAPI product category columns with icons, product links, featured products, and quick actions.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Product categories data (matches Icon.stories.tsx)
const productCategories = [
  {
    name: 'Temperature',
    slug: 'temperature',
    icon: '/images/icons/Temperature_Icon.webp',
    color: 'Red/Orange',
    products: [
      { name: 'Room & Wall Sensors', desc: 'Precise temperature monitoring for rooms and walls' },
      { name: 'Duct Sensors', desc: 'Monitor air temperature in ducts' },
      { name: 'Immersion & Well Sensors', desc: 'For liquids and pipes' },
      { name: 'Outdoor Sensors', desc: 'Weather-resistant temperature monitoring' },
    ],
  },
  {
    name: 'Humidity',
    slug: 'humidity',
    icon: '/images/icons/Humidity_Icon.webp',
    color: 'Blue/Cyan',
    products: [
      { name: 'Room Humidity Sensors', desc: 'Monitor indoor relative humidity' },
      { name: 'Duct Humidity Sensors', desc: 'HVAC duct humidity monitoring' },
      { name: 'Outdoor Humidity', desc: 'Weather-resistant RH sensors' },
      { name: 'Combo Sensors', desc: 'Temperature + Humidity combined' },
    ],
  },
  {
    name: 'Pressure',
    slug: 'pressure',
    icon: '/images/icons/Pressure_Icon.webp',
    color: 'Purple/Pink',
    products: [
      { name: 'Differential Pressure', desc: 'Monitor pressure differences across filters' },
      { name: 'Static Pressure', desc: 'HVAC system pressure monitoring' },
      { name: 'Barometric Pressure', desc: 'Atmospheric pressure sensors' },
    ],
  },
  {
    name: 'Air Quality',
    slug: 'air-quality',
    icon: '/images/icons/AirQuality_Icon.webp',
    color: 'Teal/Cyan',
    products: [
      { name: 'CO₂ Sensors', desc: 'Indoor air quality monitoring' },
      { name: 'VOC Sensors', desc: 'Volatile organic compound detection' },
      { name: 'Particulate Matter', desc: 'PM2.5 and PM10 sensors' },
      { name: 'Multi-gas Sensors', desc: 'Combined air quality monitoring' },
    ],
  },
  {
    name: 'Wireless',
    slug: 'wireless',
    icon: '/images/icons/Wireless_Icon.webp',
    color: 'Green/Emerald',
    products: [
      { name: 'Wireless Temperature', desc: 'Battery-powered temp sensors' },
      { name: 'Wireless Humidity', desc: 'Battery-powered RH sensors' },
      { name: 'Wireless Gateways', desc: 'Data collection hubs' },
      { name: 'Wireless Modules', desc: 'Add wireless to any sensor' },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    icon: '/images/icons/Accessories_Icon.webp',
    color: 'Gray/Neutral',
    products: [
      { name: 'Mounting Kits', desc: 'Installation hardware' },
      { name: 'Cable & Connectors', desc: 'Wiring accessories' },
      { name: 'Enclosures', desc: 'Protective housings' },
      { name: 'Calibration Tools', desc: 'Testing and calibration equipment' },
    ],
  },
  {
    name: 'Test Instruments',
    slug: 'test-instruments',
    icon: '/images/icons/Test_Instruments_Icon.webp',
    color: 'Cyan/Blue',
    products: [
      { name: 'Handheld Meters', desc: 'Portable testing devices' },
      { name: 'Data Loggers', desc: 'Record and store measurements' },
      { name: 'Calibrators', desc: 'Sensor calibration equipment' },
      { name: 'Test Kits', desc: 'Complete testing solutions' },
    ],
  },
];

// Story: Complete MegaMenu Documentation
export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-50">
      {/* Header with MegaMenu */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-primary-600">BAPI</div>
            </div>

            {/* Navigation */}
            <nav aria-label="Primary navigation" className="flex items-center gap-1">
              {/* Products (with mega menu) */}
              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2.5 text-base font-semibold text-white shadow-md transition-all duration-300"
                >
                  <span>Products</span>
                  <ChevronDownIcon
                    className="h-4 w-4 rotate-180 scale-110 transition-all duration-300"
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Support */}
              <a
                href="/support"
                onClick={(e) => e.preventDefault()}
                className="group relative inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-sm"
              >
                Support
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary-400 transition-all duration-300 group-hover:w-1/2" />
              </a>

              {/* Company */}
              <a
                href="/company"
                onClick={(e) => e.preventDefault()}
                className="group relative inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:shadow-sm"
              >
                Company
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary-400 transition-all duration-300 group-hover:w-1/2" />
              </a>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100">
                Search
              </button>
              <button className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100">Cart</button>
            </div>
          </div>
        </div>

        {/* Mega Menu Panel (Open State) */}
        <div className="absolute left-0 right-0 z-50 mx-auto mt-2 max-w-7xl px-4">
          <div className="rounded-2xl border-2 border-primary-500/20 bg-white p-5 shadow-2xl">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              {/* Main Product Columns (9 columns) */}
              <div className="md:col-span-9">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {productCategories.map((category) => (
                    <div key={category.slug} className="space-y-3">
                      {/* Column Header */}
                      <a
                        href={`/products/${category.slug}`}
                        className="group flex items-center gap-2 rounded-lg border border-transparent p-1.5 transition-all hover:border-primary-200 hover:bg-primary-50"
                      >
                        <div className="relative h-8 w-8 shrink-0 rounded bg-primary-100 p-1">
                          <Image
                            src={category.icon}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-neutral-900 group-hover:text-primary-700">
                            {category.name}
                          </h3>
                          <p className="text-xs text-neutral-700">{category.color}</p>
                        </div>
                      </a>

                      {/* Product Links */}
                      <div className="space-y-1">
                        {category.products.slice(0, 4).map((product, pidx) => (
                          <a
                            key={pidx}
                            href="#"
                            className="group block rounded-lg border border-transparent p-2 transition-all hover:border-neutral-200 hover:bg-neutral-50"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-neutral-900 group-hover:text-primary-700">
                                  {product.name}
                                </div>
                                <div className="mt-0.5 text-xs leading-tight text-neutral-700">
                                  {product.desc}
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>

                      {/* View All Link */}
                      <a
                        href={`/products/${category.slug}`}
                        className="group mt-3 inline-flex w-full items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700 transition-all hover:border-primary-400 hover:bg-primary-100"
                      >
                        <span>View All {category.name}</span>
                        <ChevronDownIcon className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar (3 columns) */}
              <div className="space-y-4 md:col-span-3">
                {/* Featured Product */}
                <div className="rounded-lg border-2 border-primary-200 bg-linear-to-br from-primary-50 via-white to-primary-50/30 p-4">
                  <div className="mb-2 inline-block rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold uppercase text-white">
                    NEW
                  </div>
                  <h3 className="mb-2 text-lg font-black text-neutral-900">
                    Wireless Area Monitor™
                  </h3>
                  <p className="mb-3 text-sm text-neutral-700">
                    Next-generation wireless monitoring with 10-year battery life
                  </p>
                  <a
                    href="#"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
                  >
                    Explore WAM™
                    <ChevronDownIcon className="-rotate-90" sx={{ fontSize: 16 }} />
                  </a>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary-100 p-2">
                      <svg
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Need help choosing?</p>
                      <p className="mt-0.5 text-xs text-neutral-700">
                        Our product selector tool can help
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 rounded-md border border-primary-200 bg-white px-3 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-50"
                    >
                      Contact Sales
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                    >
                      Find Distributor
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-neutral-950">MegaMenu Component</h1>
            <p className="mt-2 text-lg text-neutral-700">
              Desktop navigation with expandable product category mega menu
            </p>
          </div>

          {/* Feature List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">7 Product Categories</h2>
              <p className="text-sm text-neutral-700">
                Complete product taxonomy with BAPI brand icons
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">Hover Intent</h2>
              <p className="text-sm text-neutral-700">
                80ms delay to open, 140ms delay to close for smooth UX
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">Keyboard Navigation</h2>
              <p className="text-sm text-neutral-700">
                Full keyboard support: ArrowDown, Enter, Space, Escape, Tab
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">WCAG 2.1 AA</h2>
              <p className="text-sm text-neutral-700">
                Comprehensive automated accessibility tests with jest-axe
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">Featured Products</h2>
              <p className="text-sm text-neutral-700">
                Sidebar showcase with badge, description, and CTA
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <CheckCircleIcon className="mb-3 h-8 w-8 text-success-600" aria-hidden="true" />
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">Quick Actions</h2>
              <p className="text-sm text-neutral-700">
                Contact sales, find distributor, technical support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Story: Closed State (Navigation Bar)
export const ClosedState: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-950">Closed State</h2>
        <p className="text-neutral-700">Default state with all menu items visible</p>
      </div>

      <div className="rounded-lg border-2 border-neutral-200 bg-white p-4">
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {/* Products */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 transition-all hover:bg-primary-600 hover:text-white"
          >
            <span>Products</span>
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Support */}
          <a
            href="/support"
            onClick={(e) => e.preventDefault()}
            className="group relative inline-flex items-center rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 transition-all hover:bg-primary-600 hover:text-white"
          >
            Support
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary-400 transition-all group-hover:w-1/2" />
          </a>

          {/* Company */}
          <a
            href="/company"
            onClick={(e) => e.preventDefault()}
            className="group relative inline-flex items-center rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 transition-all hover:bg-primary-600 hover:text-white"
          >
            Company
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary-400 transition-all group-hover:w-1/2" />
          </a>
        </nav>
      </div>

      <div className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
        <strong>Interaction:</strong> Hover or click &quot;Products&quot; to open mega menu.
        Support and Company are direct links.
      </div>
    </div>
  ),
};

// Story: Product Category Column Structure
export const CategoryColumn: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-950">Product Category Column</h2>
        <p className="text-neutral-700">
          Each of the 7 product categories follows this structure
        </p>
      </div>

      <div className="mx-auto max-w-xs rounded-lg border-2 border-primary-200 bg-white p-4">
        {/* Column Header */}
        <a
          href="/products/temperature"
          className="group mb-3 flex items-center gap-2 rounded-lg border border-transparent p-1.5 transition-all hover:border-primary-200 hover:bg-primary-50"
        >
          <div className="relative h-8 w-8 shrink-0 rounded bg-primary-100 p-1">
            <Image
              src="/images/icons/Temperature_Icon.webp"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-neutral-900 group-hover:text-primary-700">
              Temperature
            </h3>
            <p className="text-xs text-neutral-700">Red/Orange</p>
          </div>
        </a>

        {/* Product Links */}
        <div className="mb-3 space-y-1">
          {[
            'Room & Wall Sensors',
            'Duct Sensors',
            'Immersion & Well',
            'Outdoor Sensors',
          ].map((name, idx) => (
            <a
              key={idx}
              href="#"
              className="group block rounded-lg border border-transparent p-2 transition-all hover:border-neutral-200 hover:bg-neutral-50"
            >
              <div className="text-xs font-semibold text-neutral-900 group-hover:text-primary-700">
                {name}
              </div>
              <div className="mt-0.5 text-xs text-neutral-700">Product description</div>
            </a>
          ))}
        </div>

        {/* View All Link */}
        <a
          href="/products/temperature"
          className="group inline-flex w-full items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700 transition-all hover:border-primary-400 hover:bg-primary-100"
        >
          <span>View All Temperature</span>
          <ChevronDownIcon className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-neutral-900">Structure:</h3>
        <ul className="space-y-1 text-sm text-neutral-700">
          <li>• <strong>Header:</strong> Category name + BAPI brand icon (clickable)</li>
          <li>• <strong>Links:</strong> 3-4 product subcategory links with descriptions</li>
          <li>• <strong>View All:</strong> Link to main category page</li>
        </ul>
      </div>
    </div>
  ),
};

// Story: Brand Compliance
export const BrandCompliance: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-950">Brand Compliance</h2>
        <p className="text-neutral-700">BAPI Brand Guide requirements for mega menu</p>
      </div>

      {/* Category Order Alert */}
      <div className="rounded-lg border-2 border-accent-500 bg-accent-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangleIcon className="mt-1 shrink-0 text-accent-600" sx={{ fontSize: 24 }} />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-accent-900">
              Mandatory Category Order (Never Reorder!)
            </h3>
            <p className="text-sm text-accent-800 mb-2">
              Current implementation uses 7 categories:
            </p>
            <ol className="space-y-1 text-sm text-accent-800">
              <li>1. Temperature (Red/Orange)</li>
              <li>2. Humidity (Blue/Cyan)</li>
              <li>3. Pressure (Purple/Pink)</li>
              <li>4. Air Quality (Teal/Cyan)</li>
              <li>5. Wireless (Green/Emerald)</li>
              <li>6. Accessories (Gray/Neutral)</li>
              <li>7. Test Instruments (Cyan/Blue)</li>
            </ol>
            <p className="text-xs text-accent-700 mt-2 italic">
              Note: Sensors (Blue/Gray) exists in brand guidelines as position #5,
              but is not yet implemented in the mega menu.
            </p>
          </div>
        </div>
      </div>

      {/* Icon Grid */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          Product Category Icons (32px in Mega Menu)
        </h3>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {productCategories.map((cat, idx) => (
            <div key={cat.slug} className="flex flex-col items-center gap-2">
              <div className="relative h-8 w-8 rounded bg-primary-100 p-1">
                <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-neutral-900">{cat.name}</div>
                <div className="text-xs text-neutral-700">#{idx + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-success-900">✓ Do</h4>
          <ul className="space-y-1 text-sm text-success-800">
            <li>• Keep icons in mandatory order</li>
            <li>• Use 32px icons in mega menu</li>
            <li>• Maintain equal column widths</li>
            <li>• Use WebP format for performance</li>
            <li>• Include alt text for accessibility</li>
          </ul>
        </div>
        <div className="rounded-lg border border-error-200 bg-error-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-error-900">✗ Don&apos;t</h4>
          <ul className="space-y-1 text-sm text-error-800">
            <li>• Reorder categories by popularity</li>
            <li>• Combine categories (e.g., &quot;T&amp;H&quot;)</li>
            <li>• Use mismatched icon sizes</li>
            <li>• Skip categories to save space</li>
            <li>• Use placeholder icons</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

// Story: Accessibility Features
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-950">Accessibility Features</h2>
        <p className="text-neutral-700">WCAG 2.1 AA compliant with comprehensive automated test coverage</p>
      </div>

      {/* ARIA Attributes */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">ARIA Attributes</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              aria-label=&quot;Primary navigation&quot;
            </code>
            <span className="text-neutral-700">Navigation landmark</span>
          </div>
          <div className="flex gap-3">
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              aria-haspopup=&quot;true&quot;
            </code>
            <span className="text-neutral-700">Indicates dropdown</span>
          </div>
          <div className="flex gap-3">
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              aria-expanded=&quot;true|false&quot;
            </code>
            <span className="text-neutral-700">Menu state</span>
          </div>
          <div className="flex gap-3">
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              aria-controls=&quot;mega-menu-0&quot;
            </code>
            <span className="text-neutral-700">Links trigger to panel</span>
          </div>
          <div className="flex gap-3">
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              role=&quot;region&quot;
            </code>
            <span className="text-neutral-700">Menu panel landmark</span>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Keyboard Navigation</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-900">
              Enter
            </kbd>
            <span className="text-neutral-700">Open/close mega menu</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-900">
              Space
            </kbd>
            <span className="text-neutral-700">Toggle mega menu</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-900">
              Escape
            </kbd>
            <span className="text-neutral-700">Close mega menu</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-900">
              Tab
            </kbd>
            <span className="text-neutral-700">Navigate through links</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-900">
              ↓
            </kbd>
            <span className="text-neutral-700">Open mega menu</span>
          </div>
        </div>
      </div>

      {/* Focus Management */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Focus Management</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>
            • <strong>Focus visible:</strong> 2px primary-500 ring with 2px offset
          </li>
          <li>
            • <strong>Focus trap:</strong> Focus remains within open mega menu
          </li>
          <li>
            • <strong>Focus return:</strong> Returns to trigger on Escape
          </li>
          <li>
            • <strong>Skip link:</strong> Keyboard users can skip navigation
          </li>
        </ul>
      </div>

      {/* Screen Reader Support */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Screen Reader Support</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>• Announces menu state changes (opened/closed)</li>
          <li>• Column headers marked as headings (h3)</li>
          <li>• Product links include descriptions</li>
          <li>• Icon-only elements have sr-only labels</li>
          <li>• Navigation landmark properly labeled</li>
        </ul>
      </div>

      {/* Test Coverage */}
      <div className="rounded-lg border-2 border-success-500 bg-success-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-success-900">✓ Test Coverage</h3>
        <div className="grid gap-3 text-sm text-success-800 md:grid-cols-2">
          <div>
            <strong>Automated (jest-axe):</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• 29 accessibility tests passing</li>
              <li>• Color contrast verified</li>
              <li>• ARIA attributes validated</li>
              <li>• Focus indicators present</li>
            </ul>
          </div>
          <div>
            <strong>Manual Testing:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Keyboard navigation verified</li>
              <li>• Screen reader tested (NVDA)</li>
              <li>• Mobile touch targets (44px)</li>
              <li>• Color blindness simulation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Story: Implementation Notes
export const Implementation: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-950">Implementation Details</h2>
        <p className="text-neutral-700">Technical details and usage guidelines</p>
      </div>

      {/* Component Structure */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Component Structure</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              MegaMenu.tsx
            </code>
            <span className="ml-2 text-neutral-700">Main navigation container</span>
          </div>
          <div>
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              MegaMenuItem.tsx
            </code>
            <span className="ml-2 text-neutral-700">Individual menu item with dropdown</span>
          </div>
          <div>
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              config.ts
            </code>
            <span className="ml-2 text-neutral-700">Menu structure and translations</span>
          </div>
          <div>
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              useMegaMenu.ts
            </code>
            <span className="ml-2 text-neutral-700">State management hook</span>
          </div>
          <div>
            <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
              useOutsideClick.ts
            </code>
            <span className="ml-2 text-neutral-700">Outside click detection</span>
          </div>
        </div>
      </div>

      {/* Hover Intent Timing */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Hover Intent Timing</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-32 text-sm font-semibold text-neutral-900">Open Delay:</div>
            <code className="rounded bg-primary-100 px-3 py-1 text-primary-900">80ms</code>
            <span className="text-sm text-neutral-700">Prevents accidental opens</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 text-sm font-semibold text-neutral-900">Close Delay:</div>
            <code className="rounded bg-primary-100 px-3 py-1 text-primary-900">140ms</code>
            <span className="text-sm text-neutral-700">Allows diagonal mouse movement</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 text-sm font-semibold text-neutral-900">Animation:</div>
            <code className="rounded bg-primary-100 px-3 py-1 text-primary-900">300ms</code>
            <span className="text-sm text-neutral-700">Smooth expand/collapse</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Responsive Grid Layout</h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <strong>Main Content (9/12 columns):</strong>
          </div>
          <ul className="ml-4 space-y-1">
            <li>• Mobile: 1 column (stacked)</li>
            <li>• Tablet (sm): 2 columns</li>
            <li>• Desktop (lg): 3 columns</li>
            <li>• Wide (xl): 4 columns (8 categories = 2 rows)</li>
          </ul>
          <div className="mt-3">
            <strong>Sidebar (3/12 columns):</strong>
          </div>
          <ul className="ml-4 space-y-1">
            <li>• Featured product showcase</li>
            <li>• Quick action buttons</li>
            <li>• Help text and CTAs</li>
          </ul>
        </div>
      </div>

      {/* Performance */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Performance</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>
            • <strong>Icons:</strong> WebP format (50% smaller than PNG)
          </li>
          <li>
            • <strong>Images:</strong> Next.js Image component with optimization
          </li>
          <li>
            • <strong>Translations:</strong> next-intl with message loading
          </li>
          <li>
            • <strong>State:</strong> Single hook managing all menu state
          </li>
          <li>
            • <strong>Render:</strong> Only open menu panel is rendered in DOM
          </li>
        </ul>
      </div>

      {/* File Paths */}
      <div className="rounded-lg bg-neutral-900 p-4">
        <h4 className="mb-3 text-sm font-semibold text-white">Component Files</h4>
        <div className="space-y-1 text-xs">
          <div className="text-neutral-300">
            web/src/components/layout/Header/components/MegaMenu.tsx
          </div>
          <div className="text-neutral-300">
            web/src/components/layout/Header/components/MegaMenuItem.tsx
          </div>
          <div className="text-neutral-300">web/src/components/layout/Header/config.ts</div>
          <div className="text-neutral-300">web/src/components/layout/Header/types.ts</div>
          <div className="text-neutral-300">
            web/src/components/layout/Header/hooks/useMegaMenu.ts
          </div>
        </div>
      </div>
    </div>
  ),
};
