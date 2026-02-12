'use client';

import { Check } from 'lucide-react';
import { getColorHex } from '@/lib/attributeDetection';

interface ColorSwatchSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Color Swatch Selector
 * Visual color picker for color attributes
 * Enterprise B2B design with accessibility
 */
export default function ColorSwatchSelector({
  label,
  options,
  value,
  onChange,
  className = '',
}: ColorSwatchSelectorProps) {
  return (
    <div className={className}>
      <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-neutral-700">
        {label}
      </label>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = value === option;
          const colorHex = getColorHex(option);
          const isLightColor = ['#FFFFFF', '#F5F5DC', '#F0F0F0'].includes(colorHex);

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`group relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-300 bg-white hover:border-primary-400 hover:bg-neutral-50'
              } `}
              aria-label={`Select ${option}`}
              aria-pressed={isSelected}
            >
              {/* Color Swatch */}
              <div className="relative">
                <div
                  className={`h-8 w-8 rounded-full border-2 transition-all ${isSelected ? 'scale-110 border-primary-600' : 'border-neutral-300 group-hover:border-neutral-400'} ${isLightColor ? 'shadow-md' : ''} `}
                  style={{ backgroundColor: colorHex }}
                  aria-hidden="true"
                />

                {/* Check mark for selected */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      className={`h-5 w-5 ${isLightColor ? 'text-primary-600' : 'text-white'}`}
                      strokeWidth={3}
                    />
                  </div>
                )}
              </div>

              {/* Color Name */}
              <span
                className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-neutral-700'}`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected indicator */}
      {value && (
        <div className="mt-2 text-xs text-neutral-600">
          Selected: <span className="font-semibold text-neutral-900">{value}</span>
        </div>
      )}
    </div>
  );
}
