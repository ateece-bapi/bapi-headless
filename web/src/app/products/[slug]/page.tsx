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
import ProductTabs from '@/components/products/ProductPage/ProductTabs';
import RelatedProducts from '@/components/products/ProductPage/RelatedProducts';
import AppLinks from '@/components/products/ProductPage/AppLinks';
import ContactInfo from '@/components/products/ProductPage/ContactInfo';
import ProductSummaryCard from '@/components/products/ProductPage/ProductSummaryCard';

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
    multiplier?: string;
    iosAppUrl?: string;
    androidAppUrl?: string;
  };
  const product = data.product as NormalizedProduct | null;

  if (!product) {
    notFound();
  }

  // Build a lightweight, serializable shape for the client component
  // This uses the normalized product object, which includes relatedProducts
  const productForClient = {
    id: product.id,
    databaseId: product.databaseId ?? 0,
    name: product.name ?? 'Product',
    slug: product.slug ?? '',
    partNumber: product.partNumber ?? '',
    multiplier: product.multiplier ?? '',
    price: getProductPrice(product) || '$0.00',
    stockStatus: getProductStockStatus(product) || null,
    image: product.image
      ? { sourceUrl: product.image.sourceUrl || '', altText: product.image.altText || product.name || '' }
      : null,
    gallery: ((product.galleryImages?.nodes || []) as Array<{ sourceUrl?: string; altText?: string | null }>).map((node) => {
      return { sourceUrl: node?.sourceUrl ?? '', altText: node?.altText ?? '' };
    }),
    variations:
      (product
        ? (() => {
            const validated = productSchema.parse(product) as z.infer<typeof productSchema>;
            return (
              validated.variations?.nodes?.map((v) => {
                const vv = v as {
                  id: string;
                  databaseId?: number;
                  name?: string | null;
                  price?: string | null;
                  attributes?: { nodes?: Array<{ name?: string; label?: string; value?: string | null }> } | null;
                  image?: { sourceUrl?: string; altText?: string | null } | null;
                };
                const attrs = (vv.attributes?.nodes || []).reduce<Record<string, string>>((acc, a) => {
                  if (a && a.name && a.value) acc[a.name] = a.value;
                  return acc;
                }, {});

                return {
                  id: vv.id,
                  databaseId: vv.databaseId ?? 0,
                  name: vv.name || `${product?.name ?? 'Product'} variant`,
                  price: vv.price ?? null,
                  attributes: attrs,
                  image: vv.image ? { sourceUrl: vv.image.sourceUrl ?? '', altText: vv.image.altText ?? '' } : null,
                };
              }) || []
            );
          })()
        : []) || [],
    attributes: (() => {
      const prodWithVariations = product as NormalizedProduct | null;
      const variationsArr = (() => {
        if (!prodWithVariations) return [] as Array<{ attributes?: { nodes?: Array<{ name?: string; value?: string | null }> } | null }>;
        if (!('variations' in prodWithVariations)) return [] as Array<{ attributes?: { nodes?: Array<{ name?: string; value?: string | null }> } | null }>;
        const maybe = (prodWithVariations as any).variations;
        if (!maybe || !Array.isArray(maybe.nodes)) return [] as Array<{ attributes?: { nodes?: Array<{ name?: string; value?: string | null }> } | null }>;
        return maybe.nodes as Array<{ attributes?: { nodes?: Array<{ name?: string; value?: string | null }> } | null }>;
      })();
      const acc: Record<string, Set<string>> = {};
      for (const v of variationsArr) {
        const vv = v as { attributes?: { nodes?: Array<{ name?: string; value?: string | null }> } | null };
        const nodes = vv.attributes?.nodes || [];
        for (const a of nodes) {
          if (!a || !a.name) continue;
          acc[a.name] = acc[a.name] || new Set<string>();
          if (a.value) acc[a.name].add(a.value);
        }
      }
      return Object.entries(acc).map(([name, set]) => ({ name, options: Array.from(set) }));
    })(),
    shortDescription: product.shortDescription || null,
    description: product.description || null,
    relatedProducts: product.relatedProducts || [],
  };

  // --- JSON-LD Structured Data ---
  const ogImage = productForClient.image?.sourceUrl || (productForClient.gallery?.[0]?.sourceUrl ?? "");
  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Products",
        "item": "https://yourdomain.com/products"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": productForClient.name,
        "item": `https://yourdomain.com/products/${productForClient.slug}`
      }
    ]
  };
  // Expanded Product JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productForClient.name,
    image: [ogImage],
    description: productForClient.shortDescription || productForClient.description || '',
    sku: productForClient.id,
    brand: { '@type': 'Brand', name: 'BAPI' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: productForClient.price,
      availability: productForClient.stockStatus === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://yourdomain.com/products/${productForClient.slug}`,
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="min-h-screen bg-white">
        <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition">
              BAPI
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/products" className="text-primary-500 font-semibold">
                Products
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-12">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: 'Products', href: '/products' },
                { label: productForClient.name }
              ]}
            />
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
              <div className="flex-1">
                <ProductHero product={productForClient} />
              </div>
              <ProductSummaryCard product={{
                partNumber: productForClient.partNumber,
                price: productForClient.price,
                multiplier: productForClient.multiplier,
                stockStatus: productForClient.stockStatus,
              }} />
            </div>
            <ProductConfigurator product={productForClient} />
            <ProductTabs product={productForClient} />
            <RelatedProducts related={productForClient.relatedProducts} />
            <AppLinks product={{ iosAppUrl: product.iosAppUrl, androidAppUrl: product.androidAppUrl }} />
            <ContactInfo />
            {/* Main Product Detail Client removed to prevent duplicate layout */}
            {/* <ProductDetailClient product={productForClient} /> */}
          </div>
        </main>

        <footer className="border-t border-neutral-200 py-8 bg-white">
          <div className="container mx-auto px-4 text-center text-neutral-600">
            <p>&copy; 2025 BAPI. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <CartDrawer />
    </>
  );
}
