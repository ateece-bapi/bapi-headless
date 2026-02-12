'use client';

import React from 'react';
import { Shield, Package, RotateCcw, Clock, CheckCircle } from 'lucide-react';

interface TrustBadgesProps {
  className?: string;
}

/**
 * Trust and credibility badges for product pages
 *
 * Displays key trust signals to improve conversion:
 * - Made in USA
 * - Certifications (UL Listed)
 * - Return policy
 * - Warranty information
 * - Fast shipping
 */
export default function TrustBadges({ className = '' }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      label: 'UL Listed',
      description: 'Certified Safe',
      color: 'text-primary-600',
    },
    {
      icon: Package,
      label: 'Made in USA',
      description: 'Quality Built',
      color: 'text-primary-600',
    },
    {
      icon: Clock,
      label: '5-Year Warranty',
      description: 'Full Coverage',
      color: 'text-green-600',
    },
    {
      icon: RotateCcw,
      label: '30-Day Returns',
      description: 'Hassle Free',
      color: 'text-green-600',
    },
    {
      icon: CheckCircle,
      label: 'Expert Support',
      description: 'Technical Help',
      color: 'text-primary-600',
    },
  ];

  return (
    <div className={`rounded-xl border border-neutral-200 bg-neutral-50 p-6 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        Why Buy From BAPI
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex flex-col items-center text-center">
              <div className={`mb-2 ${badge.color}`}>
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div className="text-sm font-semibold text-neutral-900">{badge.label}</div>
              <div className="text-xs text-neutral-600">{badge.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
