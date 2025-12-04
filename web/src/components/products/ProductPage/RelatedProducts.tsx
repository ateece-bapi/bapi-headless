import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image?: { sourceUrl: string; altText?: string } | null;
  price?: string;
}

interface RelatedProductsProps {
  related: RelatedProduct[];
}

export default function RelatedProducts({ related }: RelatedProductsProps) {
  if (!related || related.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-neutral-900">Related Products</h2>
      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
        {related.map(product => (
          <div key={product.id} className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center">
            <Link href={`/products/${product.slug}`} className="block w-full mb-4 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-xl">
              {product.image ? (
                <Image
                  src={product.image.sourceUrl}
                  alt={product.image.altText || product.name}
                  width={180}
                  height={120}
                  className="object-contain w-full h-32 bg-neutral-50 rounded-xl"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-neutral-100 rounded-xl text-neutral-400">No image</div>
              )}
            </Link>
            <h3 className="text-lg font-semibold text-center mb-2">
              <Link href={`/products/${product.slug}`} className="focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-xl">{product.name}</Link>
            </h3>
            {product.price && <div className="text-primary-700 font-bold mb-2">{product.price}</div>}
            <Link href={`/products/${product.slug}`} className="mt-auto bg-primary-700 text-white px-5 py-2 rounded-xl font-semibold hover:bg-primary-800 transition shadow focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm w-full text-center">View Product</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
