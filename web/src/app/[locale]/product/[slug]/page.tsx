import React, { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import logger from '@/lib/logger';
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
import { getGraphQLClient } from '@/lib/graphql/client';
import { GetProductVariationsDocument } from '@/lib/graphql/generated';
import type { 
  GetProductBySlugQuery,
  GetProductBySlugLightQuery,
  GetProductCategoryQuery,
  GetProductsByCategoryQuery,
  GetProductVariationsQuery
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
import { RelatedProductsAsync } from '@/components/products/RelatedProductsAsync';
import dynamic from 'next/dynamic';
import { PerformanceTimer } from '@/lib/monitoring/performance';
import { StructuredData, generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { generateProductMetadata, generateCategoryMetadata } from '@/lib/metadata';
import type { Metadata } from "next";

/**
 * Generate AI-optimized metadata for products and categories
 * Uses enterprise metadata generators with rich snippets support
 */
export async function generateMetadata({ params }: { params: { slug: string; locale: string } | Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.slug) {
      logger.warn('[generateMetadata] Missing slug');
      return {};
    }
    const slug = String(resolvedParams.slug);
    const locale = resolvedParams.locale || 'en';
    
    logger.debug('[generateMetadata] Generating metadata', { slug, locale });
    
    // PARALLEL fetch: Try both category and product simultaneously to eliminate waterfall
    const [categoryResult, productResult] = await Promise.allSettled([
      getProductCategory(slug),
      getProductBySlug(slug)
    ]);
    
    // Check if it's a category
    if (categoryResult.status === 'fulfilled' && categoryResult.value.productCategory) {
      const category = categoryResult.value.productCategory;
      logger.debug('[generateMetadata] Category found', { slug, name: category.name });
      return generateCategoryMetadata(
        {
          name: category.name || '',
          slug: category.slug || slug,
          description: category.description,
          image: category.image,
          count: category.count,
          // Parent field not available in GetProductCategory query
          parent: undefined,
        },
        locale
      );
    }
    
    // Check if it's a product
    if (productResult.status === 'fulfilled') {
      const parsed = getProductQuerySchema.safeParse(productResult.value);
      if (parsed.success) {
        const product = productResult.value.product as GetProductBySlugQuery['product'] | null;
        if (product) {
          logger.debug('[generateMetadata] Product found', { slug, name: product.name });
          return generateProductMetadata(
            {
              name: product.name || '',
              slug: product.slug || slug,
              description: product.description,
              shortDescription: product.shortDescription,
              price: 'price' in product ? product.price : null,
              regularPrice: 'regularPrice' in product ? product.regularPrice : null,
              salePrice: 'salePrice' in product ? product.salePrice : null,
              sku: 'sku' in product ? product.sku : null,
              partNumber: 'partNumber' in product ? product.partNumber : null,
              image: product.image,
              galleryImages: ('galleryImages' in product ? product.galleryImages?.nodes : null) as any,
              categories: ('productCategories' in product ? product.productCategories?.nodes : null) as any,
              averageRating: ('averageRating' in product ? product.averageRating : null) as number | null,
              reviewCount: ('reviewCount' in product ? product.reviewCount : null) as number | null,
              stockStatus: ('stockStatus' in product ? product.stockStatus : null) as string | null,
              featured: ('featured' in product ? product.featured : null) as boolean | null,
            },
            locale
          );
        }
      } else {
        logger.warn('[generateMetadata] Product validation failed', { 
          slug, 
          errors: parsed.error.errors 
        });
      }
    }
    
    // Log if both failed
    if (categoryResult.status === 'rejected' && productResult.status === 'rejected') {
      logger.error('[generateMetadata] Both queries failed', {
        slug,
        categoryError: categoryResult.reason instanceof Error ? categoryResult.reason.message : 'Unknown',
        productError: productResult.reason instanceof Error ? productResult.reason.message : 'Unknown'
      });
    }
    
    logger.warn('[generateMetadata] No metadata generated', { slug });
    return {};
    
  } catch (error) {
    logger.error('[generateMetadata] Unhandled error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return {}; // Return empty metadata instead of throwing
  }
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

    logger.info('[generateStaticParams] Pre-generating product pages', { count: productSlugs.length });
    
    return productSlugs;
  } catch (error) {
    logger.error('[generateStaticParams] Failed to fetch params', error);
    // Return empty array to continue build without static generation
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const timer = new PerformanceTimer('ProductPage');
  
  try {
    if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
      logger.error('[ProductPage] Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL');
      notFound();
    }
    
    const resolvedParams = await params;
    if (!resolvedParams?.slug) {
      logger.error('[ProductPage] Missing slug parameter');
      notFound();
    }
    const slug = String(resolvedParams.slug);
    
    logger.info('[ProductPage] Loading product', { slug });
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
      logger.info('[ProductPage] Rendering as category', { slug });
      // Fetch products for this category (10 products for better performance)
      const productsData = await getProductsByCategory(slug, 10);
      
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

        // DEBUG: Log galleryImages to verify images from backend
        if (product && 'galleryImages' in product) {
          const count = (product.galleryImages as any)?.nodes?.length || 0;
          logger.debug('[ProductPage] galleryImages loaded', { count });
        }

        if (!product) {
          logger.warn('[ProductPage] Product not found', { slug });
          notFound();
        }
        
        logger.info('[ProductPage] Product loaded successfully', { 
          slug, 
          databaseId: product.databaseId,
          type: product.__typename 
        });

        timer.mark('validation-complete');

      // Fetch variations if this is a VariableProduct
      let variationData = null;
      if (product.__typename === 'VariableProduct') {
        try {
          logger.debug('[ProductPage] Fetching variations', { databaseId: product.databaseId });
          const client = getGraphQLClient(['product-variations', `product-${product.databaseId}`], true);
          const variationsResult = await client.request<GetProductVariationsQuery>(
            GetProductVariationsDocument,
            { id: product.databaseId?.toString() || product.id }
          );
          variationData = variationsResult.product;
          logger.debug('[ProductPage] Variations loaded', { 
            count: (variationData as any)?.variations?.nodes?.length || 0 
          });
        } catch (error) {
          logger.error('[ProductPage] Failed to fetch variations', { 
            error: error instanceof Error ? error.message : 'Unknown error',
            databaseId: product.databaseId 
          });
        }
      }

      // Transform light product data for client
      const productForClient = {
        id: product.id,
        databaseId: product.databaseId?.toString() || '',
        name: product.name || '',
        slug: product.slug || '',
        shortDescription: product.shortDescription || null,
        description: product.description || null,
        partNumber: (product as any).partNumber || null,
        price: (product as any).price || null,
        regularPrice: (product as any).regularPrice || null,
        salePrice: (product as any).salePrice || null,
        onSale: (product as any).onSale || false,
        stockStatus: (product as any).stockStatus || null,
        sku: (product as any).sku || null,
        image: product.image ? {
          sourceUrl: product.image.sourceUrl || '',
          altText: product.image.altText || ''
        } : null,
        gallery: ((product as any).galleryImages?.nodes || []).map((img: any) => ({
          sourceUrl: img.sourceUrl,
          altText: img.altText
        })),
        documents: (product.productDocuments || [])
          .filter((category): category is NonNullable<typeof category> => category !== null && category !== undefined)
          .flatMap(category => 
            (category.files || [])
              .filter((file): file is NonNullable<typeof file> => file !== null && file !== undefined)
              .map(file => ({
                title: file.title || '',
                url: file.url || '',
                category: category.heading || 'Documents'
              }))
          ),
        videos: (product.productVideos || [])
          .filter((category): category is NonNullable<typeof category> => category !== null && category !== undefined)
          .flatMap(category =>
            (category.videos || [])
              .filter((video): video is NonNullable<typeof video> => video !== null && video !== undefined)
              .map(video => ({
                title: category.heading || 'Video',
                url: video.url || ''
              }))
          ),
        productCategories: (product.productCategories?.nodes || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name || '',
          slug: cat.slug || ''
        })),
        tags: [], // Will be loaded deferred
        multiplierGroups: [], // Will be loaded deferred
        attributes: variationData?.__typename === 'VariableProduct' ? 
          (variationData.attributes?.nodes || [])
            .filter((attr: any) => attr.variation === true)
            .map((attr: any) => {
              // Get actual values from variations, not from attribute.options
              // Normalize both attribute name and variation attribute name for comparison
              const normalizeSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
              const attributeSlug = normalizeSlug(attr.name);
              const actualValues = new Set<string>();
              
              (variationData.variations?.nodes || []).forEach((variation: any) => {
                const varAttr = variation.attributes?.nodes?.find((va: any) => {
                  const vaSlug = normalizeSlug(va.name);
                  return vaSlug === attributeSlug;
                });
                if (varAttr?.value) {
                  actualValues.add(varAttr.value);
                }
              });
              
              return {
                id: attr.id,
                name: attr.name, // slug for matching (e.g., "pressure-range")
                label: attr.label, // display name (e.g., "Pressure Range")
                options: Array.from(actualValues), // Use actual variation values
                variation: attr.variation
              };
            }) : [],
        variations: variationData?.__typename === 'VariableProduct' ? 
          (variationData.variations?.nodes || []).map((variation: any) => ({
            id: variation.id,
            databaseId: variation.databaseId,
            name: variation.name,
            price: variation.price,
            regularPrice: variation.regularPrice,
            stockStatus: variation.stockStatus,
            partNumber: variation.partNumber,
            sku: variation.sku,
            attributes: (variation.attributes?.nodes || []).reduce((acc: any, attr: any) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {})
          })) : [],
        relatedProducts: [], // Will be loaded by RelatedProductsAsync
        iosAppUrl: null,
        androidAppUrl: null,
      };
      
      timer.mark('transform-complete');
      timer.end();
      
      const productDbId = product.databaseId?.toString() || product.id;
      
      // Generate structured data for SEO
      // Use Vercel URL if available, otherwise fallback to custom domain or localhost
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     process.env.NEXT_PUBLIC_APP_URL || 
                     process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                     'https://bapi-headless.vercel.app';
      const productUrl = `${siteUrl}/product/${slug}`;
      
      logger.debug('[ProductPage] Generating structured data', { siteUrl, productUrl });
      
      // Get image from raw product data (before transformation)
      const rawProduct = data.product as any;
      const productImageUrl = rawProduct.image?.sourceUrl || '';
      const productCategoryName = rawProduct.productCategories?.nodes?.[0]?.name || undefined;
      
      const productSchema = generateProductSchema(
        {
          name: product.name || '',
          description: (product.shortDescription || product.description || '').replace(/<[^>]*>/g, '').trim(),
          image: productImageUrl,
          sku: (product as any).sku || '',
          partNumber: (product as any).partNumber || undefined,
          price: (product as any).price ? parseFloat((product as any).price) : undefined,
          regularPrice: (product as any).regularPrice ? parseFloat((product as any).regularPrice) : undefined,
          salePrice: (product as any).salePrice ? parseFloat((product as any).salePrice) : undefined,
          inStock: (product as any).stockStatus === 'IN_STOCK',
          category: productCategoryName,
        },
        productUrl,
        siteUrl
      );
      
      // Generate breadcrumb schema
      const breadcrumbs: Array<{ name: string; url?: string }> = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
      ];
      
      // Add category if available (use raw product data before transformation)
      if (rawProduct.productCategories?.nodes?.[0]) {
        const category = rawProduct.productCategories.nodes[0];
        breadcrumbs.push({
          name: category.name || '',
          url: `/products/${category.slug}`
        });
      }
      
      // Add product (no URL for last item)
      breadcrumbs.push({ name: product.name || '', url: undefined });
      
      const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, siteUrl);
      
      return (
        <>
          {/* Structured Data for SEO */}
          <StructuredData schema={[productSchema, breadcrumbSchema]} />
          
          <ProductDetailClient product={productForClient} productId={productDbId} />
          
          {/* Deferred content loaded in separate Suspense boundaries on client */}
          <Suspense fallback={<div className="container mx-auto px-4 py-12 bg-neutral-50 animate-pulse h-96 rounded" />}>
            <RelatedProductsAsync productId={productDbId} />
          </Suspense>
        </>
      );
    } catch (error) {
      // Product data invalid
      logger.error('[ProductPage] Error processing product data', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        slug 
      });
      notFound();
    }
  }
  
    // Log if both queries failed
    if (categoryResult.status === 'rejected' && productResult.status === 'rejected') {
      logger.error('[ProductPage] Both category and product queries failed', {
        slug,
        categoryError: categoryResult.reason,
        productError: productResult.reason
      });
    }
    
    // Neither category nor product found
    logger.warn('[ProductPage] Not found', { slug });
    notFound();
    
  } catch (error) {
    // Top-level error handler
    logger.error('[ProductPage] Unhandled error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Re-throw to let Next.js error boundary handle it
  }
}
