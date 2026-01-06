'use client';

import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton as ClerkSignInButton } from '@clerk/nextjs';

const SignInButton: React.FC = () => (
  <>
    <SignedOut>
      <ClerkSignInButton mode="modal">
        <button
          className="group relative flex items-center gap-2 px-3 lg:px-6 py-2 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 active:scale-[0.98]"
          aria-label="Sign in to your account"
        >
          {/* User icon */}
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
          <span className="hidden lg:inline">User Sign In</span>
        </button>
      </ClerkSignInButton>
    </SignedOut>
    <SignedIn>
      <div className="relative group">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all duration-200",
              userButtonPopoverCard: "shadow-lg",
              userButtonPopoverActionButton: "hover:bg-primary-50",
              userButtonPopoverActionButtonText: "text-neutral-700 hover:text-primary-600",
              userButtonPopoverActionButton__manageAccount: {
                display: "none"
              }
            }
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Account Dashboard"
              labelIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              href="/account"
            />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </SignedIn>
  </>
);

export default SignInButton;