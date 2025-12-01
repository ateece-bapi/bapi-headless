"use client";

import React, { useMemo, useState } from 'react';
import { AddToCartButton } from '@/components/cart';
import type { CartItem } from '@/store';

interface Variation {
  id: string;
  databaseId: number;
  name: string;
  price?: string | null;
}

interface ImageShape {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductForClient {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  stockStatus?: string | null;
  image?: ImageShape | null;
  gallery?: ImageShape[];
  variations?: Variation[];
}

export default function ProductDetailClient({ product }: { product: ProductForClient }) {
  const { variations = [] } = product;
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(
    variations.length > 0 ? variations[0].databaseId : null
  );

  const selectedVariation = useMemo(() => variations.find((v) => v.databaseId === selectedVariationId) ?? null, [variations, selectedVariationId]);

  const cartProduct: Omit<CartItem, 'quantity'> = {
    id: selectedVariation ? `${product.id}::${selectedVariation.databaseId}` : product.id,
    databaseId: selectedVariation ? selectedVariation.databaseId : product.databaseId,
    name: selectedVariation ? selectedVariation.name : product.name,
    slug: product.slug,
    price: selectedVariation && selectedVariation.price ? selectedVariation.price : product.price,
    image: product.image ? { sourceUrl: product.image.sourceUrl, altText: product.image.altText ?? undefined } : null,
    variationId: selectedVariation ? selectedVariation.databaseId : undefined,
    variationName: selectedVariation ? selectedVariation.name : undefined,
  };

  return (
    <div className="space-y-4">
      {variations.length > 0 && (
        <div className="flex items-center gap-4">
          <label htmlFor="variation" className="font-medium">Variant</label>
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
        </div>
      )}

      <div className="flex gap-4 items-center">
        <AddToCartButton product={cartProduct} className="inline-block" />
        <div className="text-sm text-neutral-600">{product.stockStatus ? product.stockStatus : ''}</div>
      </div>
    </div>
  );
}
