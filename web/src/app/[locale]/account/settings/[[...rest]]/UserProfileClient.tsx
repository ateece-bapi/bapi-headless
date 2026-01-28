'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamic import for Clerk UserProfile (reduces bundle size)
const UserProfile = dynamic(
  () => import('@clerk/nextjs').then(mod => ({ default: mod.UserProfile })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-3 text-neutral-600">Loading settings...</span>
      </div>
    ),
    ssr: false
  }
);

/**
 * Client component wrapper for Clerk UserProfile
 * 
 * This wrapper allows dynamic loading of UserProfile to reduce
 * initial bundle size while maintaining server-side auth in parent.
 */
export default function UserProfileClient() {
  return (
    <UserProfile
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none border-0',
          navbar: 'bg-neutral-50',
          navbarButton: 'text-neutral-700 hover:bg-white hover:text-primary-600',
          navbarButtonActive: 'bg-white text-primary-600 font-semibold',
          pageScrollBox: 'p-6 lg:p-8',
          profileSectionPrimaryButton: 'bg-primary-600 hover:bg-primary-700 text-white',
          formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
          formFieldInput: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
          identityPreviewEditButton: 'text-primary-600 hover:text-primary-700',
          badge: 'bg-primary-100 text-primary-700',
        },
      }}
    />
  );
}
