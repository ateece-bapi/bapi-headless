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
      className="min-h-[60vh] flex items-center justify-center px-6"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="max-w-lg text-center">
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary-50)' }}
        >
          <svg 
            className="w-10 h-10" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: 'var(--color-primary-600)' }}
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
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-neutral-900)' }}
        >
          Unable to load products
        </h2>
        
        <p 
          className="text-base mb-6"
          style={{ color: 'var(--color-neutral-600)' }}
        >
          We're having trouble loading our product catalog. This could be a temporary issue with our systems.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ 
              background: 'var(--color-primary-600)',
              color: 'white'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--color-primary-700)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary-600)'}
          >
            Retry loading
          </button>
          
          <a 
            href="/"
            className="px-6 py-3 rounded-lg font-semibold transition-colors border"
            style={{ 
              borderColor: 'var(--color-neutral-300)',
              color: 'var(--color-neutral-700)'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--color-neutral-100)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            Back to home
          </a>
        </div>
        
        <div 
          className="mt-8 p-4 rounded-lg text-sm text-left"
          style={{ 
            background: 'var(--color-primary-50)',
            borderLeft: '4px solid var(--color-primary-500)'
          }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--color-primary-900)' }}>
            Need help right away?
          </p>
          <p style={{ color: 'var(--color-primary-700)' }}>
            Contact our team: <a href="tel:6087354800" className="underline">(608) 735-4800</a> or{' '}
            <a href="mailto:sales@bapihvac.com" className="underline">sales@bapihvac.com</a>
          </p>
        </div>
        
        {error.digest && (
          <p 
            className="text-xs mt-6"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
