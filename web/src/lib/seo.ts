// src/lib/seo.ts

/**
 * Utility functions for generating SEO metadata and JSON-LD structured data.
 */

/**
 * Returns base site metadata for Next.js layouts
 *
 * Provides default Open Graph, Twitter Card, and canonical URL settings.
 * Use as fallback when page-specific metadata is unavailable.
 *
 * @returns Next.js metadata object with site-wide defaults
 *
 * @example
 * ```ts
 * // In layout.tsx
 * export const metadata = getSiteMetadata();
 * ```
 */
export function getSiteMetadata() {
  return {
    title: {
      default: 'BAPI | Building Automation Products',
      template: '%s | BAPI',
    },
    description:
      'Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.',
    openGraph: {
      title: 'BAPI | Building Automation Products',
      description:
        'Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.',
      type: 'website',
      url: 'https://yourdomain.com/',
      siteName: 'BAPI',
      images: [
        {
          url: 'https://yourdomain.com/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'BAPI - Building Automation Products',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bapi',
      title: 'BAPI | Building Automation Products',
      description:
        'Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.',
      images: ['https://yourdomain.com/og-default.jpg'],
    },
    metadataBase: new URL('https://yourdomain.com/'),
    alternates: {
      canonical: '/',
    },
  };
}

/**
 * Generates SEO metadata for product pages
 *
 * Creates optimized Open Graph and Twitter Card metadata using product
 * data. Falls back gracefully when images or descriptions are missing.
 *
 * @param product - Product object from GraphQL (WooCommerce)
 * @returns Next.js metadata object with product-specific SEO tags
 *
 * @example
 * ```ts
 * // In product page
 * export async function generateMetadata({ params }) {
 *   const product = await getProductBySlug(params.slug);
 *   return getProductMetadata(product);
 * }
 * ```
 */
export function getProductMetadata(product: any) {
  const ogImage = product?.image?.sourceUrl || (product?.gallery?.[0]?.sourceUrl ?? '');
  const ogDescription = product?.shortDescription || product?.description || '';
  return {
    title: `${product.name} | BAPI`,
    description: ogDescription,
    openGraph: {
      title: product.name,
      description: ogDescription,
      type: 'product',
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

/**
 * Generates Product schema JSON-LD for rich snippets
 *
 * Creates schema.org Product markup for Google Shopping and search results.
 * Improves product visibility with rich snippets (price, availability, ratings).
 *
 * @param product - Product object from GraphQL
 * @returns JSON-LD object for Product schema
 *
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 *
 * @example
 * ```tsx
 * // In product page
 * <script type="application/ld+json">
 *   {JSON.stringify(getProductJsonLd(product))}
 * </script>
 * ```
 */
export function getProductJsonLd(product: any) {
  const ogImage = product?.image?.sourceUrl || (product?.gallery?.[0]?.sourceUrl ?? '');
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [ogImage],
    description: product.shortDescription || product.description || '',
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability:
        product.stockStatus === 'IN_STOCK'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `https://yourdomain.com/products/${product.slug}`,
    },
  };
}

/**
 * Generates CollectionPage schema JSON-LD for category/listing pages
 *
 * Creates schema.org CollectionPage markup for improved categorization
 * in search results. Use for product category and listing pages.
 *
 * @param params - Page metadata
 * @param params.title - Page title (e.g., "Temperature Sensors")
 * @param params.description - Page description
 * @param params.url - Canonical URL of the collection page
 * @returns JSON-LD object for CollectionPage schema
 *
 * @see https://schema.org/CollectionPage
 */
export function getCollectionPageJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
  };
}

/**
 * Generates WebSite schema JSON-LD for site-wide context
 *
 * Creates schema.org WebSite markup with site search functionality.
 * Include in root layout for site-wide structured data.
 *
 * @returns JSON-LD object for WebSite schema with SearchAction
 *
 * @see https://schema.org/WebSite
 *
 * @example
 * ```tsx
 * // In root layout
 * <script type="application/ld+json">
 *   {JSON.stringify(getWebsiteJsonLd())}
 * </script>
 * ```
 */
export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BAPI',
    url: 'https://yourdomain.com/',
    description:
      'Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.',
  };
}
