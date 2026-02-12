'use client';
import React from 'react';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  partNumber?: string;
  sku?: string;
  image?: { sourceUrl: string; altText?: string };
  price?: string | null;
}

interface RelatedProductsProps {
  related?: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ related }) => {
  if (!related || related.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold">Related Products</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {related.map((product) => (
          <div
            key={product.id}
            className="flex h-full flex-col rounded-lg border bg-white p-4 hover:shadow"
          >
            {product.image && (
              <img
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                className="mb-2 h-24 w-full object-contain"
              />
            )}
            <div className="mb-1 text-sm font-medium text-neutral-900">{product.name}</div>
            <div className="mb-1 text-xs text-neutral-500">
              Part #: {product.partNumber || product.sku || 'N/A'}
            </div>
            {product.price && (
              <div className="mb-2 text-xs font-semibold text-primary-700">{product.price}</div>
            )}
            <div className="mt-auto flex gap-2">
              <a
                href={`/en/product/${product.slug}`}
                className="rounded bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
                aria-label={`View ${product.name}`}
              >
                View
              </a>
              <button
                className="rounded bg-primary-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary-800"
                aria-label={`Add ${product.name} to Job Estimate`}
              >
                Add to Job Estimate
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
