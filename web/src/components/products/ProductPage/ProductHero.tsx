import React from 'react';

interface ProductHeroProps {
  product: {
    name: string;
    image?: { sourceUrl: string; altText?: string } | null;
    price?: string | null;
  };
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 mb-8">
      {product.image && (
        <img
          src={product.image.sourceUrl}
          alt={product.image.altText || product.name}
          className="w-64 h-64 object-contain bg-neutral-50 rounded-xl shadow"
        />
      )}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">{product.name}</h1>
        {product.price && (
          <div className="text-xl font-semibold text-primary-700 mb-4">{product.price}</div>
        )}
      </div>
    </section>
  );
}
