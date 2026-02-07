/**
 * Schema.org Type Definitions for SEO
 * 
 * Type-safe interfaces for generating JSON-LD structured data
 * Supports Product, Organization, Breadcrumb, FAQ, and more
 * 
 * @see https://schema.org/
 */

export interface SchemaOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
  }>;
  sameAs?: string[]; // Social media profiles
  foundingDate?: string;
}

export interface SchemaProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string | string[];
  sku: string;
  mpn?: string; // Manufacturer Part Number
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers?: {
    '@type': 'Offer';
    url: string;
    priceCurrency: string;
    price?: number;
    priceValidUntil?: string;
    availability: string; // https://schema.org/ItemAvailability
    itemCondition?: string; // https://schema.org/OfferItemCondition
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  category?: string;
  manufacturer?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface SchemaBreadcrumb {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string; // URL (omit for last item)
  }>;
}

export interface SchemaFAQ {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface SchemaWebPage {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  inLanguage?: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

export interface SchemaWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export type Schema =
  | SchemaOrganization
  | SchemaProduct
  | SchemaBreadcrumb
  | SchemaFAQ
  | SchemaWebPage
  | SchemaWebSite;
