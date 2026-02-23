/**
 * Storybook-Only Product Gallery
 * 
 * This is a story-specific implementation that uses standard HTML <img> tags
 * instead of Next/Image to ensure compatibility with Chromatic's static builds.
 * 
 * The production ProductGallery.tsx uses Next/Image for optimization, but
 * Next/Image's `fill` prop doesn't render properly in Storybook/Chromatic env.
 * 
 * This provides the same visual demonstration for designers without framework conflicts.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface StorybookProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export default function StorybookProductGallery({
  images,
  productName,
}: StorybookProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedIndex];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext, closeLightbox]);

  if (!currentImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-100">
        <p className="text-neutral-500">No image available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-neutral-200 bg-white"
          onClick={() => openLightbox(selectedIndex)}
          style={{ width: '640px', height: '640px' }}
        >
          <img
            src={currentImage.sourceUrl}
            alt={currentImage.altText || productName}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            className="transition-transform duration-300 group-hover:scale-105"
            loading="eager"
          />

          {/* Zoom overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10">
            <div className="rounded-full bg-white p-3 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-6 w-6 text-neutral-700" />
            </div>
          </div>

          {/* Navigation arrows (only if multiple images) */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-neutral-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                    setSelectedIndex((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-neutral-700" />
                </button>
              </>
            )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2'
                    : 'border-neutral-200 hover:border-primary-300'
                } `}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.sourceUrl}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <p className="font-medium text-white">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="relative mx-auto h-full max-h-[90vh] w-full max-w-7xl px-4">
            <img
              src={images[lightboxIndex].sourceUrl}
              alt={images[lightboxIndex].altText || `${productName} - Image ${lightboxIndex + 1}`}
              className="h-full w-full object-contain"
              loading="eager"
            />
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
            <p className="flex items-center gap-4 text-sm text-white">
              <span className="hidden sm:inline">Use arrow keys to navigate</span>
              <span>•</span>
              <span>ESC to close</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
