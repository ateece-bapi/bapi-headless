import Link from 'next/link';
import React from 'react';
import { ChevronRight } from 'lucide-react';

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
 * />
 * ```
 */
export default function Breadcrumbs({ items, schema }: BreadcrumbsProps) {
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
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-neutral-500">
          {items.map((item, idx) => (
            <li key={`${idx}-${item.label}`} className="flex items-center">
              {item.href && idx !== items.length - 1 ? (
                <Link
                  href={item.href}
                  className="underline-offset-2 transition-colors hover:text-primary-600 focus:text-primary-700 focus:underline focus:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-neutral-900" aria-current="page">
                  {item.label}
                </span>
              )}
              {idx < items.length - 1 && (
                <ChevronRight
                  className="mx-1 h-4 w-4 text-neutral-300"
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

