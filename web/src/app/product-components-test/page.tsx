'use client';

import React from 'react';
import {
  ProductGallery,
  QuantitySelector,
  ProductAvailability,
  ProductSpecifications,
  type SpecificationGroup,
  type GalleryImage,
} from '@/components/products';

// Sample data for testing
const sampleImages: GalleryImage[] = [
  {
    sourceUrl:
      'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_ZLDS-700x700.jpg',
    altText: 'Building Automation Sensor - Main View',
  },
  {
    sourceUrl:
      'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_Multisensor-700x700.jpg',
    altText: 'Building Automation Sensor - Side View',
  },
  {
    sourceUrl:
      'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_I-O-Controller-700x700.jpg',
    altText: 'Building Automation Sensor - Detail View',
  },
  {
    sourceUrl:
      'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_Current-Sensor-700x700.jpg',
    altText: 'Building Automation Sensor - Installation',
  },
];

const sampleSpecifications: SpecificationGroup[] = [
  {
    title: 'Technical Specifications',
    specs: [
      { label: 'Temperature Range', value: '-40°F to 185°F (-40°C to 85°C)' },
      { label: 'Accuracy', value: '±0.36°F (±0.2°C)' },
      { label: 'Output Signal', value: '4-20mA, 0-5V, 0-10V' },
      { label: 'Power Supply', value: '24VAC/VDC' },
      { label: 'Response Time', value: '<30 seconds' },
    ],
  },
  {
    title: 'Physical Specifications',
    specs: [
      { label: 'Dimensions', value: '4.5" x 2.8" x 1.2" (114 x 71 x 30 mm)' },
      { label: 'Weight', value: '0.3 lbs (136 g)' },
      { label: 'Material', value: 'ABS Plastic' },
      { label: 'Color', value: 'White' },
      { label: 'Mounting', value: 'Wall mount or duct mount' },
    ],
  },
  {
    title: 'Environmental Specifications',
    specs: [
      { label: 'Operating Humidity', value: '0-95% RH non-condensing' },
      { label: 'Storage Temperature', value: '-40°F to 185°F (-40°C to 85°C)' },
      { label: 'IP Rating', value: 'IP30' },
      { label: 'Certifications', value: 'CE, UL, RoHS compliant' },
    ],
  },
  {
    title: 'Communication Specifications',
    specs: [
      { label: 'Protocol', value: 'BACnet MS/TP, Modbus RTU' },
      { label: 'Baud Rate', value: '9600, 19200, 38400, 76800 bps' },
      { label: 'Address Range', value: '0-127' },
      { label: 'Cable Type', value: 'Shielded twisted pair' },
    ],
  },
];

export default function ProductComponentsTestPage() {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-content space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-neutral-900">Product Components Demo</h1>
          <p className="text-xl text-neutral-600">
            Phase 1: Enhanced product pages with professional UX
          </p>
        </div>

        {/* Product Gallery Demo */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">
            1. Product Gallery with Lightbox
          </h2>
          <p className="mb-8 text-neutral-600">
            Interactive gallery with zoom, keyboard navigation (arrow keys, ESC), and touch gestures
            for mobile.
          </p>
          <div className="mx-auto max-w-2xl">
            <ProductGallery images={sampleImages} productName="Building Automation Sensor" />
          </div>
        </section>

        {/* Quantity Selector Demo */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">
            2. Quantity Selector with Validation
          </h2>
          <p className="mb-8 text-neutral-600">
            Increment/decrement buttons with min/max limits, manual input, and stock validation.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Normal state */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Normal (In Stock)</h3>
              <QuantitySelector
                initialQuantity={quantity}
                min={1}
                max={50}
                onChange={setQuantity}
                stockStatus="instock"
              />
              <p className="mt-2 text-sm text-neutral-600">Current quantity: {quantity}</p>
            </div>

            {/* Low stock state */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Low Stock (Max 5)</h3>
              <QuantitySelector
                initialQuantity={1}
                min={1}
                max={5}
                onChange={(q) => console.log('Low stock quantity:', q)}
                stockStatus="instock"
              />
            </div>

            {/* Loading state */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Loading State</h3>
              <QuantitySelector
                initialQuantity={1}
                onChange={(q) => console.log('Loading quantity:', q)}
                loading={true}
              />
            </div>

            {/* Out of stock */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Out of Stock</h3>
              <QuantitySelector
                initialQuantity={0}
                onChange={(q) => console.log('Out of stock quantity:', q)}
                stockStatus="outofstock"
              />
            </div>
          </div>
        </section>

        {/* Product Availability Demo */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">
            3. Product Availability Indicators
          </h2>
          <p className="mb-8 text-neutral-600">
            Visual stock status indicators with colors, icons, and messaging.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* In Stock */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">In Stock</h3>
              <ProductAvailability stockStatus="instock" stockQuantity={150} detailed={true} />
            </div>

            {/* Low Stock */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Low Stock</h3>
              <ProductAvailability stockStatus="instock" stockQuantity={7} detailed={true} />
            </div>

            {/* Out of Stock */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Out of Stock</h3>
              <ProductAvailability stockStatus="outofstock" restockDate="2026-02-15" />
            </div>

            {/* On Backorder */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">On Backorder</h3>
              <ProductAvailability stockStatus="onbackorder" restockDate="2026-01-25" />
            </div>
          </div>
        </section>

        {/* Product Specifications Demo */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">
            4. Product Specifications Table
          </h2>
          <p className="mb-8 text-neutral-600">
            Professional specifications table with collapsible sections, search, and download
            functionality.
          </p>
          <ProductSpecifications
            specifications={sampleSpecifications}
            productName="Building Automation Sensor"
            searchable={true}
            downloadable={true}
          />
        </section>

        {/* Summary */}
        <section className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900">✅ Phase 1 Progress</h2>
          <div className="grid grid-cols-1 gap-4 text-neutral-700 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-success-600">✓</span>
              <span>Enhanced image gallery with lightbox and zoom</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-success-600">✓</span>
              <span>Quantity selector with validation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-success-600">✓</span>
              <span>Product availability indicators</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-success-600">✓</span>
              <span>Professional specifications table</span>
            </div>
          </div>

          <div className="mt-6 border-t border-primary-200 pt-6">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">Next Steps:</h3>
            <ul className="space-y-1 text-neutral-700">
              <li>• Enhance AddToCartButton with loading states and toast notifications</li>
              <li>• Integrate components into actual product detail pages</li>
              <li>• Backend cart integration with WooCommerce</li>
              <li>• Recently viewed products tracking</li>
              <li>• Product variations UI implementation</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
