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
      <div className="bg-neutral-100 rounded-xl aspect-square flex items-center justify-center">
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
          className="relative bg-white rounded-xl overflow-hidden border border-neutral-200 group cursor-zoom-in"
          onClick={() => openLightbox(selectedIndex)}
        >
          <div className="aspect-square relative">
            <Image
              src={currentImage.sourceUrl}
              alt={currentImage.altText || productName}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            
            {/* Zoom overlay hint */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg">
                <ZoomIn className="w-6 h-6 text-neutral-700" />
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-neutral-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-neutral-700" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${selectedIndex === index 
                    ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' 
                    : 'border-neutral-200 hover:border-primary-300'
                  }
                `}
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
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[1090] flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8 text-white" />
          </button>
          
          {/* Image counter */}
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white font-medium">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
          
          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
          
          {/* Main image */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto px-4">
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <p className="text-white text-sm flex items-center gap-4">
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
