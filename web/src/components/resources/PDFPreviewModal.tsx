'use client';

import { useEffect } from 'react';
import { XCircleIcon, DownloadIcon } from '@/lib/icons';

interface PDFPreviewModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

function getSafePdfUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const isHttp = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    return isHttp && parsedUrl.pathname.toLowerCase().endsWith('.pdf') ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}

export default function PDFPreviewModal({ url, title, onClose }: PDFPreviewModalProps) {
  const safePdfUrl = getSafePdfUrl(url);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal open (capture previous value for restoration)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Handle backdrop click (click outside modal)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on backdrop, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
    >
      {/* Modal Container */}
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 id="pdf-preview-title" className="truncate text-lg font-bold text-neutral-900">{title}</h2>
          <div className="flex items-center gap-2">
            {safePdfUrl && (
              <a
                href={safePdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </a>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close preview"
              title="Close (ESC)"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer - Using iframe for better compatibility */}
        <div className="flex-1 overflow-hidden">
          {safePdfUrl ? (
            <iframe
              src={safePdfUrl}
              className="h-full w-full border-0"
              title={`PDF Preview: ${title}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-neutral-700">
              This document cannot be previewed safely.
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <p>
              Tip: Use your browser&apos;s built-in PDF controls to navigate pages, zoom, and print.
            </p>
            <p className="text-neutral-500">
              Click outside or press <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-neutral-700">ESC</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
