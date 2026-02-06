/**
 * Metadata Generators for Enterprise SEO
 * 
 * Generates comprehensive, AI-friendly metadata for search engines,
 * social platforms, and LLMs (ChatGPT, Gemini, Perplexity).
 * 
 * Features:
 * - Dynamic title/description optimization
 * - Open Graph and Twitter Card support
 * - Canonical URLs for duplicate content prevention
 * - Multi-language support
 * - Structured keyword integration
 * - Natural language for AI comprehension
 */

import type { Metadata } from 'next';
import type {
  ProductMetadataInput,
  CategoryMetadataInput,
  PageMetadataInput,
  SiteMetadataConfig,
} from './types';

/**
 * Site-wide configuration
 * Used as fallback and for consistent branding across all pages
 */
export const SITE_CONFIG: SiteMetadataConfig = {
  siteName: 'BAPI',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi-headless.vercel.app',
  defaultTitle: 'BAPI | Precision Sensor Solutions for Building Automation',
  defaultDescription:
    'Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide for healthcare, data centers, and critical infrastructure.',
  defaultImage: '/og-default.jpg',
  twitterHandle: '@bapi',
  locale: 'en_US',
  localeAlternates: ['en-US', 'es-ES'],
  organizationName: 'Building Automation Products, Inc. (BAPI)',
  keywords: [
    'building automation sensors',
    'BACnet controllers',
    'NIST-traceable sensors',
    'HVAC sensors',
    'temperature sensors',
    'humidity sensors',
    'pressure sensors',
    'CO2 sensors',
    'IAQ monitoring',
    'critical facility sensors',
    'healthcare HVAC',
    'data center monitoring',
    'wireless sensors',
    'building management systems',
    'energy monitoring',
  ],
};

/**
 * Utility: Strip HTML tags and truncate text
 */
function stripHtml(html?: string | null, maxLength = 160): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
}

/**
 * Utility: Generate absolute URL
 */
function getAbsoluteUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure siteUrl doesn't end with slash
  const baseUrl = SITE_CONFIG.siteUrl.endsWith('/')
    ? SITE_CONFIG.siteUrl.slice(0, -1)
    : SITE_CONFIG.siteUrl;
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Generate metadata for product pages
 * 
 * Optimized for:
 * - E-commerce rich snippets (price, availability, ratings)
 * - AI understanding (natural language descriptions)
 * - Social sharing (attractive Open Graph cards)
 * - Technical accuracy (part numbers, specifications)
 * 
 * @param product - Product data from WordPress/WooCommerce
 * @param locale - Current locale (en, es, etc.)
 * @returns Complete Next.js Metadata object
 */
export function generateProductMetadata(
  product: ProductMetadataInput,
  locale: string = 'en'
): Metadata {
  // Primary image (product image or first gallery image)
  const primaryImage =
    product.image?.sourceUrl ||
    product.galleryImages?.[0]?.sourceUrl ||
    SITE_CONFIG.defaultImage;
  const imageAlt =
    product.image?.altText ||
    `${product.name} - ${SITE_CONFIG.organizationName}`;

  // Description: Use short description first, fallback to full description
  const rawDescription = product.shortDescription || product.description;
  const description = stripHtml(rawDescription, 155);

  // AI-friendly extended description with technical context
  const aiDescription = `${product.name} by ${SITE_CONFIG.organizationName}. ${description}${
    product.sku ? ` Part Number: ${product.partNumber || product.sku}.` : ''
  }${product.price ? ` Price: ${product.price}.` : ''}${
    product.stockStatus
      ? ` Availability: ${product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Contact for Availability'}.`
      : ''
  } Engineered for building automation systems, HVAC control, and critical facility monitoring.`;

  // Title: Include part number if available for technical searches
  const titleSuffix = product.partNumber
    ? ` (${product.partNumber})`
    : product.sku
      ? ` (${product.sku})`
      : '';
  const title = `${product.name}${titleSuffix} | BAPI`;

  // Keywords: Combine product categories with site keywords
  const categoryKeywords =
    product.categories?.map((cat) => cat.name).filter(Boolean) || [];
  const keywords = [...categoryKeywords, ...SITE_CONFIG.keywords.slice(0, 10)];

  // Canonical URL
  const canonicalUrl = `products/${product.slug}`;

  return {
    title,
    description: aiDescription.slice(0, 160), // Meta description limit
    keywords: keywords.join(', '),
    openGraph: {
      type: 'product',
      title,
      description: aiDescription.slice(0, 160),
      url: getAbsoluteUrl(canonicalUrl),
      siteName: SITE_CONFIG.siteName,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [
        {
          url: primaryImage.startsWith('http')
            ? primaryImage
            : getAbsoluteUrl(primaryImage),
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/jpeg',
        },
      ],
      ...(product.price && {
        // Open Graph product-specific tags
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product: {
          price: {
            amount: parseFloat(product.price.replace(/[^0-9.]/g, '')),
            currency: 'USD',
          },
          availability:
            product.stockStatus === 'IN_STOCK' ? 'in stock' : 'out of stock',
          condition: 'new',
          retailer: SITE_CONFIG.organizationName,
        } as any,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title,
      description: description,
      images: [
        primaryImage.startsWith('http')
          ? primaryImage
          : getAbsoluteUrl(primaryImage),
      ],
    },
    alternates: {
      canonical: `/${locale}/${canonicalUrl}`,
      languages: {
        'en-US': `/en/${canonicalUrl}`,
        'es-ES': `/es/${canonicalUrl}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    // Additional AI-friendly metadata
    other: {
      'product:brand': SITE_CONFIG.organizationName,
      'product:condition': 'new',
      ...(product.sku && { 'product:sku': product.sku }),
      ...(product.partNumber && { 'product:mpn': product.partNumber }),
      ...(product.categories?.[0]?.name && {
        'product:category': product.categories[0].name,
      }),
    },
  };
}

