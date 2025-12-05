"use client";
import React from 'react';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  partNumber?: string;
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
      <h2 className="text-lg font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white hover:shadow flex flex-col h-full">
            {product.image && (
              <img src={product.image.sourceUrl} alt={product.image.altText || product.name} className="w-full h-24 object-contain mb-2" />
            )}
            <div className="text-sm font-medium text-neutral-900 mb-1">{product.name}</div>
            {product.partNumber && (
              <div className="text-xs text-neutral-500 mb-1">Part #: {product.partNumber}</div>
            )}
            {product.price && (
              <div className="text-xs font-semibold text-primary-700 mb-2">{product.price}</div>
            )}
            <div className="mt-auto flex gap-2">
              <a href={`/products/${product.slug}`} className="bg-neutral-100 text-primary-700 px-3 py-1 rounded text-xs font-semibold hover:bg-primary-50 transition" aria-label={`View ${product.name}`}>View</a>
              <button className="bg-primary-700 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-primary-800 transition" aria-label={`Add ${product.name} to Job Estimate`}>Add to Job Estimate</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
