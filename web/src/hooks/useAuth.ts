'use client';

import { useState, useEffect, useCallback } from 'react';
import logger from '@/lib/logger';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

// Token refresh interval - 5 minutes before expiry (assuming 7-day tokens)
const REFRESH_INTERVAL = 1000 * 60 * 60 * 24 * 6.95; // 6.95 days
// Check auth more frequently to catch expired tokens
const CHECK_INTERVAL = 1000 * 60 * 5; // 5 minutes

/**
 * Custom authentication hook with silent token refresh
 * 
 * Fetches current user from WordPress JWT token stored in httpOnly cookie.
 * Automatically refreshes tokens before expiry for seamless user experience.
 * 
 * @example
 * ```tsx
 * const { user, isLoaded, isSignedIn } = useAuth();
 * 
 * if (!isLoaded) return <div>Loading...</div>;
 * if (!isSignedIn) return <div>Please sign in</div>;
 * return <div>Hello, {user.displayName}!</div>;
 * ```
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoaded: false,
    isSignedIn: false,
  });

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (!response.ok) {
        logger.warn('Token refresh failed, user needs to re-authenticate');
        setState({
          user: null,
          isLoaded: true,
          isSignedIn: false,
        });
        return false;
      }

      logger.debug('Token refreshed successfully');
      return true;
    } catch (error) {
      logger.error('Token refresh error', { error });
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoaded: true,
          isSignedIn: true,
        });
        return true;
      } else {
        // Try refreshing token if auth check fails
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Re-check auth after refresh
          const retryResponse = await fetch('/api/auth/me');
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setState({
              user: data.user,
              isLoaded: true,
              isSignedIn: true,
            });
            return true;
          }
        }
        
        setState({
          user: null,
          isLoaded: true,
          isSignedIn: false,
        });
        return false;
      }
    } catch (error) {
      logger.error('Auth check error', { error });
      setState({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      return false;
    }
  }, [refreshToken]);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Set up periodic token refresh
    const refreshIntervalId = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    // Set up periodic auth check to catch expired tokens
    const checkIntervalId = setInterval(() => {
      checkAuth();
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(refreshIntervalId);
      clearInterval(checkIntervalId);
    };
  }, [checkAuth, refreshToken]);

  return state;
}

/**
 * Sign in with username and password
 */
export async function signIn(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Reload page to update auth state
      window.location.reload();
      return { success: true };
    }

    return { 
      success: false, 
      error: data.message || 'Invalid credentials' 
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Network error' 
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}
