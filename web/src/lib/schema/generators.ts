/**
 * Schema.org JSON-LD Generators
 *
 * Utility functions to generate structured data for SEO
 * Ensures consistent, valid schema.org markup across the site
 */

import type {
  SchemaOrganization,
  SchemaProduct,
  SchemaBreadcrumb,
  SchemaFAQ,
  SchemaWebSite,
} from './types';

/**
 * Generate Organization schema for BAPI
 * Used in site-wide layout for brand identity
 */
export function generateOrganizationSchema(siteUrl: string): SchemaOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Building Automation Products Inc.',
    alternateName: 'BAPI',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description:
      'Leading manufacturer of building automation sensors and controls since 1984. Trusted by building automation professionals worldwide.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '750 North Royal Avenue',
      addressLocality: 'Gays Mills',
      addressRegion: 'WI',
      postalCode: '54631',
      addressCountry: 'US',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-715-538-2424',
        contactType: 'Customer Service',
        email: 'sales@bapihvac.com',
        areaServed: 'US',
        availableLanguage: ['en', 'es'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/building-automation-products-inc-',
      'https://www.youtube.com/@BAPIProducts',
    ],
    foundingDate: '1984',
  };
}

/**
 * Generate Product schema for product pages
 * Includes pricing, availability, and brand information
 */
export function generateProductSchema(
  product: {
    name: string;
    description?: string;
    image?: string;
    sku: string;
    partNumber?: string;
    price?: number;
    regularPrice?: number;
    salePrice?: number;
    inStock?: boolean;
    category?: string;
  },
  productUrl: string,
  siteUrl: string
): SchemaProduct {
  const price = product.salePrice || product.price || product.regularPrice;
  const availability = product.inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - Building Automation Sensor`,
    image: product.image ? [product.image] : [`${siteUrl}/images/placeholder-product.png`],
    sku: product.sku,
    mpn: product.partNumber || product.sku,
    brand: {
      '@type': 'Brand',
      name: 'BAPI',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      availability,
      itemCondition: 'https://schema.org/NewCondition',
    },
    category: product.category,
    manufacturer: {
      '@type': 'Organization',
      name: 'Building Automation Products Inc.',
    },
  };
}

/**
 * Generate breadcrumb schema for structured data
 * @deprecated Use breadcrumbsToSchemaOrg from @/lib/navigation/breadcrumbs instead.
 * The new function provides URL normalization and is integrated with the breadcrumb navigation utilities.
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>,
  siteUrl: string
): SchemaBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url ? `${siteUrl}${crumb.url}` : undefined,
    })),
  };
}

/**
 * Generate FAQ schema for better AI understanding
 * Appears as rich snippets in search results
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaFAQ {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebSite schema with search action
 * Enables Google's site search box in SERPs
 */
export function generateWebSiteSchema(siteUrl: string, siteName: string): SchemaWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: 'Building automation sensors and controls for HVAC systems',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Utility to safely serialize schema to JSON-LD script tag
 */
export function schemaToJsonLd(schema: any): string {
  return JSON.stringify(schema, null, 0); // Minified for performance
}
