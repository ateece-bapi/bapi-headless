'use client';
import React, { useState } from 'react';

interface Variation {
  id: string;
  name?: string;
  price?: string | null;
  regularPrice?: string | null;
  attributes: Record<string, string>;
  partNumber?: string | null;
  sku?: string | null;
}

interface AttributeOption {
  name: string;
  options: string[];
}

interface ProductConfiguratorProps {
  product: {
    attributes?: AttributeOption[];
    variations?: Variation[];
    price?: string | null;
    regularPrice?: string | null;
  };
  onVariationChange?: (variation: Variation | null) => void;
}

export default function ProductConfigurator({
  product,
  onVariationChange,
}: ProductConfiguratorProps) {
  const { attributes = [], variations = [], price, regularPrice } = product;
  // Build initial state for each attribute
  const initialSelections = attributes.reduce<Record<string, string>>((acc, attr) => {
    acc[attr.name] = attr.options[0] || '';
    return acc;
  }, {});
  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);

  // Find matching variation
  const selectedVariation = variations.find((v) => {
    return Object.entries(selections).every(([name, value]) => v.attributes[name] === value);
  });

  React.useEffect(() => {
    if (onVariationChange) {
      onVariationChange(selectedVariation || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariation]);

  // Hide selectors if no variations
  const showSelectors = variations.length > 0 && attributes.length > 0;
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-lg font-semibold">Configure Product</h2>
      {showSelectors ? (
        <form className="mb-4 flex flex-col gap-4">
          {attributes.map((attr) => (
            <div key={attr.name} className="flex flex-col gap-2 md:flex-row md:items-center">
              <label htmlFor={`attr-${attr.name}`} className="min-w-[120px] font-medium">
                {attr.name}
              </label>
              <select
                id={`attr-${attr.name}`}
                value={selections[attr.name]}
                onChange={(e) => setSelections({ ...selections, [attr.name]: e.target.value })}
                className="rounded border bg-white px-3 py-2"
              >
                {attr.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </form>
      ) : (
        <div className="rounded bg-neutral-100 p-4 text-neutral-500">
          No configuration options available.
        </div>
      )}
      {selectedVariation && (
        <div className="mt-4">
          <div className="text-xs text-neutral-500">Variation Part Number</div>
          <div className="text-lg font-medium text-neutral-900">
            {selectedVariation.partNumber || selectedVariation.sku || 'N/A'}
          </div>
        </div>
      )}
      {/* Price and action now in summary card */}
    </section>
  );
}
