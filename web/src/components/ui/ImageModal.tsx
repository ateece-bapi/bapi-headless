'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

/**
 * Full-screen image modal with keyboard navigation support
 * 
 * Features:
 * - Click outside to close
 * - ESC key to close
 * - Backdrop blur effect
 * - Centered image with max dimensions
 * - Accessible with ARIA labels
 */
export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product image enlarged view"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors duration-base"
        aria-label="Close image modal"
      >
        <X className="w-6 h-6 text-neutral-900" />
      </button>

      {/* Image container - click stops propagation to prevent closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-7xl max-h-[90vh] p-4"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* ESC hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
        Press ESC or click outside to close
      </div>
    </div>
  );
}
