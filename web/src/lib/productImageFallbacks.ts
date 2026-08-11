type ProductImage = {
  sourceUrl: string;
  altText: string;
};

type ProductImageFallback = Omit<ProductImage, 'sourceUrl'> & {
  pathname: string;
};

const productImageFallbacks: Record<string, ProductImageFallback> = {
  'co-duct-and-rough-service-carbon-monoxide-sensor': {
    pathname: '/wp-content/uploads/CO-Duct-Rough-Main.png',
    altText: 'CO duct and rough service carbon monoxide sensor',
  },
};

/** Returns the CMS product image, or a known fallback when the CMS image is missing. */
export function getProductImage(
  slug: string,
  image?: { sourceUrl?: string | null; altText?: string | null } | null
): ProductImage | null {
  if (image?.sourceUrl) {
    return {
      sourceUrl: image.sourceUrl,
      altText: image.altText || '',
    };
  }

  const fallback = productImageFallbacks[slug];
  const wordpressEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

  if (!fallback || !wordpressEndpoint) return null;

  try {
    return {
      sourceUrl: new URL(fallback.pathname, wordpressEndpoint).toString(),
      altText: fallback.altText,
    };
  } catch {
    return null;
  }
}
