'use client';

import { useEffect } from 'react';
import logger from '@/lib/logger';

export default function ProductsErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('products.error_boundary', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div 
      className="min-h-[60vh] flex items-center justify-center px-6 bg-neutral-50"
    >
      <div className="max-w-lg text-center">
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-primary-50"
        >
          <svg 
            className="w-10 h-10 text-primary-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
            />
          </svg>
        </div>
        
        <h2 
          className="text-2xl font-bold mb-3 text-neutral-900"
        >
          Unable to load products
        </h2>
        
        <p 
          className="text-base mb-6 text-neutral-600"
        >
          We're having trouble loading our product catalog. This could be a temporary issue with our systems.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold error-btn-primary"
          >
            Retry loading
          </button>
          
          <a 
            href="/"
            className="px-6 py-3 rounded-lg font-semibold border error-btn-secondary"
          >
            Back to home
          </a>
        </div>
        
        <div 
          className="mt-8 p-4 rounded-lg text-sm text-left bg-primary-50 border-l-4 border-primary-500"
        >
          <p className="font-semibold mb-1 text-primary-900">
            Need help right away?
          </p>
          <p className="text-primary-700">
            Contact our team: <a href="tel:6087354800" className="underline">(608) 735-4800</a> or{' '}
            <a href="mailto:sales@bapihvac.com" className="underline">sales@bapihvac.com</a>
          </p>
        </div>
        
        {error.digest && (
          <p 
            className="text-xs mt-6 text-neutral-400"
          >
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
