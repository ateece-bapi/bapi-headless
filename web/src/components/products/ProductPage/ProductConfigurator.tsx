import React from 'react';

interface AttributeOption {
  name: string;
  options: string[];
}

interface ProductConfiguratorProps {
  product: {
    partNumber?: string;
    price?: string;
    multiplier?: string;
    attributes?: AttributeOption[];
    onAttributeChange?: (name: string, value: string) => void;
    selectedAttributes?: Record<string, string>;
    onAddToEstimate?: () => void;
    onAddToFavorites?: () => void;
  };
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  return (
    <section className="bg-white py-12 border-b border-neutral-100">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-10 items-start">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Configure Product</h2>
            <div className="h-1 w-16 bg-primary-600 rounded mb-4" />
          </div>
          {product.attributes && product.attributes.length > 0 && (
            <form className="space-y-5">
              {product.attributes.map(attr => (
                <div key={attr.name}>
                  <label className="block font-medium mb-2 text-neutral-700" htmlFor={attr.name}>{attr.name}</label>
                  <select
                    id={attr.name}
                    className="border border-neutral-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                    value={product.selectedAttributes?.[attr.name] || ''}
                    onChange={e => product.onAttributeChange?.(attr.name, e.target.value)}
                    aria-label={`Select ${attr.name}`}
                  >
                    <option value="">Choose an option</option>
                    {attr.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </form>
          )}
        </div>
        <div className="w-full md:w-96 bg-white rounded-xl p-8 shadow-lg flex flex-col gap-5 border border-neutral-200 mt-8 md:mt-0">
          <div>
            <span className="block text-sm text-neutral-500 mb-1">Part Number</span>
            <span className="font-mono text-lg text-neutral-900">{product.partNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-sm text-neutral-500 mb-1">List Price</span>
            <span className="font-semibold text-primary-700 text-2xl">{product.price || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-sm text-neutral-500 mb-1">Multiplier</span>
            <span className="font-mono text-lg text-neutral-900">{product.multiplier || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button type="button" className="bg-primary-700 text-white px-5 py-2 rounded-xl font-semibold hover:bg-primary-800 transition shadow focus:outline-none focus:ring-2 focus:ring-primary-400 w-full sm:w-auto" onClick={product.onAddToEstimate}>Add to Job Estimate</button>
            <button type="button" className="bg-neutral-200 text-neutral-800 px-5 py-2 rounded-xl font-semibold hover:bg-neutral-300 transition shadow focus:outline-none focus:ring-2 focus:ring-primary-400 w-full sm:w-auto" onClick={product.onAddToFavorites}>Add to Favorites</button>
          </div>
        </div>
      </div>
    </section>
  );
}
