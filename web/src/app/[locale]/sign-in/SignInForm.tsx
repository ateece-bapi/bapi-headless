'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
import logger from '@/lib/logger';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        
        // Force full page reload to ensure cookies are sent to server
        // Client-side navigation (router.push) doesn't send httpOnly cookies
        // to Server Components, causing authentication to fail
        setTimeout(() => {
          window.location.href = redirect;
        }, 500);
      } else {
        logger.warn('Sign in failed', { username, error: data.message });
        
        // Decode HTML entities from WordPress error messages
        const errorMessage = data.message || 'Invalid username or password';
        const decodedMessage = errorMessage
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          // Strip HTML tags for clean error message
          .replace(/<[^>]*>/g, '');
        
        showToast(
          'error',
          'Sign In Failed',
          decodedMessage
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
      <div className="rounded-2xl bg-white shadow-xl border-2 border-neutral-200 p-8 lg:p-10 space-y-6">
        
        {/* Username Field */}
        <div>
          <label 
            htmlFor="username" 
            className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-2"
          >
            <User className="w-4 h-4 text-primary-500" />
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
            className="appearance-none relative block w-full px-4 py-3.5 border-2 border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base hover:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            placeholder="Enter your username or email"
            disabled={isLoading}
            aria-label="Username or email address"
          />
        </div>

        {/* Password Field with Toggle */}
        <div>
          <label 
            htmlFor="password" 
            className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-2"
          >
            <Lock className="w-4 h-4 text-primary-500" />
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3.5 pr-12 border-2 border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base hover:border-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
              disabled={isLoading}
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 border-neutral-300 rounded cursor-pointer transition-all"
              disabled={isLoading}
            />
            <label 
              htmlFor="remember-me" 
              className="ml-2 block text-sm text-neutral-700 cursor-pointer select-none hover:text-neutral-900 transition-colors"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="/contact"
              className="font-semibold text-primary-500 hover:text-primary-600 transition-colors focus:outline-none focus:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center items-center gap-2 py-4 px-6 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-primary-500 disabled:hover:to-primary-700 disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
          <Lock className="w-4 h-4 text-primary-500" />
          <span className="font-medium">Secure encrypted connection</span>
        </div>
        
        {/* Help Text */}
        <p className="text-sm text-neutral-500">
          Need help?{' '}
          <a 
            href="/contact" 
            className="text-primary-500 hover:text-primary-600 font-semibold transition-colors focus:outline-none focus:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </form>
  );
}
