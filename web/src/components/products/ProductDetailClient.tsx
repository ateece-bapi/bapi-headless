'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { AddToCartButton } from '@/components/cart';
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

export interface ProductDetailClientProps {
  product: ProductForClient;
  productId?: string;
  useCart?: typeof defaultUseCart;
  useCartDrawer?: typeof defaultUseCartDrawer;
}

/**
 * Product detail component for displaying product info, variations, and cart actions.
 *
 * @param product Product data to display
 * @param productId Database ID for fetching deferred data
 * @param useCart Optional custom cart hook
 * @param useCartDrawer Optional custom cart drawer hook
 */
export default function ProductDetailClient({
  product,
  productId,
  useCart = defaultUseCart,
  useCartDrawer = defaultUseCartDrawer,
}: ProductDetailClientProps) {
  // Runtime prop validation for critical fields
  if (!product?.id || !product?.name || product?.price == null) {
    return <div className="p-4 text-red-600">Error: Product data is missing required fields.</div>;
  }
  const { variations = [], attributes = [] } = product ?? {};

  // Attribute selection state (e.g., { Size: 'M', Color: 'Red' })
  const initialAttributeSelection = attributes.reduce<Record<string, string>>((acc, a) => {
    acc[a.name] = a.options[0] ?? '';
    return acc;
  }, {});

  const [attributeSelection, setAttributeSelection] =
    useState<Record<string, string>>(initialAttributeSelection);

  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(() => {
    if (variations.length > 0) return variations[0].databaseId;
    return null;
  });

  // Gallery state: index into gallery or -1 for the main image
  const gallery = product?.gallery ?? [];
  const initialIndex = gallery.length > 0 ? 0 : -1;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    product.image ? -1 : initialIndex
  );

  const selectedVariation = useMemo(() => {
    if (Object.keys(attributeSelection).length > 0) {
      const found = variations.find((v) => {
        if (!v?.attributes) return false;
        for (const k of Object.keys(attributeSelection)) {
          if ((v?.attributes?.[k] ?? '') !== attributeSelection[k]) return false;
        }
        return true;
      });
      if (found) return found;
    }
    return variations.find((v) => v?.databaseId === selectedVariationId) ?? null;
  }, [variations, selectedVariationId, attributeSelection]);

  const cartProduct: Omit<CartItem, 'quantity'> = {
    id: selectedVariation ? `${product.id}::${selectedVariation?.databaseId}` : product.id,
    databaseId: selectedVariation ? selectedVariation?.databaseId : product.databaseId,
    name: selectedVariation ? selectedVariation?.name : product.name,
    slug: product.slug,
    price: selectedVariation && selectedVariation?.price ? selectedVariation?.price : product.price,
    image: (() => {
      if (selectedImageIndex === -1) {
        const img = selectedVariation?.image ?? product?.image;
        return img ? { sourceUrl: img?.sourceUrl, altText: img?.altText ?? undefined } : null;
      }
      const galleryImg = gallery?.[selectedImageIndex];
      if (galleryImg)
        return { sourceUrl: galleryImg?.sourceUrl, altText: galleryImg?.altText ?? undefined };
      const fallback = selectedVariation?.image ?? product?.image;
      return fallback
        ? { sourceUrl: fallback?.sourceUrl, altText: fallback?.altText ?? undefined }
        : null;
    })(),
    variationId: selectedVariation ? selectedVariation?.databaseId : undefined,
    variationName: selectedVariation ? selectedVariation?.name : undefined,
  };

  const mainImage = (() => {
    if (selectedImageIndex === -1) return selectedVariation?.image ?? product?.image ?? null;
    return gallery?.[selectedImageIndex] ?? selectedVariation?.image ?? product?.image ?? null;
  })();

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="relative mb-4 h-[420px] w-full overflow-hidden rounded bg-neutral-100">
            {mainImage ? (
              <Image
                src={mainImage?.sourceUrl}
                alt={mainImage?.altText || product?.name}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 33vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                No image
              </div>
            )}
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-20 w-full overflow-hidden rounded border ${selectedImageIndex === i ? 'ring-2 ring-primary-400' : ''}`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <Image
                    src={g?.sourceUrl}
                    alt={g?.altText || `${product?.name} ${i + 1}`}
                    width={160}
                    height={80}
                    className="object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
              {product?.image && (
                <button
                  onClick={() => setSelectedImageIndex(-1)}
                  className={`relative h-20 w-full overflow-hidden rounded border ${selectedImageIndex === -1 ? 'ring-2 ring-primary-400' : ''}`}
                  aria-label="Show main image"
                >
                  <Image
                    src={product?.image?.sourceUrl}
                    alt={product?.image?.altText || product?.name}
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
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">{product.name}</h1>
          <p className="mb-4 text-lg font-semibold text-primary-500">{product.price}</p>

          {product.shortDescription && (
            <div
              className="prose mb-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {variations.length > 0 && (
            <div className="mb-4">
              {/* If attributes are present, render attribute selectors */}
              {attributes.length > 0 ? (
                <div className="space-y-3">
                  {attributes.map((attr) => (
                    <div key={attr.name}>
                      <label htmlFor={attr.name} className="mb-2 block font-medium">
                        {attr.name}
                      </label>
                      <select
                        id={attr.name}
                        value={attributeSelection[attr.name] ?? ''}
                        onChange={(e) =>
                          setAttributeSelection((s) => ({ ...s, [attr.name]: e.target.value }))
                        }
                        className="rounded border border-neutral-200 px-3 py-2"
                      >
                        {attr.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <label htmlFor="variation" className="mb-2 block font-medium">
                    Variant
                  </label>
                  <select
                    id="variation"
                    value={selectedVariationId ?? ''}
                    onChange={(e) => setSelectedVariationId(Number(e.target.value) || null)}
                    className="rounded border border-neutral-200 px-3 py-2"
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
              disabled={product?.stockStatus !== 'IN_STOCK'}
              aria-disabled={product?.stockStatus !== 'IN_STOCK'}
            />
            <div className="text-sm text-neutral-600" aria-live="polite">
              {product?.stockStatus ?? ''}
            </div>
          </div>

          <section className="prose mt-8 max-w-none">
            <h2>Description</h2>
            <div
              dangerouslySetInnerHTML={{ __html: product.description || '<p>No description</p>' }}
            />
          </section>
        </div>
      </div>
    </>
  );
}
