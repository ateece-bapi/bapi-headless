'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, signOut } from '@/hooks/useAuth';

const SignInButton: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useAuth();

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="w-9 h-9 rounded-full bg-neutral-200 animate-pulse" />
    );
  }

  // Show sign-in button if not authenticated
  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="group relative flex items-center gap-2 px-3 lg:px-6 py-2 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 active:scale-[0.98]"
        aria-label="Sign in to your account"
      >
        <svg
          className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="hidden lg:inline">Sign In</span>
      </Link>
    );
  }

  // Show user menu if authenticated
  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-200 hover:border-primary-300 transition-all duration-200"
        aria-label="User menu"
        onClick={() => {
          const menu = document.getElementById('user-menu');
          if (menu) menu.classList.toggle('hidden');
        }}
      >
        <div className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden lg:inline text-sm font-medium text-gray-700">
          {user?.displayName || 'Account'}
        </span>
      </button>
      
      <div
        id="user-menu"
        className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
      >
        <Link
          href="/account"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
        >
          Account Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SignInButton;
