'use client';

import { useState, useEffect } from 'react';
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

/**
 * Simple, reliable authentication hook
 * 
 * Checks authentication status once on mount.
 * No automatic retries, no intervals, no complexity.
 * 
 * If the user's session expires, they'll be prompted to sign in again
 * when they try to access a protected resource (handled by middleware).
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

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setState({
            user: data.user,
            isLoaded: true,
            isSignedIn: true,
          });
        } else {
          setState({
            user: null,
            isLoaded: true,
            isSignedIn: false,
          });
        }
      } catch (error) {
        logger.error('Auth check failed', { error });
        if (mounted) {
          setState({
            user: null,
            isLoaded: true,
            isSignedIn: false,
          });
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

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
