'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { XIcon, ZoomInIcon, ZoomOutIcon, RotateCwIcon } from '@/lib/icons';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Advanced Image Modal - Full Featured
 * Zoom, pan, reset view, keyboard shortcuts, touch gestures
 */
export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const [scale, setScale] = useState(2); // Start at 200%
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Zoom functions (declared before use in keyboard handler)
  const zoomIn = useCallback(() => setScale((prev) => Math.min(5, prev + 0.5)), []);
  const zoomOut = useCallback(() => setScale((prev) => Math.max(1, prev - 0.5)), []);
  const resetView = useCallback(() => {
    setScale(2);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetView();
    };

    // Store previous overflow to restore on cleanup
    const previousOverflow = document.body.style.overflow;
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, zoomIn, zoomOut, resetView]);

  // Prevent SSR rendering of Portal (client-only)
  if (typeof window === 'undefined') return null;

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((prev) => Math.max(1, Math.min(5, prev + delta)));
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

  const handleMouseUp = () => setIsDragging(false);

  // Touch pinch-to-zoom
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
    if (e.touches.length === 2 && touchDistance !== null) {
      const newDistance = getTouchDistance(e.touches);
      const scaleDelta = (newDistance - touchDistance) / 200;
      setScale((prev) => Math.max(1, Math.min(5, prev + scaleDelta)));
      setTouchDistance(newDistance);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - Image viewer`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
      }}
    >
      {/* CONTROL BAR */}
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
            borderRadius: '50%',
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

      {/* CLOSE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
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

      {/* MODAL BACKGROUND WITH IMAGE */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default',
        }}
        onClick={onClose}
        onWheel={handleWheel}
      >
        <div
          ref={imageRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* INSTRUCTIONS */}
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
        Scroll or pinch to zoom • Drag to pan • Press ESC or click outside to close
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
