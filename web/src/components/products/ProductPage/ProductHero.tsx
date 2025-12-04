import React from 'react';
import Image from 'next/image';

interface ProductHeroProps {
  product: {
    name: string;
    subtitle?: string;
    image?: { sourceUrl: string; altText?: string } | null;
  };
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 border-b border-neutral-200 py-10 md:py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4 md:px-8">
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-3 leading-tight tracking-tight">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="text-lg md:text-xl text-primary-700 font-medium mb-4 max-w-2xl mx-auto md:mx-0">
              {product.subtitle}
            </p>
          )}
        </div>
        {product.image && (
          <div className="flex-shrink-0 w-full md:w-80 flex justify-center mb-6 md:mb-0 order-1 md:order-2">
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              width={320}
              height={320}
              className="object-contain rounded-lg shadow-lg bg-neutral-100 border border-neutral-200"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
