'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon, RotateCwIcon } from '@/lib/icons';

export interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductVariation {
  id: string;
  image?: GalleryImage | null;
  name?: string;
  [key: string]: unknown;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
  variation?: {
    id?: string;
    image?: GalleryImage | null;
    name?: string;
  } | null;
  variations?: ProductVariation[];
  hasVideos?: boolean;
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
 * - Multi-variation image support (shows all variation images in gallery)
 * - Auto-selects variation image when variation changes
 *
 * @param images - Array of base gallery images
 * @param productName - Product name for alt text fallback
 * @param variation - Selected variation (auto-selects its image in gallery)
 * @param variations - All product variations (their images are added to gallery)
 * @param hasVideos - Whether product has videos (shows video icon link to Videos tab)
 */
export default function ProductGallery({ images, productName, variation, variations = [], hasVideos = false }: ProductGalleryProps) {
  // Build comprehensive gallery: base images + all unique variation images
  const galleryImages = React.useMemo(() => {
    const allImages = [...images];
    const seenUrls = new Set(images.map(img => img.sourceUrl));

    // Add all variation images (if not already in gallery)
    variations.forEach((v) => {
      if (v.image?.sourceUrl && !seenUrls.has(v.image.sourceUrl)) {
        allImages.push(v.image);
        seenUrls.add(v.image.sourceUrl);
      }
    });

    return allImages;
  }, [images, variations]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scale, setScale] = useState(1);

  // Track previous variation to detect changes (useRef avoids re-renders)
  const variationKey = variation?.id || variation?.name || variation?.image?.sourceUrl || 'default';
  const prevVariationKeyRef = React.useRef(variationKey);

  // Auto-select variation image when variation changes
  React.useEffect(() => {
    if (variationKey !== prevVariationKeyRef.current) {
      prevVariationKeyRef.current = variationKey;
      
      // Find the index of the selected variation's image in the gallery
      if (variation?.image?.sourceUrl) {
        const variationImageIndex = galleryImages.findIndex(
          (img) => img.sourceUrl === variation.image!.sourceUrl
        );
        if (variationImageIndex !== -1) {
          setSelectedIndex(variationImageIndex);
          return;
        }
      }
      
      // Fallback to first image if variation image not found
      setSelectedIndex(0);
    }
  }, [variationKey, galleryImages, variation]);

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
        // Zoom shortcuts
        case '+':
        case '=': // = key also triggers zoom in (no shift needed)
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext, closeLightbox, zoomIn, zoomOut, resetView]);

  // Mouse wheel zoom
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isLightboxOpen, zoomIn, zoomOut]);

  // Cleanup body scroll on unmount (in case user navigates away while lightbox open)
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
          {/* 
            Using Next.js Image for optimized LCP and Speed Index:
            - Automatic image optimization and modern format delivery (WebP/AVIF)
            - Priority loading for first image improves Speed Index
            - Transform effects still work with proper positioning
            - Lazy loading for subsequent gallery images
            - Better performance metrics for Core Web Vitals
          */}
          <Image
            src={currentImage.sourceUrl}
            alt={currentImage.altText || productName}
            fill
            priority={selectedIndex === 0} // Priority for first image only
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
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

        {/* Thumbnails - Horizontal row matching Matt's mockup */}
        {/* Show thumbnails if multiple images OR if product has videos (to show video icon) */}
        {(hasMultipleImages || hasVideos) && (
          <div className="flex justify-center gap-3 mt-4">
            {hasMultipleImages && galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-16 w-16 overflow-hidden rounded-full border-2 transition-all ${
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
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
            
            {/* Video tab link icon */}
            {hasVideos && (
              <button
                onClick={() => {
                  // First, activate the videos tab
                  const videosButton = document.querySelector('[data-tab-id="videos"]');
                  if (videosButton instanceof HTMLElement) {
                    videosButton.click();
                  }
                  
                  // Then scroll to the tabs section
                  const tabsSection = document.querySelector('#product-tabs');
                  if (tabsSection) {
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const elementPosition = tabsSection.getBoundingClientRect().top + window.scrollY;
                    const offset = 120;
                    
                    window.scrollTo({ 
                      top: elementPosition - offset, 
                      behavior: prefersReducedMotion ? 'auto' : 'smooth' 
                    });
                    
                    // Focus the videos tab button after scrolling
                    setTimeout(() => {
                      if (videosButton instanceof HTMLElement) {
                        videosButton.focus({ preventScroll: true });
                      }
                    }, prefersReducedMotion ? 0 : 300);
                  }
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-900/90 transition-all hover:border-primary-300 hover:bg-neutral-900"
                aria-label="View product videos"
                title="Watch product videos"
              >
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal - Rendered via Portal to document.body */}
      {isLightboxOpen && createPortal(
          <div 
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
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
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
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
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
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
              className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
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
            className="transition-transform hover:scale-110 hover:bg-neutral-100"
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
              border: 'none',
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
                className="group-hover:scale-110 transition-transform hover:bg-neutral-100"
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
                  border: 'none',
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
                className="group-hover:scale-110 transition-transform hover:bg-neutral-100"
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
                  border: 'none',
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
