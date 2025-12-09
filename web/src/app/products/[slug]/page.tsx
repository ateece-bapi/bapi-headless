import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProductPrice, getProductStockStatus } from '@/lib/graphql';
import type { GetProductBySlugQuery } from '@/lib/graphql';
import { getProductQuerySchema, productSchema } from '@/lib/validation/product';
import { z } from 'zod';
import { CartDrawer } from '@/components/cart';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';
import ProductHero from '@/components/products/ProductPage/ProductHero';
import ProductConfigurator from '@/components/products/ProductPage/ProductConfigurator';
import dynamic from 'next/dynamic';
import ProductTabs from '@/components/products/ProductPage/ProductTabs';
import RelatedProducts from '@/components/products/ProductPage/RelatedProducts';
import AppLinks from '@/components/products/ProductPage/AppLinks';
import ContactInfo from '@/components/products/ProductPage/ContactInfo';
import ProductDetailClient from '@/components/products/ProductPage/ProductDetailClient';

function stripHtml(html?: string | null) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').slice(0, 160);
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return {};
  const slug = String(resolvedParams.slug);
  const data = await getProductBySlug(slug);
  const parsed = getProductQuerySchema.safeParse(data);
  if (!parsed.success) throw parsed.error;
  const product = data.product as GetProductBySlugQuery['product'] | null;
  if (!product) return {};
  const ogImage = product.image?.sourceUrl || (product.galleryImages?.nodes?.[0]?.sourceUrl ?? "");
  const ogDescription = stripHtml(product.shortDescription || product.description);
  // Dynamic title and description using real product data
  return {
    title: `${product.name} | BAPI`,
    description: ogDescription,
    openGraph: {
      title: `${product.name} | BAPI`,
      description: ogDescription,
      type: "article",
      url: `https://yourdomain.com/products/${slug}`,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | BAPI`,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/products/${slug}`,
      languages: {
        'en-US': `/en/products/${slug}`,
        'es-ES': `/es/products/${slug}`
      }
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    notFound();
  }
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const slug = String(resolvedParams.slug);
  const data = await getProductBySlug(slug);
  // The fetch layer returns normalized data; validate shape here.
  getProductQuerySchema.parse(data);
  // Use the normalized product object for client props
  // Extend the type to include relatedProducts for type safety
  type NormalizedProduct = GetProductBySlugQuery['product'] & {
    relatedProducts?: any[];
    partNumber?: string;
    sku?: string;
    multiplier?: string;
    multiplierGroups?: Array<{ id: string; name: string; slug: string }>;
    regularPrice?: string;
    stockQuantity?: number;
    iosAppUrl?: string;
    androidAppUrl?: string;
    variations?: {
      nodes: Array<any>;
    };
  };
  const product = data.product as NormalizedProduct | null;

  if (!product) {
    notFound();
  }

  // Minimal normalization for client
  const productForClient = {
    id: product.id,
    databaseId: product.databaseId ?? 0,
    name: product.name ?? 'Product',
    slug: product.slug ?? '',
    partNumber: product.partNumber ?? '',
    sku: product.sku ?? '',
    multiplierGroups: Array.isArray(product.multiplierGroups) ? product.multiplierGroups : [],
    price: getProductPrice(product) || '$0.00',
    regularPrice: product.regularPrice ?? '',
    stockStatus: getProductStockStatus(product) || null,
    stockQuantity: product.stockQuantity ?? null,
    image: product.image
      ? { sourceUrl: product.image.sourceUrl || '', altText: product.image.altText || product.name || '' }
      : null,
    gallery: ((product.galleryImages?.nodes || []) as Array<{ sourceUrl?: string; altText?: string | null }>).map((node) => {
      return { sourceUrl: node?.sourceUrl ?? '', altText: node?.altText ?? '' };
    }),
    variations: Array.isArray(product.variations?.nodes)
      ? product.variations.nodes.map((v: any) => ({
          id: v.id,
          databaseId: v.databaseId ?? 0,
          name: v.name ?? `${product.name ?? 'Product'} variant`,
          price: v.price ?? null,
          regularPrice: v.regularPrice ?? null,
          attributes: Array.isArray(v.attributes?.nodes)
            ? v.attributes.nodes.reduce((acc: Record<string, string>, a: any) => {
                if (a && a.name && a.value) acc[a.name] = a.value;
                return acc;
              }, {})
            : {},
          image: v.image ? { sourceUrl: v.image.sourceUrl ?? '', altText: v.image.altText ?? '' } : null,
          partNumber: v.partNumber ?? null,
          sku: v.sku ?? null,
        }) )
      : [],
    attributes: [], // Add attribute normalization if needed
    shortDescription: product.shortDescription || null,
    description: product.description || null,
    relatedProducts: product.relatedProducts || [],
    iosAppUrl: (product as any).iosAppUrl ?? null,
    androidAppUrl: (product as any).androidAppUrl ?? null,
  };
  return (
    <ProductDetailClient product={productForClient} />
  );
}
