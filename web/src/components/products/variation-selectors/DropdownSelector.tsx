'use client';

import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from '@/lib/icons';

interface DropdownSelectorProps {
  label: string;
  attributeSlug: string; // Stable identifier for DOM ids
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
}

/**
 * Dropdown Selector
 * Professional dropdown for complex selections (5+ options)
 * Optimized for long technical specifications
 */
export default function DropdownSelector({
  label,
  attributeSlug,
  options,
  value,
  onChange,
  className = '',
  description,
}: DropdownSelectorProps) {
  const t = useTranslations('productPage.variationSelectors');
  
  return (
    <div className={`${className}`}>
      <label
        htmlFor={`dropdown-${attributeSlug}`}
        className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-900"
      >
        {label}
      </label>
      {description && <p className="mb-2 text-xs text-neutral-700">{description}</p>}

      <div className="relative">
        <select
          id={`dropdown-${attributeSlug}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-lg border-2 bg-white px-4 py-3.5 pr-12 text-base transition-all ${
            value
              ? 'border-primary-600 font-semibold text-neutral-900 shadow-sm'
              : 'border-neutral-300 text-neutral-700'
          } cursor-pointer hover:border-primary-400 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/20`}
        >
          <option value="">{t('chooseOption')}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Custom chevron icon */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronDownIcon
            className={`h-5 w-5 transition-colors ${value ? 'text-primary-600' : 'text-neutral-400'}`}
          />
        </div>
      </div>
    </div>
  );
}
