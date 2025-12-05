import React from 'react';

interface RelatedProductsProps {
  related?: Array<{
    id: string;
    name: string;
    slug: string;
    partNumber?: string;
    image?: { sourceUrl: string; altText?: string };
  }>;
}

export default function RelatedProducts({ related }: RelatedProductsProps) {
  if (!related || related.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map(product => (
          <a key={product.id} href={`/products/${product.slug}`} className="block border rounded-lg p-4 bg-white hover:shadow">
            {product.image && (
              <img src={product.image.sourceUrl} alt={product.image.altText || product.name} className="w-full h-24 object-contain mb-2" />
            )}
            <div className="text-sm font-medium text-neutral-900">{product.name}</div>
            {product.partNumber && (
              <div className="text-xs text-neutral-500">Part #: {product.partNumber}</div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
