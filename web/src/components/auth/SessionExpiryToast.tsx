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

    let wasAuthenticated = false;
    try {
      wasAuthenticated = localStorage.getItem('bapi_was_authenticated') === 'true';
    } catch {
      return; // localStorage unavailable (e.g. Safari private mode)
    }

    if (isSignedIn) {
      try {
        localStorage.setItem('bapi_was_authenticated', 'true');
      } catch {
        // Ignore write failures
      }
    } else if (wasAuthenticated) {
      // Session expired — user was previously signed in but is no longer
      try {
        localStorage.removeItem('bapi_was_authenticated');
      } catch {
        // Ignore removal failures
      }
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
