import React, { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getProductBySlug,
  getProductBySlugLight,
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
  GetProductBySlugLightQuery,
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
import { ProductGalleryAsync } from '@/components/products/ProductGalleryAsync';
import { ProductTabsAsync } from '@/components/products/ProductTabsAsync';
import { RelatedProductsAsync } from '@/components/products/RelatedProductsAsync';
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
 * Pre-generate static pages at build time for top products ONLY
 * Categories render on-demand with ISR (faster builds, better performance)
 * 
 * Strategy: Only pre-render high-value product pages for SEO
 * Categories get cached on first visit and revalidate every hour
 */
export async function generateStaticParams() {
  try {
    // Only pre-render top 5 product detail pages
    // Categories are skipped to avoid 60s+ build timeouts
    const productsData = await getProducts(5);
    const productSlugs = productsData.products?.nodes
      ?.filter(p => p?.slug)
      .map(p => ({ slug: p.slug })) || [];

    console.log(`[generateStaticParams] Pre-generating ${productSlugs.length} product pages (categories on-demand)`);
    
    return productSlugs;
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
  // Use LIGHT query for product to reduce initial payload by ~70%
  const [categoryResult, productResult] = await Promise.allSettled([
    getProductCategory(slug),
    getProductBySlugLight(slug)
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
      // Light query validation - only essential fields
      const product = data.product as GetProductBySlugLightQuery['product'] | null;

      if (!product) {
        notFound();
      }

      timer.mark('validation-complete');

      // Transform light product data for client
      const productForClient = {
        id: product.id,
        databaseId: product.databaseId?.toString() || '',
        name: product.name || '',
        slug: product.slug || '',
        shortDescription: product.shortDescription || null,
        description: null, // Will be loaded by ProductTabsAsync
        partNumber: (product as any).partNumber || null,
        price: (product as any).price || null,
        regularPrice: (product as any).regularPrice || null,
        salePrice: (product as any).salePrice || null,
        onSale: (product as any).onSale || false,
        stockStatus: (product as any).stockStatus || null,
        sku: (product as any).sku || null,
        image: product.image || null,
        galleryImages: [], // Will be loaded by ProductGalleryAsync
        productCategories: product.productCategories?.nodes || [],
        tags: [], // Will be loaded deferred
        multiplierGroups: [], // Will be loaded deferred
        attributes: [],
        variations: [], // Will be loaded if needed (should be array, not {nodes:[]})
        relatedProducts: [], // Will be loaded by RelatedProductsAsync
        iosAppUrl: null,
        androidAppUrl: null,
      };
      
      timer.mark('transform-complete');
      timer.end();
      
      const productDbId = product.databaseId?.toString() || product.id;
      
      return (
        <>
          <ProductDetailClient product={productForClient} productId={productDbId} />
          
          {/* Deferred content loaded in separate Suspense boundaries on client */}
          <Suspense fallback={<div className="container mx-auto px-4 py-8 animate-pulse h-64 bg-gray-100 rounded" />}>
            <ProductTabsAsync productId={productDbId} />
          </Suspense>
          
          <Suspense fallback={<div className="container mx-auto px-4 py-8 animate-pulse h-48 bg-gray-50 rounded" />}>
            <ProductGalleryAsync productId={productDbId} productName={product.name || ''} />
          </Suspense>
          
          <Suspense fallback={<div className="container mx-auto px-4 py-12 bg-gray-50 animate-pulse h-96 rounded" />}>
            <RelatedProductsAsync productId={productDbId} />
          </Suspense>
        </>
      );
    } catch (error) {
      // Product data invalid
      console.error('[ProductPage] Error:', error);
      notFound();
    }
  }
  
  // Neither category nor product found
  notFound();
}
