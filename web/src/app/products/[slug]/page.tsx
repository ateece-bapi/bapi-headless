import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/graphql';
import ProductPage from '@/components/products/ProductPage/ProductPage';
import type { Product } from '@/lib/graphql';
import {
  isSimpleProduct,
  isVariableProduct,
  isExternalProduct,
  isGroupProduct,
} from '@/lib/graphql';
import { getProductQuerySchema } from '@/lib/validation/product';

export default async function ProductDetailRoute({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    notFound();
  }
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const slug = String(resolvedParams.slug);
  const data = await getProductBySlug(slug);
  getProductQuerySchema.parse(data); // Validate shape
  const product = data.product;
  if (!product) {
    notFound();
  }
  // Import missing utilities
  // import { getProductPrice, getProductStockStatus } from '@/lib/graphql';
  // import { productSchema } from '@/lib/validation/product';
  // import { z } from 'zod';
  // Map product for client
  let price: string = '';
  let stockStatus: any = null;
  let image: { __typename?: "MediaItem"; id: string; sourceUrl: string; altText: string | null } | null = null;
  let gallery: { nodes: { __typename?: "MediaItem"; id: string; sourceUrl: string; altText: string | null; mediaDetails?: any }[] } = { nodes: [] };
  let variations: { nodes: any[] } = { nodes: [] };
  let attributes: { name: string; options: string[] }[] = [];

  if (isSimpleProduct(product) || isVariableProduct(product) || isExternalProduct(product)) {
    price = (product as any).price ?? '';
  }
  if ('stockStatus' in product) {
    stockStatus = (product as any).stockStatus ?? null;
    // If not null, ensure it's a valid enum value
    if (stockStatus && typeof stockStatus === 'string') {
      stockStatus = stockStatus.toUpperCase();
    }
  }
  if ('image' in product && product.image) {
    image = {
      __typename: "MediaItem",
      id: product.image.id ?? '',
      sourceUrl: product.image.sourceUrl || '',
      altText: product.image.altText || product.name || null,
    };
  }
  if ('galleryImages' in product && product.galleryImages?.nodes) {
    gallery.nodes = product.galleryImages.nodes.map((node: any, idx: number) => ({
      __typename: "MediaItem",
      id: node?.id ?? `gallery-${idx}`,
      sourceUrl: node?.sourceUrl ?? '',
      altText: node?.altText ?? null,
      mediaDetails: node?.mediaDetails ?? null,
    }));
  }
  if ('variations' in product && product.variations?.nodes) {
    variations.nodes = product.variations.nodes.map((v: any, idx: number) => ({
      __typename: v.__typename ?? "SimpleProductVariation",
      id: v.id ?? `variation-${idx}`,
      databaseId: v.databaseId ?? 0,
      name: v.name ?? '',
      price: v.price ?? '',
      attributes: v.attributes ?? {},
      image: v.image
        ? {
            __typename: "MediaItem",
            id: v.image.id ?? `variation-image-${idx}`,
            sourceUrl: v.image.sourceUrl ?? '',
            altText: v.image.altText ?? null,
          }
        : null,
    }));
    // Collect attribute options
    const acc: Record<string, Set<string>> = {};
    for (const v of product.variations.nodes) {
      if (v && typeof v === 'object' && 'attributes' in v && v.attributes) {
        for (const [k, val] of Object.entries(v.attributes as any)) {
          if (!acc[k]) acc[k] = new Set();
          if (typeof val === 'string') acc[k].add(val);
          else if (Array.isArray(val)) val.forEach((vv) => acc[k].add(vv));
        }
      }
    }
    // attributes = Object.entries(acc).map(([name, set]) => ({ name, options: Array.from(set) }));
  }
  const productForClient: Product = {
    ...product,
    __typename: product.__typename,
    id: product.id,
    databaseId: product.databaseId ?? 0,
    name: product.name ?? 'Product',
    slug: product.slug ?? '',
    price,
    stockStatus,
    image,
    galleryImages: gallery,
    variations,
    shortDescription: product.shortDescription || null,
    description: product.description || null,
  };

  let iosAppUrl = '';
  if ('iosAppUrl' in product && typeof product.iosAppUrl === 'string') {
    iosAppUrl = product.iosAppUrl;
  }
  let androidAppUrl = '';
  if ('androidAppUrl' in product && typeof product.androidAppUrl === 'string') {
    androidAppUrl = product.androidAppUrl;
  }

  // Related products placeholder (should be fetched or passed in)
  const relatedProducts: any[] = [];
  const appLinks = {
    iosUrl: iosAppUrl,
    androidUrl: androidAppUrl,
  };
  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <ProductPage product={productForClient} relatedProducts={relatedProducts} appLinks={appLinks} />
      </section>
      {/* Add more sections as needed, each wrapped in consistent container and spacing */}
    </>
  );
}
