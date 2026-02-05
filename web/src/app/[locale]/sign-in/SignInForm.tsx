'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import logger from '@/lib/logger';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast('warning', 'Missing Fields', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Welcome Back!', 'Successfully signed in');
        
        // Redirect to intended page or account dashboard
        const redirect = searchParams.get('redirect') || '/account';
        
        // Small delay for toast to show
        setTimeout(() => {
          router.push(redirect);
          router.refresh(); // Refresh to update auth state
        }, 500);
      } else {
        logger.warn('Sign in failed', { username, error: data.message });
        showToast(
          'error',
          'Sign In Failed',
          data.message || 'Invalid username or password'
        );
      }
    } catch (error) {
      logger.error('Sign in error', { error });
      showToast(
        'error',
        'Connection Error',
        'Unable to connect to server. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-2xl bg-white shadow-xl border-2 border-neutral-200 p-8 space-y-6">
        {/* Username Field */}
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-semibold text-neutral-700 mb-2"
          >
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="appearance-none relative block w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
            placeholder="Enter your username or email"
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-semibold text-neutral-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none relative block w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded cursor-pointer"
              disabled={isLoading}
            />
            <label 
              htmlFor="remember-me" 
              className="ml-2 block text-sm text-neutral-700 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="/contact"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-500 disabled:hover:to-primary-700"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-neutral-500">
          🔒 Your connection is secure and encrypted
        </p>
      </div>
    </form>
  );
}
