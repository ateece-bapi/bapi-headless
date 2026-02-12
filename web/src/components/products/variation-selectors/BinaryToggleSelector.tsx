'use client';

import { isPositiveOption } from '@/lib/attributeDetection';

interface BinaryToggleSelectorProps {
  label: string;
  options: [string, string]; // Exactly 2 options
  value: string;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
}

/**
 * Binary Toggle Selector
 * Enterprise-grade toggle switch for yes/no, on/off choices
 * Optimized for B2B with clear active states
 */
export default function BinaryToggleSelector({
  label,
  options,
  value,
  onChange,
  className = '',
  description,
}: BinaryToggleSelectorProps) {
  // Determine which option is "positive" (yes, included, display, etc.)
  const positiveOption = options.find((opt) => isPositiveOption(opt)) || options[0];
  const negativeOption = options.find((opt) => opt !== positiveOption) || options[1];

  const isPositiveSelected = value === positiveOption;

  return (
    <div className={className}>
      <div className="mb-3">
        <label className="block text-sm font-semibold uppercase tracking-wide text-neutral-700">
          {label}
        </label>
        {description && <p className="mt-1 text-xs text-neutral-600">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle buttons */}
        <div className="inline-flex rounded-lg border-2 border-neutral-300 bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => onChange(negativeOption)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
              !isPositiveSelected
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            } `}
            aria-pressed={!isPositiveSelected}
          >
            {negativeOption}
          </button>

          <button
            type="button"
            onClick={() => onChange(positiveOption)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
              isPositiveSelected
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            } `}
            aria-pressed={isPositiveSelected}
          >
            {positiveOption}
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full transition-colors ${isPositiveSelected ? 'bg-green-500' : 'bg-neutral-400'} `}
          />
          <span className="text-xs font-medium text-neutral-600">{value || 'Not selected'}</span>
        </div>
      </div>
    </div>
  );
}
