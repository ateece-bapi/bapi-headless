

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
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">{product.name}</h1>
        <div className="text-sm text-neutral-500 mb-2">
          Part Number: <span className="font-medium text-neutral-800">{product.partNumber || product.sku || 'N/A'}</span>
        </div>
        {product.shortDescription && (
          <div className="mb-4 text-neutral-700">{product.shortDescription}</div>
        )}
        {product.specs && (
          <div className="mb-4 text-neutral-600 text-sm">{product.specs}</div>
        )}
        <div className="flex flex-col gap-2 mb-4">
          {product.regularPrice && (
            <div className="text-sm text-neutral-500">List Price: <span className="font-medium text-neutral-800">{product.regularPrice}</span></div>
          )}
          {product.multiplier && (
            <div className="text-sm text-neutral-500">Multiplier: <span className="font-medium text-neutral-800">{product.multiplier}</span></div>
          )}
          {typeof product.stockQuantity === 'number' && (
            <div className="text-sm text-neutral-500">In Stock: <span className="font-medium text-neutral-800">{product.stockQuantity}</span></div>
          )}
          {product.stockStatus && (
            <div className={`text-xs font-semibold ${product.stockStatus === 'IN_STOCK' ? 'text-green-700' : 'text-red-600'}`}>{product.stockStatus.replace('_', ' ')}</div>
          )}
        </div>
        <div className="flex items-center gap-4 mb-4">
          {typeof product.stockQuantity === 'number' && product.stockQuantity > 0 && (
            <>
              <label htmlFor="quantity" className="block font-medium">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                max={product.stockQuantity}
                defaultValue={1}
                className="border rounded px-3 py-2 w-20"
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
