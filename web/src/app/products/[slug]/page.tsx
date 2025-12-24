import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getProductBySlug, 
  getProductPrice, 
  getProductStockStatus,
  getProductCategory,
  getProductsByCategory 
} from '@/lib/graphql';
import type { 
  GetProductBySlugQuery,
  GetProductCategoryQuery,
  GetProductsByCategoryQuery 
} from '@/lib/graphql';
import { getProductQuerySchema, productSchema } from '@/lib/validation/product';
import { z } from 'zod';
import { CartDrawer } from '@/components/cart';
import {
  Breadcrumbs,
  ProductHero,
  ProductConfigurator,
  ProductTabs,
  RelatedProducts,
  AppLinks,
  ContactInfo,
  ProductDetailClient,
  CategoryPage
} from '@/components/products';
import dynamic from 'next/dynamic';

function stripHtml(html?: string | null) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').slice(0, 160);
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return {};
  const slug = String(resolvedParams.slug);
  
  // Try category first
  try {
    const categoryData = await getProductCategory(slug);
    if (categoryData.productCategory) {
      const category = categoryData.productCategory;
      const description = category.description 
        ? category.description.replace(/<[^>]*>/g, '').slice(0, 160)
        : `Browse ${category.name} products from BAPI`;
      
      return {
        title: `${category.name} | BAPI Products`,
        description,
        openGraph: {
          title: `${category.name} | BAPI Products`,
          description,
          type: "website",
          url: `https://yourdomain.com/products/${slug}`,
          images: category.image?.sourceUrl ? [category.image.sourceUrl] : [],
        },
      };
    }
  } catch (error) {
    // Not a category, continue to product check
  }
  
  // Try product
  try {
    const data = await getProductBySlug(slug);
    const parsed = getProductQuerySchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
    const product = data.product as GetProductBySlugQuery['product'] | null;
    if (!product) return {};
    const ogImage = product.image?.sourceUrl || (product.galleryImages?.nodes?.[0]?.sourceUrl ?? "");
    const ogDescription = stripHtml(product.shortDescription || product.description);
    
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
  } catch (error) {
    return {};
  }
}

// ISR revalidation - 1 hour for both categories and products
export const revalidate = 3600;

export default async function ProductPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    notFound();
  }
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const slug = String(resolvedParams.slug);
  
  // Try to fetch as a category first
  try {
    const categoryData = await getProductCategory(slug);
    if (categoryData.productCategory) {
      // Fetch products for this category
      const productsData = await getProductsByCategory(slug, 50);
      
      return (
        <CategoryPage 
          category={categoryData.productCategory} 
          products={productsData.products} 
        />
      );
    }
  } catch (error) {
    // Not a category or error fetching, continue to product check
  }
  
  // Try to fetch as a product
  try {
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
  } catch (error) {
    // Neither category nor product found
    notFound();
  }
}
