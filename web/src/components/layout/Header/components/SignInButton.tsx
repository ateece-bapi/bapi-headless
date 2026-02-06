'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Simple sign-in button for header
 * No client-side auth checks - keeps header lightweight
 */
const SignInButton: React.FC = () => {
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
};

export default SignInButton;
