'use client';

import { useState, useEffect } from 'react';

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
 * Custom authentication hook - replaces Clerk's useUser()
 * 
 * Fetches current user from WordPress JWT token stored in httpOnly cookie.
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
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        
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
        setState({
          user: null,
          isLoaded: true,
          isSignedIn: false,
        });
      }
    }

    checkAuth();
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
