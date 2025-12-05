import Link from 'next/link';
import React from 'react';

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-neutral-500">
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-center">
            {item.href && idx !== items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-primary-600 focus:text-primary-700 focus:outline-none underline-offset-2 focus:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 font-medium" aria-current="page">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span className="mx-2 text-neutral-300" aria-hidden="true">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
