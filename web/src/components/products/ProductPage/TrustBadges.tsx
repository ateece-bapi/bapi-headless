'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PackageIcon, RotateCcwIcon, ClockIcon, CheckCircleIcon, VerifiedIcon, ShieldIcon } from '@/lib/icons';

interface TrustBadgesProps {
  className?: string;
}

/**
 * Trust and credibility badges for product pages
 *
 * Displays key trust signals to improve conversion:
 * - Made in USA
 * - 5-Year Warranty
 * - 30-Day Returns
 * - Expert Support
 * - 100% Testing
 * - CE/RoHS Certified
 */
export default function TrustBadges({ className = '' }: TrustBadgesProps) {
  const t = useTranslations('productPage.trustBadges');
  
  const badges = [
    {
      icon: PackageIcon,
      label: t('madeInUSA'),
      description: t('madeInUSADesc'),
      color: 'text-primary-600',
    },
    {
      icon: ClockIcon,
      label: t('warranty'),
      description: t('warrantyDesc'),
      color: 'text-green-600',
    },
    {
      icon: RotateCcwIcon,
      label: t('returns'),
      description: t('returnsDesc'),
      color: 'text-green-600',
    },
    {
      icon: CheckCircleIcon,
      label: t('support'),
      description: t('supportDesc'),
      color: 'text-primary-600',
    },
    {
      icon: VerifiedIcon,
      label: t('testing'),
      description: t('testingDesc'),
      color: 'text-primary-600',
    },
    {
      icon: ShieldIcon,
      label: t('certified'),
      description: t('certifiedDesc'),
      color: 'text-green-600',
    },
  ];

  return (
    <div className={`rounded-xl border border-neutral-200 bg-neutral-50 p-6 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        {t('heading')}
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex flex-col items-center text-center">
              <div className={`mb-2 ${badge.color}`}>
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div className="text-sm font-semibold text-neutral-900">{badge.label}</div>
              <div className="text-xs text-neutral-700">{badge.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
