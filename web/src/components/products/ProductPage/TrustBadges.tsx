'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PackageIcon, RotateCcwIcon, ClockIcon, CheckCircleIcon, VerifiedIcon, ShieldIcon } from '@/lib/icons';
import type { WarrantyType } from '@/lib/utils/getProductWarranty';

interface TrustBadgesProps {
  className?: string;
  /** Per-product warranty override; defaults to the sitewide 5-year warranty. */
  warrantyType?: WarrantyType;
  /** Hides the CE/RoHS badge for products that aren't actually CE/RoHS certified. */
  hideComplianceBadge?: boolean;
}

/**
 * Trust and credibility badges for product pages
 *
 * Displays key trust signals to improve conversion:
 * - Made in USA
 * - Warranty (5-year by default, overridable to Lifetime or 2-year per product)
 * - 30-Day Returns
 * - Expert Support
 * - 100% Testing
 * - CE/RoHS Certified (hidden for non-certified products)
 */
export default function TrustBadges({
  className = '',
  warrantyType = 'standard',
  hideComplianceBadge = false,
}: TrustBadgesProps) {
  const t = useTranslations('productPage.trustBadges');

  const warrantyLabel =
    warrantyType === 'lifetime'
      ? t('warrantyLifetime')
      : warrantyType === 'two-year'
        ? t('warrantyTwoYear')
        : t('warranty');

  const badges = [
    {
      icon: PackageIcon,
      label: t('madeInUSA'),
      description: t('madeInUSADesc'),
      color: 'text-primary-600',
    },
    {
      icon: ClockIcon,
      label: warrantyLabel,
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
    ...(hideComplianceBadge
      ? []
      : [
          {
            icon: ShieldIcon,
            label: t('certified'),
            description: t('certifiedDesc'),
            color: 'text-green-600',
          },
        ]),
  ];

  return (
    <div className={`rounded-xl border border-neutral-200 bg-neutral-50 p-6 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        {t('heading')}
      </h3>
      <div
        className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${hideComplianceBadge ? 'lg:grid-cols-5' : 'lg:grid-cols-6'}`}
      >

        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex flex-col items-center text-center">
              <div className={`mb-2 ${badge.color}`}>
                <Icon className="h-8 w-8" />
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