/**
 * Generate metadata for category pages
 * 
 * Optimized for:
 * - Category browsing (clear navigation signals)
 * - Product discovery (category-level keywords)
 * - Hierarchy understanding (breadcrumb context)
 * 
 * @param category - Category data from WordPress
 * @param locale - Current locale
 * @returns Complete Next.js Metadata object
 */
export function generateCategoryMetadata(
  category: CategoryMetadataInput,
  locale: string = 'en'
): Metadata {
  const description =
    stripHtml(category.description, 155) ||
    `Browse ${category.name} products from ${SITE_CONFIG.organizationName}. Precision-engineered sensors and controllers for building automation, HVAC systems, and critical facility monitoring.`;

  const title = `${category.name} | ${SITE_CONFIG.siteName} Products`;
  const image =
    category.image?.sourceUrl ||
    SITE_CONFIG.defaultImage;
  const imageAlt =
    category.image?.altText || `${category.name} - ${SITE_CONFIG.siteName}`;

  // AI-friendly context
  const aiDescription = `${category.name} category featuring ${category.count || 'multiple'} products from ${SITE_CONFIG.organizationName}. ${description}`;

  const canonicalUrl = `products/${category.slug}`;

  return {
    title,
    description: aiDescription.slice(0, 160),
    openGraph: {
      type: 'website',
      title,
      description: aiDescription.slice(0, 160),
      url: getAbsoluteUrl(canonicalUrl),
      siteName: SITE_CONFIG.siteName,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [
        {
          url: image.startsWith('http') ? image : getAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      title,
      description: description,
      images: [image.startsWith('http') ? image : getAbsoluteUrl(image)],
    },
    alternates: {
      canonical: `/${locale}/${canonicalUrl}`,
      languages: {
        'en-US': `/en/${canonicalUrl}`,
        'es-ES': `/es/${canonicalUrl}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate metadata for static pages (About, Contact, Resources, etc.)
 * 
 * @param page - Page configuration
 * @param locale - Current locale
 * @returns Complete Next.js Metadata object
 */
export function generatePageMetadata(
  page: PageMetadataInput,
  locale: string = 'en'
): Metadata {
  const title = `${page.title} | ${SITE_CONFIG.siteName}`;
  const image = page.image || SITE_CONFIG.defaultImage;
  const type = page.type || 'website';

  return {
    title,
    description: page.description,
    keywords: page.keywords?.join(', '),
    openGraph: {
      type,
      title,
      description: page.description,
      url: getAbsoluteUrl(page.path),
      siteName: SITE_CONFIG.siteName,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [
        {
          url: image.startsWith('http') ? image : getAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: `${page.title} - ${SITE_CONFIG.siteName}`,
        },
      ],
      ...(page.publishedTime && { publishedTime: page.publishedTime }),
      ...(page.modifiedTime && { modifiedTime: page.modifiedTime }),
      ...(page.author && {
        authors: [page.author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      title,
      description: page.description,
      images: [image.startsWith('http') ? image : getAbsoluteUrl(image)],
    },
    alternates: {
      canonical: `/${locale}/${page.path}`,
      languages: {
        'en-US': `/en/${page.path}`,
        'es-ES': `/es/${page.path}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate default site metadata (for homepage and fallback)
 * 
 * @param locale - Current locale
 * @returns Complete Next.js Metadata object
 */
export function generateDefaultMetadata(locale: string = 'en'): Metadata {
  return {
    title: {
      default: SITE_CONFIG.defaultTitle,
      template: `%s | ${SITE_CONFIG.siteName}`,
    },
    description: SITE_CONFIG.defaultDescription,
    keywords: SITE_CONFIG.keywords.join(', '),
    authors: [{ name: SITE_CONFIG.organizationName }],
    creator: SITE_CONFIG.organizationName,
    publisher: SITE_CONFIG.organizationName,
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    openGraph: {
      type: 'website',
      title: SITE_CONFIG.defaultTitle,
      description: SITE_CONFIG.defaultDescription,
      url: SITE_CONFIG.siteUrl,
      siteName: SITE_CONFIG.siteName,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [
        {
          url: getAbsoluteUrl(SITE_CONFIG.defaultImage),
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.siteName} - Building Automation Products`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title: SITE_CONFIG.defaultTitle,
      description: SITE_CONFIG.defaultDescription,
      images: [getAbsoluteUrl(SITE_CONFIG.defaultImage)],
    },
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  };
}
