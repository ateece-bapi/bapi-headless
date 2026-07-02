'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

/**
 * Detects when a previously authenticated user's session has expired
 * and shows a warning toast prompting them to sign in again.
 *
 * Uses localStorage to track prior auth state. Renders nothing.
 */
export function SessionExpiryToast() {
  const { isLoaded, isSignedIn } = useAuth();
  const { showToast } = useToast();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (!isLoaded || hasHandled.current) return;
    hasHandled.current = true;

    const wasAuthenticated = localStorage.getItem('bapi_was_authenticated') === 'true';

    if (isSignedIn) {
      localStorage.setItem('bapi_was_authenticated', 'true');
    } else if (wasAuthenticated) {
      // Session expired — user was previously signed in but is no longer
      localStorage.removeItem('bapi_was_authenticated');
      showToast(
        'warning',
        'Session Expired',
        'Your session has expired. Please sign in again to continue.',
        8000,
        { label: 'Sign In', onClick: () => { window.location.href = '/sign-in'; } }
      );
    }
  }, [isLoaded, isSignedIn, showToast]);

  return null;
}
