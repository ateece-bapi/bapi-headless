'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon, RotateCwIcon } from '@/lib/icons';

export interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
  variation?: {
    image?: GalleryImage | null;
    name?: string;
  } | null;
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
 * - Variation-specific images (shown first when variation selected)
 *
 * @param images - Array of gallery images
 * @param productName - Product name for alt text fallback
 * @param variation - Selected variation (shows variation image first)
 */
export default function ProductGallery({ images, productName, variation }: ProductGalleryProps) {
  // If variation has an image, prepend it to the gallery
  const galleryImages = React.useMemo(() => {
    if (variation?.image) {
      // Check if variation image is already in gallery to avoid duplicates
      const isDuplicate = images.some(img => img.sourceUrl === variation.image?.sourceUrl);
      if (isDuplicate) {
        // Move variation image to front
        return [
          variation.image,
          ...images.filter(img => img.sourceUrl !== variation.image?.sourceUrl)
        ];
      }
      // Add variation image at front
      return [variation.image, ...images];
    }
    return images;
  }, [images, variation]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scale, setScale] = useState(1);

  // Reset to first image when variation changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [variation]);

  const hasMultipleImages = galleryImages.length > 1;
  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    if (isLightboxOpen) {
      setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    } else {
      setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    }
  }, [isLightboxOpen, galleryImages.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    if (isLightboxOpen) {
      setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    } else {
      setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  }, [isLightboxOpen, galleryImages.length]);

  // Open lightbox
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setScale(1); // Reset scale when opening
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setScale(1); // Reset scale when closing
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 1));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
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
        <p className="text-neutral-700">No image available</p>
      </div>
    );
  }

  // Helper to conditionally use Portal in production vs inline rendering in tests
  return (
    <>
      {/* Main Gallery */}
      <div className="w-full space-y-4">
        {/* Main Image */}
        <div
          data-testid="main-image-container"
          className="group relative flex h-[400px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white md:h-[450px]"
          onClick={() => openLightbox(selectedIndex)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.sourceUrl}
            alt={currentImage.altText || productName}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Zoom overlay hint - NO background, only icon */}
          <div 
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="pointer-events-auto rounded-full bg-white p-3 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              <ZoomInIcon className="h-6 w-6 text-neutral-700" data-testid="zoom-image-icon" />
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
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6 text-neutral-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6 text-neutral-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {galleryImages.map((image, index) => (
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

      {/* Lightbox Modal - Rendered via Portal to document.body */}
      {isLightboxOpen && createPortal(
          <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99990,
          }}
          onClick={closeLightbox}
        >
          {/* Zoom Controls - Top Center */}
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '50px',
              padding: '8px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={scale <= 1}
              aria-label="Zoom out"
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50%',
                cursor: scale <= 1 ? 'not-allowed' : 'pointer',
                opacity: scale <= 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (scale > 1) e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ZoomOutIcon style={{ width: '20px', height: '20px', color: '#404040' }} />
            </button>

            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
                minWidth: '60px',
                textAlign: 'center',
              }}
              aria-live="polite"
            >
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={scale >= 5}
              aria-label="Zoom in"
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50%',
                cursor: scale >= 5 ? 'not-allowed' : 'pointer',
                opacity: scale >= 5 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (scale < 5) e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ZoomInIcon style={{ width: '20px', height: '20px', color: '#404040' }} />
            </button>

            <div style={{ width: '1px', height: '24px', backgroundColor: '#d4d4d4', margin: '0 4px' }} />

            <button
              onClick={(e) => {
                e.stopPropagation();
                resetView();
              }}
              aria-label="Reset view"
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#404040',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <RotateCwIcon style={{ width: '16px', height: '16px' }} />
              Reset
            </button>
          </div>

          {/* Close button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close lightbox"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              backgroundColor: 'white',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 99999,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, background-color 0.2s',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <XIcon style={{ width: '24px', height: '24px', color: '#171717' }} />
          </button>

          {/* Image counter - Top Left */}
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '8px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 99999,
            }}
          >
            <p style={{ fontWeight: 600, color: '#171717', margin: 0, fontSize: '14px' }}>
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </div>

          {/* Navigation arrows - Center Left/Right */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
                style={{
                  position: 'fixed',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 99999,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s, background-color 0.2s',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <ChevronLeftIcon style={{ width: '28px', height: '28px', color: '#171717' }} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
                style={{
                  position: 'fixed',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 99999,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s, background-color 0.2s',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <ChevronRightIcon style={{ width: '28px', height: '28px', color: '#171717' }} />
              </button>
            </>
          )}

          {/* Main image container */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 99991,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[lightboxIndex].sourceUrl}
              alt={galleryImages[lightboxIndex].altText || `${productName} - Image ${lightboxIndex + 1}`}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
                userSelect: 'none',
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-out',
              }}
              draggable={false}
            />
          </div>

          {/* Keyboard hints - Bottom Center */}
          <div 
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '14px',
              zIndex: 99999,
              opacity: 0.8,
              textAlign: 'center',
            }}
          >
            {hasMultipleImages ? 'Use arrow keys to navigate • Press ESC or click outside to close' : 'Press ESC or click outside to close'}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
