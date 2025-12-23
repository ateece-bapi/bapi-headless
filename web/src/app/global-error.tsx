'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div 
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: '#fafafa' }}
        >
          <div className="max-w-md text-center">
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: '#e6f2f9' }}
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                style={{ color: '#106196' }}
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
              style={{ color: '#282829' }}
            >
              Critical Error
            </h2>
            
            <p 
              className="text-base mb-6"
              style={{ color: '#5e5f60' }}
            >
              A critical error occurred in the application. Please refresh the page or contact support if the issue persists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={reset}
                className="px-6 py-3 rounded-lg font-semibold"
                style={{ 
                  background: '#1479bc',
                  color: 'white'
                }}
              >
                Try again
              </button>
              
              <a 
                href="/"
                className="px-6 py-3 rounded-lg font-semibold border"
                style={{ 
                  borderColor: '#d4d5d6',
                  color: '#5e5f60'
                }}
              >
                Go to homepage
              </a>
            </div>
            
            {error.digest && (
              <p 
                className="text-xs mt-6"
                style={{ color: '#b5b6b8' }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
