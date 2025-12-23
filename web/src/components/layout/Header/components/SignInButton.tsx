'use client';

import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton as ClerkSignInButton } from '@clerk/nextjs';

const SignInButton: React.FC = () => (
  <>
    <SignedOut>
      <ClerkSignInButton mode="modal">
        <button
          className="px-4 lg:px-6 py-2 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:ring-offset-2 transition-all active:scale-95"
          aria-label="Sign in to your account"
        >
          User Sign In
        </button>
      </ClerkSignInButton>
    </SignedOut>
    <SignedIn>
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-9 h-9"
          }
        }}
      />
    </SignedIn>
  </>
);

export default SignInButton;