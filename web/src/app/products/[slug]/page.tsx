import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getProductBySlug, 
  getProductPrice, 
  getProductStockStatus,
  getProductCategory,
  getProductsByCategory,
  getProducts,
  getProductCategories,
  transformProductForClient
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
import { PerformanceTimer } from '@/lib/monitoring/performance';

function stripHtml(html?: string | null) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').slice(0, 160);
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return {};
  const slug = String(resolvedParams.slug);
  
  // PARALLEL fetch: Try both category and product simultaneously to eliminate waterfall
  const [categoryResult, productResult] = await Promise.allSettled([
    getProductCategory(slug),
    getProductBySlug(slug)
  ]);
  
  // Check if it's a category
  if (categoryResult.status === 'fulfilled' && categoryResult.value.productCategory) {
    const category = categoryResult.value.productCategory;
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
  
  // Check if it's a product
  if (productResult.status === 'fulfilled') {
    const parsed = getProductQuerySchema.safeParse(productResult.value);
    if (parsed.success) {
      const product = productResult.value.product as GetProductBySlugQuery['product'] | null;
      if (product) {
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
      }
    }
  }
  
  return {};
}

// ISR revalidation - 1 hour for both categories and products
export const revalidate = 3600;

/**
 * Pre-generate static pages at build time for top products and all categories
 * This ensures the first visitor gets instant page loads for popular content
 * ISR will handle updates after 1 hour, and on-demand rendering for long-tail products
 */
export async function generateStaticParams() {
  try {
    // Fetch top 10 products (most critical for first-visitor experience)
    // Keep this conservative to avoid build timeouts
    const productsData = await getProducts(10);
    const productSlugs = productsData.products?.nodes
      ?.filter(p => p?.slug)
      .map(p => ({ slug: p.slug })) || [];

    // Fetch main categories (high-value landing pages)
    // Limit to 20 to avoid build timeouts
    const categoriesData = await getProductCategories(20);
    const categorySlugs = categoriesData.productCategories?.nodes
      ?.filter(c => c?.slug)
      .map(c => ({ slug: c.slug })) || [];

    // Combine products and categories for static generation
    const allParams = [...productSlugs, ...categorySlugs];
    
    console.log(`[generateStaticParams] Pre-generating ${allParams.length} pages (${productSlugs.length} products + ${categorySlugs.length} categories)`);
    
    return allParams;
  } catch (error) {
    console.error('[generateStaticParams] Failed to fetch params:', error);
    // Return empty array to continue build without static generation
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const timer = new PerformanceTimer('ProductPage');
  
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    notFound();
  }
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const slug = String(resolvedParams.slug);
  
  timer.mark('params-resolved');
  
  // PARALLEL fetch: Try both category and product simultaneously to eliminate waterfall
  const [categoryResult, productResult] = await Promise.allSettled([
    getProductCategory(slug),
    getProductBySlug(slug)
  ]);
  
  timer.mark('data-fetched');
  
  // Check if it's a category
  if (categoryResult.status === 'fulfilled' && categoryResult.value.productCategory) {
    // Fetch products for this category
    const productsData = await getProductsByCategory(slug, 50);
    
    return (
      <CategoryPage 
        category={categoryResult.value.productCategory} 
        products={productsData.products} 
      />
    );
  }
  
  // Check if it's a product
  if (productResult.status === 'fulfilled') {
    try {
      const data = productResult.value;
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

      timer.mark('validation-complete');

      // Use cached transformation utility to reduce blocking time
      const baseTransform = transformProductForClient(product);
      
      if (!baseTransform) {
        notFound();
      }
      
      timer.mark('transform-complete');

      // Add fields not included in the base transform
      const productForClient = {
        ...baseTransform,
        multiplierGroups: Array.isArray(product.multiplierGroups) ? product.multiplierGroups : [],
        attributes: [], // Add attribute normalization if needed
        description: product.description || null,
        relatedProducts: product.relatedProducts || [],
        iosAppUrl: (product as any).iosAppUrl ?? null,
        androidAppUrl: (product as any).androidAppUrl ?? null,
      };
      
      timer.end();
      
      return (
        <ProductDetailClient product={productForClient} />
      );
    } catch (error) {
      // Product data invalid
      notFound();
    }
  }
  
  // Neither category nor product found
  notFound();
}
