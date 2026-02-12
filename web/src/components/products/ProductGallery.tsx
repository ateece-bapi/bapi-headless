'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

/**
 * Enhanced product gallery with lightbox, zoom, and keyboard navigation
 *
 * Features:
 * - Thumbnail navigation
 * - Lightbox modal for full-size viewing
 * - Keyboard controls (Arrow keys, ESC)
 * - Touch gestures for mobile
 * - Image zoom on hover
 * - Responsive layout
 *
 * @param images - Array of gallery images
 * @param productName - Product name for alt text fallback
 */
export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedIndex] || images[0];

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    if (isLightboxOpen) {
      setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  }, [isLightboxOpen, images.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    if (isLightboxOpen) {
      setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  }, [isLightboxOpen, images.length]);

  // Open lightbox
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

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

  // Touch gestures for mobile
  useEffect(() => {
    if (!isLightboxOpen) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        goToNext();
      }
      if (touchEndX - touchStartX > swipeThreshold) {
        goToPrevious();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLightboxOpen, goToNext, goToPrevious]);

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
        >
          <div className="relative aspect-square">
            <Image
              src={currentImage.sourceUrl}
              alt={currentImage.altText || productName}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />

            {/* Zoom overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10">
              <div className="rounded-full bg-white p-3 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="h-6 w-6 text-neutral-700" />
              </div>
            </div>
          </div>

          {/* Navigation arrows (only if multiple images) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
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
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 10vw, 20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="z-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-95">
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
            <Image
              src={images[lightboxIndex].sourceUrl}
              alt={images[lightboxIndex].altText || `${productName} - Image ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
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
