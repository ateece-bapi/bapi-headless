'use client';

import { useEffect } from 'react';
import logger from '@/lib/logger';

export default function ErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('app.error_boundary', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="max-w-md text-center">
        <div 
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary-50)' }}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: 'var(--color-primary-600)' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-neutral-900)' }}
        >
          Something went wrong
        </h2>
        
        <p 
          className="text-base mb-6"
          style={{ color: 'var(--color-neutral-600)' }}
        >
          We encountered an unexpected error. Our team has been notified and is working on a fix.
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
            Try again
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
            Go to homepage
          </a>
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
