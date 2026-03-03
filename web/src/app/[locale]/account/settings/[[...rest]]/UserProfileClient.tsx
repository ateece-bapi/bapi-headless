'use client';

import { useState, useEffect } from 'react';
import { TwoFactorSettings } from '@/components/auth/TwoFactorSettings';
import { useToast } from '@/components/ui/Toast';

/**
 * User profile settings component
 * Includes Two-Factor Authentication settings
 */
export default function UserProfileClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);
  const { showToast } = useToast();

  // Fetch user's 2FA status on mount
  useEffect(() => {
    async function fetchTwoFactorStatus() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error(`Failed to fetch 2FA status: ${response.status}`);
        }
        const data = await response.json();
        setTwoFactorEnabled(data.user?.twoFactorEnabled || false);
        setHasError(false);
      } catch (error) {
        console.error('Failed to fetch 2FA status:', error);
        setHasError(true);
        showToast('error', 'Error', 'Failed to load security settings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTwoFactorStatus();
  }, [showToast]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  if (hasError || twoFactorEnabled === null) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-900">Unable to Load Security Settings</h3>
          <p className="mt-2 text-sm text-red-700">
            We couldn't retrieve your two-factor authentication status. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <TwoFactorSettings 
        isEnabled={twoFactorEnabled}
        onStatusChange={setTwoFactorEnabled}
      />
    </div>
  );
}
