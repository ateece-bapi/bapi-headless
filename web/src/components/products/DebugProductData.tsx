'use client';

/**
 * Debug component to show product variation data
 * Temporarily add this to ProductDetailClient to see what data is being passed
 */
export default function DebugProductData({ product }: { product: any }) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="my-8 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
      <h3 className="font-bold text-lg mb-2">🔍 Debug: Product Variation Data</h3>
      <div className="space-y-2 text-sm font-mono">
        <div>
          <strong>Product ID:</strong> {product.id}
        </div>
        <div>
          <strong>Product Name:</strong> {product.name}
        </div>
        <div>
          <strong>Has Attributes:</strong> {product.attributes?.length > 0 ? `✅ ${product.attributes.length}` : '❌ No attributes'}
        </div>
        {product.attributes?.length > 0 && (
          <div className="ml-4">
            <strong>Attributes:</strong>
            <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-40">
              {JSON.stringify(product.attributes, null, 2)}
            </pre>
          </div>
        )}
        <div>
          <strong>Has Variations:</strong> {product.variations?.length > 0 ? `✅ ${product.variations.length}` : '❌ No variations'}
        </div>
        {product.variations?.length > 0 && (
          <div className="ml-4">
            <strong>Variations:</strong>
            <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-40">
              {JSON.stringify(product.variations, null, 2)}
            </pre>
          </div>
        )}
        <div className="mt-2 p-2 bg-white rounded">
          <strong>Full Product Object Keys:</strong>
          <div className="text-xs">
            {Object.keys(product).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}
