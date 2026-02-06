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
        // eslint-disable-next-line no-console
        const count = (product.galleryImages as any)?.nodes?.length || 0;
        logger.debug('[ProductPage] galleryImages loaded', { count });
      }

      if (!product) {
        notFound();
      }

      timer.mark('validation-complete');

      // Fetch variations if this is a VariableProduct
      let variationData = null;
      if (product.__typename === 'VariableProduct') {
        try {
          const client = getGraphQLClient(['product-variations', `product-${product.databaseId}`], true);
          const variationsResult = await client.request<GetProductVariationsQuery>(
            GetProductVariationsDocument,
            { id: product.databaseId?.toString() || product.id }
          );
          variationData = variationsResult.product;
        } catch (error) {
          logger.error('[ProductPage] Failed to fetch variations', error);
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
        image: product.image || null,
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
        productCategories: product.productCategories?.nodes || [],
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
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi-headless.vercel.app';
      const productUrl = `${siteUrl}/product/${slug}`;
      
      const productSchema = generateProductSchema(
        {
          name: product.name || '',
          description: stripHtml(product.shortDescription || product.description),
          image: product.image?.sourceUrl || '',
          sku: (product as any).sku || '',
          partNumber: (product as any).partNumber || undefined,
          price: (product as any).price ? parseFloat((product as any).price) : undefined,
          regularPrice: (product as any).regularPrice ? parseFloat((product as any).regularPrice) : undefined,
          salePrice: (product as any).salePrice ? parseFloat((product as any).salePrice) : undefined,
          inStock: (product as any).stockStatus === 'IN_STOCK',
          category: product.productCategories?.nodes?.[0]?.name || undefined,
        },
        productUrl,
        siteUrl
      );
      
      // Generate breadcrumb schema
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
      ];
      
      // Add category if available
      if (product.productCategories?.nodes?.[0]) {
        const category = product.productCategories.nodes[0];
        breadcrumbs.push({
          name: category.name || '',
          url: `/products/${category.slug}`
        });
      }
      
      // Add product (no URL for last item)
      breadcrumbs.push({ name: product.name || '' });
      
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
      logger.error('[ProductPage] Error', error);
      notFound();
    }
  }
  
  // Neither category nor product found
  notFound();
}
