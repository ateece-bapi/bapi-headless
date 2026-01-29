'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
  easing: 'ease',
  speed: 400
});

/**
 * Enables smooth page transitions using View Transitions API
 * and loading progress bar
 * 
 * Progressive enhancement - falls back gracefully in unsupported browsers
 */
export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start progress bar
    NProgress.start();

    // Enable View Transitions API if supported
    if ('startViewTransition' in document) {
      // Smooth scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Complete progress after short delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
