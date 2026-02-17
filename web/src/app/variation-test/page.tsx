'use client';

import ProductVariationSelector from '@/components/products/ProductVariationSelector';

// Sample product data with variations
const sampleProduct = {
  id: 'test-product-1',
  name: 'BAPI Temperature Sensor',
  slug: 'bapi-temperature-sensor',
  price: '$125.00',
  regularPrice: '$150.00',
  attributes: [
    {
      name: 'Sensor Type',
      options: ['Thermistor', 'RTD', 'Thermocouple'],
    },
    {
      name: 'Output Signal',
      options: ['4-20mA', '0-10V', 'Digital'],
    },
    {
      name: 'Housing',
      options: ['Standard', 'Weatherproof', 'Explosion Proof'],
    },
  ],
  variations: [
    // Thermistor variations
    {
      id: 'var-1',
      databaseId: 1001,
      name: 'Thermistor / 4-20mA / Standard',
      price: '$125.00',
      regularPrice: '$150.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 50,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': '4-20mA',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-T-420-STD',
      sku: 'BA-TS-T-420-STD',
    },
    {
      id: 'var-2',
      databaseId: 1002,
      name: 'Thermistor / 4-20mA / Weatherproof',
      price: '$165.00',
      regularPrice: '$190.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 25,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': '4-20mA',
        Housing: 'Weatherproof',
      },
      partNumber: 'BA-TS-T-420-WP',
      sku: 'BA-TS-T-420-WP',
    },
    {
      id: 'var-3',
      databaseId: 1003,
      name: 'Thermistor / 4-20mA / Explosion Proof',
      price: '$285.00',
      regularPrice: '$320.00',
      stockStatus: 'ON_BACKORDER' as const,
      stockQuantity: 0,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': '4-20mA',
        Housing: 'Explosion Proof',
      },
      partNumber: 'BA-TS-T-420-EP',
      sku: 'BA-TS-T-420-EP',
    },
    {
      id: 'var-4',
      databaseId: 1004,
      name: 'Thermistor / 0-10V / Standard',
      price: '$135.00',
      regularPrice: '$160.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 40,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': '0-10V',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-T-010-STD',
      sku: 'BA-TS-T-010-STD',
    },
    {
      id: 'var-5',
      databaseId: 1005,
      name: 'Thermistor / 0-10V / Weatherproof',
      price: '$175.00',
      regularPrice: '$200.00',
      stockStatus: 'OUT_OF_STOCK' as const,
      stockQuantity: 0,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': '0-10V',
        Housing: 'Weatherproof',
      },
      partNumber: 'BA-TS-T-010-WP',
      sku: 'BA-TS-T-010-WP',
    },
    {
      id: 'var-6',
      databaseId: 1006,
      name: 'Thermistor / Digital / Standard',
      price: '$145.00',
      regularPrice: '$170.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 30,
      attributes: {
        'Sensor Type': 'Thermistor',
        'Output Signal': 'Digital',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-T-DIG-STD',
      sku: 'BA-TS-T-DIG-STD',
    },
    // RTD variations
    {
      id: 'var-7',
      databaseId: 1007,
      name: 'RTD / 4-20mA / Standard',
      price: '$185.00',
      regularPrice: '$210.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 20,
      attributes: {
        'Sensor Type': 'RTD',
        'Output Signal': '4-20mA',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-R-420-STD',
      sku: 'BA-TS-R-420-STD',
    },
    {
      id: 'var-8',
      databaseId: 1008,
      name: 'RTD / 4-20mA / Weatherproof',
      price: '$225.00',
      regularPrice: '$250.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 15,
      attributes: {
        'Sensor Type': 'RTD',
        'Output Signal': '4-20mA',
        Housing: 'Weatherproof',
      },
      partNumber: 'BA-TS-R-420-WP',
      sku: 'BA-TS-R-420-WP',
    },
    {
      id: 'var-9',
      databaseId: 1009,
      name: 'RTD / 0-10V / Standard',
      price: '$195.00',
      regularPrice: '$220.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 25,
      attributes: {
        'Sensor Type': 'RTD',
        'Output Signal': '0-10V',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-R-010-STD',
      sku: 'BA-TS-R-010-STD',
    },
    // Thermocouple variations (limited stock)
    {
      id: 'var-10',
      databaseId: 1010,
      name: 'Thermocouple / 4-20mA / Standard',
      price: '$165.00',
      regularPrice: '$190.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 10,
      attributes: {
        'Sensor Type': 'Thermocouple',
        'Output Signal': '4-20mA',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-TC-420-STD',
      sku: 'BA-TS-TC-420-STD',
    },
    {
      id: 'var-11',
      databaseId: 1011,
      name: 'Thermocouple / 0-10V / Standard',
      price: '$175.00',
      regularPrice: '$200.00',
      stockStatus: 'OUT_OF_STOCK' as const,
      stockQuantity: 0,
      attributes: {
        'Sensor Type': 'Thermocouple',
        'Output Signal': '0-10V',
        Housing: 'Standard',
      },
      partNumber: 'BA-TS-TC-010-STD',
      sku: 'BA-TS-TC-010-STD',
    },
    {
      id: 'var-12',
      databaseId: 1012,
      name: 'Thermocouple / Digital / Weatherproof',
      price: '$245.00',
      regularPrice: '$270.00',
      stockStatus: 'IN_STOCK' as const,
      stockQuantity: 5,
      attributes: {
        'Sensor Type': 'Thermocouple',
        'Output Signal': 'Digital',
        Housing: 'Weatherproof',
      },
      partNumber: 'BA-TS-TC-DIG-WP',
      sku: 'BA-TS-TC-DIG-WP',
    },
  ],
};

export default function ProductVariationTestPage() {
  const handleVariationChange = (variation: any) => {
    console.log('Selected variation:', variation);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-content px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-neutral-900">
            Product Variation Selector Test
          </h1>
          <p className="text-neutral-600">
            Enhanced UI for selecting product variations with visual feedback, stock status
            indicators, and dynamic price updates.
          </p>
        </div>

        {/* Main Demo */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">{sampleProduct.name}</h2>

          <ProductVariationSelector
            product={sampleProduct}
            onVariationChange={handleVariationChange}
          />

          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Features Demonstrated:</h3>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Visual Button Selection:</strong> Click buttons instead of dropdowns for
                  better UX
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Stock Status Indicators:</strong> See what&apos;s in stock, backordered, or
                  unavailable
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Dynamic Price Updates:</strong> Prices change as you select different
                  options
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Disabled State:</strong> Out-of-stock options are clearly marked and
                  disabled
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Selected Variation Details:</strong> Part number, price, and availability
                  displayed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-500">✓</span>
                <span>
                  <strong>Keyboard Accessible:</strong> Full keyboard navigation and screen reader
                  support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Variation Matrix Table */}
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
            Variation Matrix ({sampleProduct.variations.length} total)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                    Part Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                    Sensor Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Output</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Housing</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Stock</th>
                </tr>
              </thead>
              <tbody>
                {sampleProduct.variations.map((variation, index) => (
                  <tr
                    key={variation.id}
                    className={`border-b border-neutral-100 ${
                      index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{variation.partNumber}</td>
                    <td className="px-4 py-3">{variation.attributes['Sensor Type']}</td>
                    <td className="px-4 py-3">{variation.attributes['Output Signal']}</td>
                    <td className="px-4 py-3">{variation.attributes['Housing']}</td>
                    <td className="px-4 py-3 font-semibold text-primary-700">{variation.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                          variation.stockStatus === 'IN_STOCK'
                            ? 'bg-success-100 text-success-700'
                            : variation.stockStatus === 'ON_BACKORDER'
                              ? 'bg-warning-100 text-warning-700'
                              : 'bg-error-100 text-error-700'
                        } `}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            variation.stockStatus === 'IN_STOCK'
                              ? 'bg-success-500'
                              : variation.stockStatus === 'ON_BACKORDER'
                                ? 'bg-warning-500'
                                : 'bg-error-500'
                          } `}
                        />
                        {variation.stockStatus === 'IN_STOCK'
                          ? `${variation.stockQuantity} in stock`
                          : variation.stockStatus === 'ON_BACKORDER'
                            ? 'Backorder'
                            : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-8 rounded-xl bg-neutral-900 p-8 text-white shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Usage Example</h2>
          <pre className="overflow-x-auto rounded-lg bg-neutral-800 p-4 text-sm">
            {`import { ProductVariationSelector } from '@/components/products';

export default function ProductPage({ product }) {
  const handleVariationChange = (variation) => {
    console.log('Selected:', variation);
    // Update price, stock, images, etc.
  };

  return (
    <ProductVariationSelector
      product={product}
      onVariationChange={handleVariationChange}
    />
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
