

"use client";
import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ImageModal from '@/components/ui/ImageModal';

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


export default function ProductHero({ product, variation }: ProductHeroProps) {
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
    <section className="flex flex-col md:flex-row items-start gap-8 mb-8">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
        {mainImage ? (
          <div className="relative group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative w-72 h-72 block cursor-zoom-in"
              aria-label="Click to enlarge product image"
            >
              <img
                src={mainImage.sourceUrl}
                alt={mainImage.altText || variation?.name || product.name}
                className="w-full h-full object-contain bg-neutral-50 rounded-xl shadow transition-transform duration-base hover:scale-105"
              />
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-base rounded-xl">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-base bg-white/90 rounded-full p-3 shadow-lg">
                  <ZoomIn className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="w-72 h-72 flex items-center justify-center bg-neutral-100 rounded-xl shadow mb-4 text-neutral-400 text-lg font-semibold">
            No image
          </div>
        )}
        {/* Action buttons now in summary card */}
        {gallery.length > 1 && (
          <div className="flex gap-2 mt-2 md:mt-0">
            {gallery.map((img, idx) => (
              <button
                key={img.sourceUrl + idx}
                onClick={() => setMainImage(img)}
                className={`border rounded p-1 bg-white ${mainImage?.sourceUrl === img.sourceUrl ? 'border-primary-500' : 'border-neutral-200'}`}
              >
                <img src={img.sourceUrl} alt="Product thumbnail" className="w-12 h-12 object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1">
        {/* Increased heading size for better hierarchy */}
        <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-neutral-900 leading-tight">{product.name}</h1>
        
        {/* Part number with better visibility */}
        <div className="text-base text-neutral-600 mb-4 flex items-center gap-2">
          <span className="text-neutral-500">Part Number:</span>
          <span className="font-semibold text-neutral-900">{product.partNumber || product.sku || 'N/A'}</span>
        </div>
        
        {product.shortDescription && (
          <div className="mb-6 text-neutral-700 text-lg leading-relaxed">{product.shortDescription}</div>
        )}
        {product.specs && (
          <div className="mb-6 text-neutral-600">{product.specs}</div>
        )}
        
        {/* Pricing section with better visual prominence */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6 border border-neutral-200">
          <div className="flex flex-col gap-3">
            {product.regularPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">List Price:</span>
                <span className="text-lg font-semibold text-neutral-700">{product.regularPrice}</span>
              </div>
            )}
            {product.multiplier && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Multiplier:</span>
                <span className="text-lg font-semibold text-primary-600">{product.multiplier}</span>
              </div>
            )}
            {typeof product.stockQuantity === 'number' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">In Stock:</span>
                <span className="text-lg font-semibold text-green-700">{product.stockQuantity} units</span>
              </div>
            )}
            {product.stockStatus && (
              <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full w-fit ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <span className={`w-2 h-2 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {product.stockStatus.replace('_', ' ')}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          {typeof product.stockQuantity === 'number' && product.stockQuantity > 0 && (
            <>
              <label htmlFor="quantity" className="block font-medium text-neutral-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                max={product.stockQuantity}
                defaultValue={1}
                className="border border-neutral-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          imageSrc={mainImage.sourceUrl}
          imageAlt={mainImage.altText || variation?.name || product.name}
        />
      )}
    </section>
  );
}
