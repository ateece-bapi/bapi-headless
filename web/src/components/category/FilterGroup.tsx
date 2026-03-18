'use client';

import { useState, ReactNode } from 'react';
import { ChevronDownIcon } from '@/lib/icons';

interface FilterGroupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 pb-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-neutral-900">{title}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
}
