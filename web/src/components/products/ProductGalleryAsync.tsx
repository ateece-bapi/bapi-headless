import React, { Suspense } from 'react';
import Image from 'next/image';
import { getProductDetailsDeferred } from '@/lib/graphql';
import logger from '@/lib/logger';

interface ProductGalleryAsyncProps {
  productId: string;
  productName: string;
}

async function ProductGalleryContent({ productId, productName }: ProductGalleryAsyncProps) {
  try {
    const data = await getProductDetailsDeferred(productId);
    const product = data.product;

    if (!product?.galleryImages?.nodes || product.galleryImages.nodes.length === 0) {
      return null;
    }

    return (
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {product.galleryImages.nodes.map((image, index) => {
          if (!image?.sourceUrl) return null;

          const width = image.mediaDetails?.width || 400;
          const height = image.mediaDetails?.height || 300;

          return (
            <div
              key={image.id || index}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={image.sourceUrl}
                alt={image.altText || `${productName} gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="hover-scale object-cover"
              />
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    logger.error('[ProductGalleryAsync] Error fetching gallery', error);
    return null;
  }
}

function ProductGallerySkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative aspect-square animate-pulse rounded-lg bg-neutral-100" />
      ))}
    </div>
  );
}

export function ProductGalleryAsync(props: ProductGalleryAsyncProps) {
  return (
    <Suspense fallback={<ProductGallerySkeleton />}>
      <ProductGalleryContent {...props} />
    </Suspense>
  );
}
