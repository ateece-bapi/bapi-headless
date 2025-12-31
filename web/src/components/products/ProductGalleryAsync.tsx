import React, { Suspense } from 'react';
import Image from 'next/image';
import { getProductDetailsDeferred } from '@/lib/graphql';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {product.galleryImages.nodes.map((image, index) => {
        if (!image?.sourceUrl) return null;
        
        const width = image.mediaDetails?.width || 400;
        const height = image.mediaDetails?.height || 300;
        
        return (
          <div key={image.id || index} className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
            <Image
              src={image.sourceUrl}
              alt={image.altText || `${productName} gallery image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover hover-scale"
            />
          </div>
        );
      })}
    </div>
  );
  } catch (error) {
    console.error('[ProductGalleryAsync] Error fetching gallery:', error);
    return null;
  }
}

function ProductGallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative aspect-square bg-neutral-100 rounded-lg animate-pulse" />
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
