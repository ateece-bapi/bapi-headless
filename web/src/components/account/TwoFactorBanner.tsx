'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface TwoFactorBannerProps {
  locale: string;
  isEnabled: boolean;
}

const STORAGE_KEY = '2fa-banner-dismissed';
const DISMISS_DURATION_DAYS = 7; // Show again after 7 days if still not enabled

/**
 * Two-Factor Authentication onboarding banner component
 * Shows a dismissible banner encouraging users to enable 2FA
 * 
 * @param {TwoFactorBannerProps} props - Component props
 * @returns {JSX.Element | null} Banner component or null if hidden
 */
export default function TwoFactorBanner({ locale, isEnabled }: TwoFactorBannerProps) {
  const t = useTranslations('account.twoFactorBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visibility after mount to avoid hydration mismatch
    // Calculate visibility inside effect to satisfy exhaustive-deps
    const shouldShow = () => {
      // Don't show if 2FA is already enabled
      if (isEnabled) return false;
      
      // Check if banner was dismissed
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        const now = new Date();
        const daysSinceDismissed = Math.floor(
          (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Show again after DISMISS_DURATION_DAYS
        if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
          return false;
        }
      }
      
      return true;
    };
    
    setIsVisible(shouldShow());
  }, [isEnabled]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-lg border border-primary-200 bg-linear-to-r from-primary-50 to-accent-50 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
          <p className="mt-1 text-sm text-gray-600">{t('description')}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/account/settings"
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t('enableButton')}
            </Link>
            <Link
              href="https://www.eff.org/deeplinks/2016/12/how-enable-two-factor-authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t('learnMoreButton')}
            </Link>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={t('dismissLabel')}
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
