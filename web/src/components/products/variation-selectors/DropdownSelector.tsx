'use client';

import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from '@/lib/icons';
import { getShortLabel } from '@/lib/attributeDetection';

interface DropdownSelectorProps {
  label: string;
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
        htmlFor={`dropdown-${label}`}
        className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-900"
      >
        {label}
      </label>
      {description && <p className="mb-2 text-xs text-neutral-700">{description}</p>}

      <div className="relative">
        <select
          id={`dropdown-${label}`}
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

      {/* Show shortened label for long selections */}
      {value && value.length > 50 && (
        <div className="mt-2 rounded border border-neutral-200 bg-neutral-50 p-2">
          <span className="text-xs font-semibold text-neutral-700">Selected:</span>
          <p className="mt-1 text-sm text-neutral-900">{getShortLabel(value)}</p>
          <p className="mt-1 text-xs text-neutral-700">{value}</p>
        </div>
      )}
    </div>
  );
}
