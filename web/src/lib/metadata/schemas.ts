/**
 * JSON-LD Structured Data Schemas
 *
 * Generates schema.org markup for search engines and AI assistants.
 * Improves discoverability with rich snippets and knowledge graph integration.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import type { ProductMetadataInput } from './types';
import { SITE_CONFIG } from './generators';
import { parsePrice } from '@/lib/utils/currency';

/**
 * Generate Product schema JSON-LD for rich snippets
 *
 * Creates schema.org Product markup for Google Shopping and search results.
 * Improves product visibility with rich snippets (price, availability, ratings).
 *
 * @param product - Product data from WordPress/WooCommerce
 * @returns JSON-LD object for Product schema
 *
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 *
 * @example
 * ```tsx
 * // In product page
 * const jsonLd = generateProductSchema(product);
 * <script type="application/ld+json">
 *   {JSON.stringify(jsonLd)}
 * </script>
 * ```
 */
export function generateProductSchema(product: ProductMetadataInput) {
  const primaryImage =
    product.image?.sourceUrl || product.galleryImages?.[0]?.sourceUrl || SITE_CONFIG.defaultImage;

  // Strip HTML from description
  const description = (product.shortDescription || product.description || '')
    .replace(/<[^>]*>/g, '')
    .trim();

  // Parse numeric price using the robust parsePrice() utility (handles European formats,
  // price ranges, and currency symbols correctly — consistent with cart calculations)
  const numericPrice = product.price ? (parsePrice(product.price) ?? undefined) : undefined;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [primaryImage],
    description,
    sku: product.sku,
    mpn: product.partNumber || product.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.organizationName,
    },
    ...(numericPrice && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: numericPrice.toFixed(2),
        availability:
          product.stockStatus === 'IN_STOCK'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `${SITE_CONFIG.siteUrl}/products/${product.slug}`,
        seller: {
          '@type': 'Organization',
          name: SITE_CONFIG.organizationName,
        },
      },
    }),
    ...(product.categories &&
      product.categories.length > 0 && {
        category: product.categories[0].name,
      }),
  };
}

/**
 * Generate CollectionPage schema JSON-LD for category/listing pages
 *
 * Creates schema.org CollectionPage markup for improved categorization
 * in search results. Use for product category and listing pages.
 *
 * @param params - Page metadata
 * @param params.title - Page title (e.g., "Temperature Sensors")
 * @param params.description - Page description
 * @param params.url - Full canonical URL of the collection page
 * @returns JSON-LD object for CollectionPage schema
 *
 * @see https://schema.org/CollectionPage
 *
 * @example
 * ```tsx
 * const jsonLd = generateCollectionPageSchema({
 *   title: 'Temperature Sensors',
 *   description: 'Browse our selection of precision temperature sensors',
 *   url: 'https://bapi.com/products/temperature-sensors'
 * });
 * ```
 */
export function generateCollectionPageSchema({
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
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.siteUrl,
    },
  };
}

/**
 * Generate WebSite schema JSON-LD for site-wide context
 *
 * Creates schema.org WebSite markup with SearchAction capability.
 * Include in root layout for site-wide structured data.
 *
 * @returns JSON-LD object for WebSite schema with SearchAction
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 *
 * @example
 * ```tsx
 * // In root layout
 * const jsonLd = generateWebsiteSchema();
 * <script type="application/ld+json">
 *   {JSON.stringify(jsonLd)}
 * </script>
 * ```
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.organizationName,
      url: SITE_CONFIG.siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization schema JSON-LD
 *
 * Creates schema.org Organization markup for brand recognition
 * and knowledge graph integration.
 *
 * @returns JSON-LD object for Organization schema
 *
 * @see https://schema.org/Organization
 *
 * @example
 * ```tsx
 * // In root layout or about page
 * const jsonLd = generateOrganizationSchema();
 * <script type="application/ld+json">
 *   {JSON.stringify(jsonLd)}
 * </script>
 * ```
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.organizationName,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/logo.png`,
    description: SITE_CONFIG.defaultDescription,
    sameAs: [
      // Add social media URLs here
      // 'https://twitter.com/bapi',
      // 'https://linkedin.com/company/bapi',
    ],
  };
}

/**
 * Generate BreadcrumbList schema JSON-LD
 *
 * Creates schema.org BreadcrumbList markup for navigation hierarchy.
 * Helps search engines understand site structure.
 *
 * @param breadcrumbs - Array of breadcrumb items
 * @returns JSON-LD object for BreadcrumbList schema
 *
 * @see https://schema.org/BreadcrumbList
 *
 * @example
 * ```tsx
 * const jsonLd = generateBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Products', url: '/products' },
 *   { name: 'Temperature Sensors', url: '/products/temperature-sensors' }
 * ]);
 * ```
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_CONFIG.siteUrl}${crumb.url}`,
    })),
  };
}
