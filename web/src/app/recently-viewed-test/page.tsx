'use client';

import { useState } from 'react';
import RecentlyViewed from '@/components/products/RecentlyViewed';
import { useRecentlyViewed } from '@/store/recentlyViewed';
import type { RecentlyViewedProduct } from '@/store/recentlyViewed';

// Sample products for testing
const sampleProducts: Omit<RecentlyViewedProduct, 'viewedAt'>[] = [
  {
    id: 'prod-1',
    databaseId: 1,
    name: 'Temperature Sensor - Model TS100',
    slug: 'temperature-sensor-ts100',
    price: '$89.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/1479BC/FFFFFF?text=TS100',
      altText: 'Temperature Sensor',
    },
  },
  {
    id: 'prod-2',
    databaseId: 2,
    name: 'Humidity Sensor - Model HS200',
    slug: 'humidity-sensor-hs200',
    price: '$129.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/FFC843/000000?text=HS200',
      altText: 'Humidity Sensor',
    },
  },
  {
    id: 'prod-3',
    databaseId: 3,
    name: 'Pressure Transducer - Model PT300',
    slug: 'pressure-transducer-pt300',
    price: '$199.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/97999B/FFFFFF?text=PT300',
      altText: 'Pressure Transducer',
    },
  },
  {
    id: 'prod-4',
    databaseId: 4,
    name: 'CO2 Sensor - Model CO400',
    slug: 'co2-sensor-co400',
    price: '$249.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/1479BC/FFFFFF?text=CO400',
      altText: 'CO2 Sensor',
    },
  },
  {
    id: 'prod-5',
    databaseId: 5,
    name: 'Airflow Sensor - Model AF500',
    slug: 'airflow-sensor-af500',
    price: '$179.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/FFC843/000000?text=AF500',
      altText: 'Airflow Sensor',
    },
  },
  {
    id: 'prod-6',
    databaseId: 6,
    name: 'Water Flow Meter - Model WF600',
    slug: 'water-flow-meter-wf600',
    price: '$299.99',
    image: {
      sourceUrl: 'https://via.placeholder.com/400x300/97999B/FFFFFF?text=WF600',
      altText: 'Water Flow Meter',
    },
  },
];

export default function RecentlyViewedTestPage() {
  const { addProduct, products, clearHistory, count, isEmpty } = useRecentlyViewed();
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();

  const handleAddProduct = (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    addProduct(product);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-container px-4">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            Recently Viewed Products - Test Page
          </h1>
          <p className="text-lg text-neutral-600">
            Test the recently viewed products functionality with sample data
          </p>
        </div>

        {/* Store stats */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Store Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Products in History</p>
              <p className="text-2xl font-bold text-primary-500">{count}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Status</p>
              <p className="text-2xl font-bold text-neutral-900">{isEmpty ? 'Empty' : 'Active'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Max Capacity</p>
              <p className="text-2xl font-bold text-neutral-900">10</p>
            </div>
          </div>
        </div>

        {/* Test buttons */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Test Actions</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-neutral-600">Add Sample Products:</p>
              <div className="flex flex-wrap gap-2">
                {sampleProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="rounded-lg bg-primary-500 px-4 py-2 text-sm text-white transition-colors hover:bg-primary-600"
                  >
                    Add {product.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-neutral-600">Bulk Actions:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => sampleProducts.forEach(handleAddProduct)}
                  className="rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900 transition-colors hover:bg-accent-600"
                >
                  Add All Products
                </button>
                <button
                  onClick={clearHistory}
                  className="rounded-lg bg-error-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-error-600"
                >
                  Clear All History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exclude product test */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">Test Exclude Current Product</h2>
          <p className="mb-4 text-neutral-600">
            Simulate viewing a product page where the current product should be excluded from the
            list:
          </p>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setSelectedProduct(undefined)}
              className={`rounded-lg px-4 py-2 transition-colors ${
                !selectedProduct
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              No Exclusion
            </button>
            {products.slice(0, 3).map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  selectedProduct === product.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Exclude {product.name.split('-')[0].trim()}
              </button>
            ))}
          </div>
          {selectedProduct && (
            <p className="text-sm text-neutral-600">
              Currently excluding:{' '}
              <strong>{products.find((p) => p.id === selectedProduct)?.name}</strong>
            </p>
          )}
        </div>

        {/* Display modes */}
        <div className="space-y-8">
          {/* Full width display */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-neutral-900">
              Default Display (Full Width)
            </h2>
            <RecentlyViewed excludeProductId={selectedProduct} maxDisplay={5} />
          </div>

          {/* Compact display */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Main Content</h2>
              <p className="text-neutral-600">This would be the main product content area.</p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Compact Mode (Sidebar)</h2>
              <RecentlyViewed
                excludeProductId={selectedProduct}
                maxDisplay={3}
                compact
                showClearButton={false}
              />
            </div>
          </div>
        </div>

        {/* Raw store data */}
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            Raw Store Data (for debugging)
          </h2>
          <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
