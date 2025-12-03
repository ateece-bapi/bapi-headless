"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AddToCartButton } from '@/components/cart';
import { useProductAttributes } from './useProductAttributes';
import type { CartItem } from '@/store';
import { useCart as defaultUseCart, useCartDrawer as defaultUseCartDrawer } from '@/store';

/**
 * Product variation (e.g., size/color option)
 */
export interface Variation {
  id: string;
  databaseId: number;
  name: string;
  price?: string | null;
  attributes?: Record<string, string>;
  image?: ImageShape | null;
}

/**
 * Image shape for product and variations
 */
export interface ImageShape {
  sourceUrl: string;
  altText?: string | null;
}

/**
 * Product data for client-side rendering
 */
export interface ProductForClient {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  stockStatus?: string | null;
  image?: ImageShape | null;
  gallery?: ImageShape[];
  variations?: Variation[];
  attributes?: Array<{ name: string; options: string[] }>;
  shortDescription?: string | null;
  description?: string | null;
}

/**
 * Product detail component for displaying product info, variations, and cart actions.
 *
 * @param product Product data to display
 * @param useCart Optional custom cart hook
 * @param useCartDrawer Optional custom cart drawer hook
 */
export default function ProductDetailClient({
  product,
  useCart = defaultUseCart,
  useCartDrawer = defaultUseCartDrawer,
}: {
  product: ProductForClient;
  useCart?: typeof defaultUseCart;
  useCartDrawer?: typeof defaultUseCartDrawer;
}) {
  const { variations = [], attributes = [] } = product;

  // Use custom hook for attribute selection and matching
  const {
    attributeSelection,
    setAttributeSelection,
    selectedVariation,
  } = useProductAttributes(attributes, variations);

  // Gallery state: index into gallery or -1 for the main image
  const gallery = product.gallery || [];
  const initialIndex = gallery.length > 0 ? 0 : -1;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    product.image ? -1 : initialIndex
  );

  const cartProduct: Omit<CartItem, 'quantity'> = {
    id: selectedVariation ? `${product.id}::${selectedVariation.databaseId}` : product.id,
    databaseId: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation ? selectedVariation.name : product.name,
    slug: product.slug,
    price: selectedVariation && selectedVariation.price ? selectedVariation.price : product.price,
    // Resolve the image to send to cart in a small helper so TypeScript can
    // properly narrow nullable values and we avoid nested ternaries.
    image: (() => {
      if (selectedImageIndex === -1) {
        const img = selectedVariation?.image ?? product.image;
        return img ? { sourceUrl: img.sourceUrl, altText: img.altText ?? undefined } : null;
      }
      const galleryImg = gallery[selectedImageIndex];
      if (galleryImg) return { sourceUrl: galleryImg.sourceUrl, altText: galleryImg.altText ?? undefined };
      const fallback = selectedVariation?.image ?? product.image;
      return fallback ? { sourceUrl: fallback.sourceUrl, altText: fallback.altText ?? undefined } : null;
    })(),
    variationId: selectedVariation ? selectedVariation.databaseId : undefined,
    variationName: selectedVariation ? selectedVariation.name : undefined,
  };

  const mainImage = (() => {
    if (selectedImageIndex === -1) return selectedVariation?.image ?? product.image ?? null;
    return gallery[selectedImageIndex] ?? selectedVariation?.image ?? product.image ?? null;
  })();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Images */}
      <div className="lg:col-span-1">
        <div className="w-full h-[420px] relative rounded mb-4 bg-neutral-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.sourceUrl}
              alt={mainImage.altText || product.name}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 33vw, 100vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">No image</div>
          )}
        </div>

        {gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`w-full h-20 relative rounded overflow-hidden border ${selectedImageIndex === i ? 'ring-2 ring-primary-400' : ''}`}
                aria-label={`Show image ${i + 1}`}
              >
                <Image src={g.sourceUrl} alt={g.altText || `${product.name} ${i + 1}`} width={160} height={80} className="object-cover" />
              </button>
            ))}
            {product.image && (
              <button
                onClick={() => setSelectedImageIndex(-1)}
                className={`w-full h-20 relative rounded overflow-hidden border ${selectedImageIndex === -1 ? 'ring-2 ring-primary-400' : ''}`}
                aria-label="Show main image"
              >
                <Image
                  src={product.image.sourceUrl}
                  alt={product.image.altText || product.name}
                  width={160}
                  height={80}
                  className="object-cover"
                />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info & actions */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
        <p className="text-lg text-primary-500 font-semibold mb-4">{product.price}</p>

        {product.shortDescription && (
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
        )}

        {variations.length > 0 && (
          <div className="mb-4">
            {/* If attributes are present, render attribute selectors */}
            {attributes.length > 0 ? (
              <div className="space-y-3">
                {attributes.map((attr) => (
                  <div key={attr.name}>
                    <label htmlFor={attr.name} className="font-medium block mb-2">{attr.name}</label>
                    <select
                      id={attr.name}
                      value={attributeSelection[attr.name] ?? ''}
                      onChange={(e) => setAttributeSelection((s) => ({ ...s, [attr.name]: e.target.value }))}
                      className="border border-neutral-200 rounded px-3 py-2"
                    >
                      {attr.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <label htmlFor="variation" className="font-medium block mb-2">Variant</label>
                <select
                  id="variation"
                  value={selectedVariationId ?? ''}
                  onChange={(e) => setSelectedVariationId(Number(e.target.value) || null)}
                  className="border border-neutral-200 rounded px-3 py-2"
                >
                  {variations.map((v) => (
                    <option key={v.id} value={v.databaseId}>
                      {v.name} {v.price ? ` — ${v.price}` : ''}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <AddToCartButton
            product={cartProduct}
            className="inline-block"
            useCart={useCart}
            useCartDrawer={useCartDrawer}
            disabled={product.stockStatus !== 'IN_STOCK'}
          />
          <div className="text-sm text-neutral-600">{product.stockStatus ?? ''}</div>
        </div>

        <section className="mt-8 prose max-w-none">
          <h2>Description</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description || '<p>No description</p>' }} />
        </section>
      </div>
    </div>
  );
}
