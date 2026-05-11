'use client';

import { Link } from '@/lib/navigation';
import React from 'react';
import { ChevronRightIcon } from '@/lib/icons';

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  /**
   * Optional Schema.org structured data
   * If provided, will be injected into the page for SEO
   */
  schema?: {
    '@context': string;
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item?: string;
    }>;
  };
  /**
   * Visual variant - 'default' for white background, 'gradient' for blue gradient hero
   */
  variant?: 'default' | 'gradient';
}

/**
 * Breadcrumb Navigation Component
 *
 * Displays hierarchical navigation trail with Schema.org structured data support
 * WCAG 2.1 AA compliant with aria-label and aria-current attributes
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/en' },
 *     { label: 'Products', href: '/en/products' },
 *     { label: 'Sensors' },
 *   ]}
 *   schema={breadcrumbsToSchemaOrg(items, siteUrl)}
 *   variant="gradient"
 * />
 * ```
 */
export default function Breadcrumbs({ items, schema, variant = 'default' }: BreadcrumbsProps) {
  const isGradient = variant === 'gradient';

  return (
    <>
      {/* Schema.org Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {/* Visual Breadcrumb Navigation */}
      <nav className="text-sm" aria-label="Breadcrumb navigation">
        <ol
          className={`flex flex-wrap items-center gap-2 ${
            isGradient ? 'text-primary-100' : 'text-neutral-700'
          }`}
        >
          {items.map((item, idx) => (
            <li key={`${idx}-${item.label}`} className="flex items-center">
              {item.href && idx !== items.length - 1 ? (
                <Link
                  href={item.href}
                  className={
                    isGradient
                      ? 'transition-colors hover:text-white focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700'
                      : 'underline-offset-2 transition-colors hover:text-primary-600 focus:text-primary-700 focus:underline focus:outline-none'
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isGradient ? 'font-medium text-white' : 'font-medium text-neutral-900'}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              {idx < items.length - 1 && (
                <ChevronRightIcon
                  className={`mx-1 h-4 w-4 ${isGradient ? 'text-primary-300' : 'text-neutral-300'}`}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
