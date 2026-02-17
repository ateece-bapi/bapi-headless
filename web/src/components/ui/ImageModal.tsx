'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Image modal with zoom, pan, and rotate capabilities
 * Uses Next.js Image component for optimization
 */
export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  // Use lazy initial state to avoid resetting on every isOpen change
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(isOpen);

  // Reset transforms when modal opens
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      // Valid: Resetting state when modal opens (batched updates)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)));
    };

    document.addEventListener('keydown', handleKeyDown);
    imageRef.current?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      imageRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, onClose]);

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(3, prev + 0.25));
  const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5 text-neutral-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5 text-neutral-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRotate();
          }}
          className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100"
          aria-label="Rotate"
        >
          <RotateCw className="h-5 w-5 text-neutral-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-lg transition-colors hover:bg-neutral-100"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-neutral-700" />
        </button>
      </div>

      {/* Image Container */}
      <div
        ref={imageRef}
        className="relative max-h-[90vh] max-w-[90vw] cursor-move select-none"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          quality={90}
          priority
          unoptimized={src.startsWith('data:')} // Allow data URLs for base64 images
        />
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white px-3 py-1 text-sm font-medium shadow-lg">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}