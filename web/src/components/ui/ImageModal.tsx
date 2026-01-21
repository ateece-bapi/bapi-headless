'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

/**
 * Full-screen image modal with zoom and pan controls
 * 
 * Features:
 * - Click outside to close
 * - ESC key to close
 * - Mouse wheel zoom (desktop)
 * - Pinch-to-zoom (mobile/trackpad)
 * - Drag to pan when zoomed
 * - Zoom in/out buttons
 * - Reset button
 * - Backdrop blur effect
 * - Accessible with ARIA labels
 */
export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Reset zoom/pan when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle ESC key and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(1, Math.min(5, prev + delta)));
  };

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(5, prev + 0.5));
  const zoomOut = () => setScale((prev) => Math.max(1, prev - 0.5));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile pinch-to-zoom
  const [touchDistance, setTouchDistance] = useState(0);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance > 0) {
      const newDistance = getTouchDistance(e.touches);
      const scaleDelta = (newDistance - touchDistance) / 200;
      setScale((prev) => Math.max(1, Math.min(5, prev + scaleDelta)));
      setTouchDistance(newDistance);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product image enlarged view"
    >
      {/* Control bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-lg">
        <button
          onClick={zoomOut}
          disabled={scale <= 1}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-base disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-neutral-700" />
        </button>
        <span className="text-sm font-medium text-neutral-700 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          disabled={scale >= 5}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-base disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-neutral-700" />
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          onClick={resetZoom}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-base"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-5 h-5 text-neutral-700" />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors duration-base"
        aria-label="Close image modal"
      >
        <X className="w-6 h-6 text-neutral-900" />
      </button>

      {/* Image container */}
      <div
        ref={imageRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative max-w-7xl max-h-[90vh] p-4 overflow-hidden ${
          scale > 1 ? 'cursor-move' : 'cursor-default'
        }`}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm text-center">
        <div>Scroll or pinch to zoom • Drag to pan • Press ESC or click outside to close</div>
      </div>
    </div>
  );
}
