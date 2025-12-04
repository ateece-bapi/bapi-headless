// src/lib/seo.ts

/**
 * Utility functions for generating SEO metadata and JSON-LD structured data.
 */

export function getSiteMetadata() {
  return {
    title: {
      default: "BAPI | Building Automation Products",
      template: "%s | BAPI"
    },
    description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
    openGraph: {
      title: "BAPI | Building Automation Products",
      description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
      type: "website",
      url: "https://yourdomain.com/",
      siteName: "BAPI",
      images: [
        {
          url: "https://yourdomain.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: "BAPI - Building Automation Products"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@bapi",
      title: "BAPI | Building Automation Products",
      description: "Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.",
      images: ["https://yourdomain.com/og-default.jpg"]
    },
    metadataBase: new URL("https://yourdomain.com/"),
    alternates: {
      canonical: "/"
    }
  };
}

export function getProductMetadata(product: any) {
  const ogImage = product?.image?.sourceUrl || (product?.gallery?.[0]?.sourceUrl ?? "");
  const ogDescription = product?.shortDescription || product?.description || '';
  return {
    title: `${product.name} | BAPI`,
    description: ogDescription,
    openGraph: {
      title: product.name,
      description: ogDescription,
      type: "product",
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/products/${product.slug}`
    }
  };
}

export function getProductJsonLd(product: any) {
  const ogImage = product?.image?.sourceUrl || (product?.gallery?.[0]?.sourceUrl ?? "");
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
      availability: product.stockStatus === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://yourdomain.com/products/${product.slug}`,
    },
  };
}

export function getCollectionPageJsonLd({ title, description, url }: { title: string, description: string, url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
  };
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BAPI',
    url: 'https://yourdomain.com/',
    description: 'Shop building automation sensors and control modules. Reliable, accurate, and trusted by professionals.'
  };
}
