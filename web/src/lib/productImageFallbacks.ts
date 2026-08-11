type ProductImage = {
  sourceUrl: string;
  altText: string;
};

const productImageFallbacks: Record<string, ProductImage> = {
  'co-duct-and-rough-service-carbon-monoxide-sensor': {
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/CO-Duct-Rough-Main.png',
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

  return productImageFallbacks[slug] ?? null;
}
