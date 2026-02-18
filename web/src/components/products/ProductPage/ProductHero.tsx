'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRegion } from '@/store/regionStore';
import { convertWooCommercePrice } from '@/lib/utils/currency';

// Lazy load ImageModal for better initial page load performance
const ImageModal = dynamic(() => import('@/components/ui/ImageModal'), {
  ssr: false, // Modal only renders client-side
});

interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductHeroProps {
  product: {
    name: string;
    image?: GalleryImage | null;
    gallery?: GalleryImage[];
    partNumber?: string | null;
    sku?: string | null;
    shortDescription?: string | null;
    specs?: string | null;
    price?: string | null;
    multiplier?: string | null;
    stockStatus?: string | null;
    stockQuantity?: number | null;
    regularPrice?: string | null;
  };
  variation?: {
    image?: GalleryImage | null;
    name?: string;
  } | null;
}

/**
 * Product hero section with image gallery and pricing details.
 * Displays main product image with zoom capability, thumbnails for gallery navigation,
 * and key product information including pricing, stock status, and quantity selector.
 * 
 * **Phase 1 Priority**: Product Navigation (breadcrumbs, categories, mega-menu integration)
 * 
 * @param {ProductHeroProps} props - Product and variation data
 * @returns {JSX.Element} Product hero section with image modal
 * 
 * @example
 * ```tsx
 * <ProductHero 
 *   product={productData} 
 *   variation={selectedVariation} 
 * />
 * ```
 */
export default function ProductHero({ product, variation }: ProductHeroProps) {
  const t = useTranslations();
  const region = useRegion(); // Move to top level to avoid React Hooks violation
  
  // Prefer variation image if present, else product image
  const initialImage = variation?.image || product.image || null;
  const [mainImage, setMainImage] = useState<GalleryImage | null>(initialImage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gallery = product.gallery || [];

  // If variation changes, update mainImage to variation image
  React.useEffect(() => {
    setMainImage(variation?.image || product.image || null);
  }, [variation, product.image]);

  return (
    <section className="mb-8 flex flex-col items-start gap-8 md:flex-row">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        {mainImage ? (
          <div className="group relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative block h-72 w-72 cursor-zoom-in overflow-hidden rounded-xl bg-neutral-50 shadow"
              aria-label="Click to enlarge product image"
            >
              <Image
                src={mainImage.sourceUrl}
                alt={mainImage.altText || variation?.name || product.name}
                fill
                sizes="(max-width: 768px) 100vw, 288px"
                className="duration-base object-contain transition-transform hover:scale-105"
                priority
              />
              {/* Zoom icon overlay */}
              <div className="duration-base absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors group-hover:bg-black/20">
                <div className="duration-base rounded-full bg-white/90 p-3 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="mb-4 flex h-72 w-72 items-center justify-center rounded-xl bg-neutral-100 text-lg font-semibold text-neutral-400 shadow">
            No image
          </div>
        )}
        {/* Gallery thumbnails */}
        {gallery.length > 1 && (
          <div className="mt-2 flex gap-2 md:mt-0 md:flex-col">
            {gallery.map((img, idx) => (
              <button
                key={img.sourceUrl + idx}
                onClick={() => setMainImage(img)}
                className={`relative h-12 w-12 overflow-hidden rounded border bg-white p-1 ${mainImage?.sourceUrl === img.sourceUrl ? 'border-primary-500' : 'border-neutral-200'}`}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <Image
                  src={img.sourceUrl}
                  alt="Product thumbnail"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1">
        {/* Increased heading size for better hierarchy */}
        <h1 className="mb-3 text-4xl font-bold leading-tight text-neutral-900 lg:text-5xl">
          {product.name}
        </h1>

        {/* Part number with better visibility */}
        <div className="mb-4 flex items-center gap-2 text-base text-neutral-600">
          <span className="text-neutral-500">{t('productPage.summary.partNumber')}:</span>
          <span className="font-semibold text-neutral-900">
            {product.partNumber || product.sku || 'N/A'}
          </span>
        </div>

        {product.shortDescription && (
          <div className="mb-6 text-lg leading-relaxed text-neutral-700">
            {product.shortDescription}
          </div>
        )}
        {product.specs && <div className="mb-6 text-neutral-600">{product.specs}</div>}

        {/* Pricing section with better visual prominence */}
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex flex-col gap-3">
            {product.regularPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">List Price:</span>
                <span className="text-lg font-semibold text-neutral-700">
                  {convertWooCommercePrice(product.regularPrice, region.currency)}
                </span>
              </div>
            )}
            {product.multiplier && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">{t('productPage.summary.multiplier')}:</span>
                <span className="text-lg font-semibold text-primary-600">{product.multiplier}</span>
              </div>
            )}
            {typeof product.stockQuantity === 'number' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">In Stock:</span>
                <span className="text-lg font-semibold text-green-700">
                  {product.stockQuantity} units
                </span>
              </div>
            )}
            {product.stockStatus && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-600' : 'bg-red-600'}`}
                ></span>
                {product.stockStatus.replace('_', ' ')}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4">
          {typeof product.stockQuantity === 'number' && product.stockQuantity > 0 && (
            <>
              <label htmlFor="quantity" className="block font-medium text-neutral-700">
                {t('productPage.summary.quantity')}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                max={product.stockQuantity}
                defaultValue={1}
                className="w-24 rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {mainImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          src={mainImage.sourceUrl}
          alt={mainImage.altText || variation?.name || product.name}
        />
      )}
    </section>
  );
}