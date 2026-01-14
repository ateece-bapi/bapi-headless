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
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_ZLDS-700x700.jpg',
    altText: 'Building Automation Sensor - Main View',
  },
  {
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_Multisensor-700x700.jpg',
    altText: 'Building Automation Sensor - Side View',
  },
  {
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_I-O-Controller-700x700.jpg',
    altText: 'Building Automation Sensor - Detail View',
  },
  {
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/10/BA_Current-Sensor-700x700.jpg',
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
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Product Components Demo
          </h1>
          <p className="text-xl text-neutral-600">
            Phase 1: Enhanced product pages with professional UX
          </p>
        </div>
        
        {/* Product Gallery Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            1. Product Gallery with Lightbox
          </h2>
          <p className="text-neutral-600 mb-8">
            Interactive gallery with zoom, keyboard navigation (arrow keys, ESC), 
            and touch gestures for mobile.
          </p>
          <div className="max-w-2xl mx-auto">
            <ProductGallery
              images={sampleImages}
              productName="Building Automation Sensor"
            />
          </div>
        </section>
        
        {/* Quantity Selector Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            2. Quantity Selector with Validation
          </h2>
          <p className="text-neutral-600 mb-8">
            Increment/decrement buttons with min/max limits, manual input, 
            and stock validation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Normal state */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Normal (In Stock)
              </h3>
              <QuantitySelector
                initialQuantity={quantity}
                min={1}
                max={50}
                onChange={setQuantity}
                stockStatus="instock"
              />
              <p className="mt-2 text-sm text-neutral-600">
                Current quantity: {quantity}
              </p>
            </div>
            
            {/* Low stock state */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Low Stock (Max 5)
              </h3>
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
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Loading State
              </h3>
              <QuantitySelector
                initialQuantity={1}
                onChange={(q) => console.log('Loading quantity:', q)}
                loading={true}
              />
            </div>
            
            {/* Out of stock */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Out of Stock
              </h3>
              <QuantitySelector
                initialQuantity={0}
                onChange={(q) => console.log('Out of stock quantity:', q)}
                stockStatus="outofstock"
              />
            </div>
          </div>
        </section>
        
        {/* Product Availability Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            3. Product Availability Indicators
          </h2>
          <p className="text-neutral-600 mb-8">
            Visual stock status indicators with colors, icons, and messaging.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* In Stock */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                In Stock
              </h3>
              <ProductAvailability
                stockStatus="instock"
                stockQuantity={150}
                detailed={true}
              />
            </div>
            
            {/* Low Stock */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Low Stock
              </h3>
              <ProductAvailability
                stockStatus="instock"
                stockQuantity={7}
                detailed={true}
              />
            </div>
            
            {/* Out of Stock */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Out of Stock
              </h3>
              <ProductAvailability
                stockStatus="outofstock"
                restockDate="2026-02-15"
              />
            </div>
            
            {/* On Backorder */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                On Backorder
              </h3>
              <ProductAvailability
                stockStatus="onbackorder"
                restockDate="2026-01-25"
              />
            </div>
          </div>
        </section>
        
        {/* Product Specifications Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            4. Product Specifications Table
          </h2>
          <p className="text-neutral-600 mb-8">
            Professional specifications table with collapsible sections, search, 
            and download functionality.
          </p>
          <ProductSpecifications
            specifications={sampleSpecifications}
            productName="Building Automation Sensor"
            searchable={true}
            downloadable={true}
          />
        </section>
        
        {/* Summary */}
        <section className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            ✅ Phase 1 Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700">
            <div className="flex items-start gap-2">
              <span className="text-success-600 font-bold">✓</span>
              <span>Enhanced image gallery with lightbox and zoom</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success-600 font-bold">✓</span>
              <span>Quantity selector with validation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success-600 font-bold">✓</span>
              <span>Product availability indicators</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success-600 font-bold">✓</span>
              <span>Professional specifications table</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-primary-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Next Steps:
            </h3>
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
