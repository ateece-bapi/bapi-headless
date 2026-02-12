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
      className="z-modal fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product image enlarged view"
    >
      {/* Control bar */}
      <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-lg">
        <button
          onClick={zoomOut}
          disabled={scale <= 1}
          className="duration-base rounded-full p-2 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5 text-neutral-700" />
        </button>
        <span className="min-w-[60px] text-center text-sm font-medium text-neutral-700">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          disabled={scale >= 5}
          className="duration-base rounded-full p-2 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="mx-1 h-6 w-px bg-neutral-300" />
        <button
          onClick={resetZoom}
          className="duration-base rounded-full p-2 transition-colors hover:bg-neutral-100"
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-5 w-5 text-neutral-700" />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="duration-base absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2 shadow-lg transition-colors hover:bg-white"
        aria-label="Close image modal"
      >
        <X className="h-6 w-6 text-neutral-900" />
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
        className={`relative max-h-[90vh] max-w-7xl overflow-hidden p-4 ${
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
          className="max-h-[85vh] max-w-full select-none rounded-lg object-contain shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform text-center text-sm text-white/80">
        <div>Scroll or pinch to zoom • Drag to pan • Press ESC or click outside to close</div>
      </div>
    </div>
  );
}
