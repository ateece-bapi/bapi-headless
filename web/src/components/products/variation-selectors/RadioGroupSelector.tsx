'use client';

import { Check } from 'lucide-react';

interface RadioGroupSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
}

/**
 * Radio Group Selector
 * Professional radio button group for 2-4 options
 * Optimized for B2B with clear selection states
 */
export default function RadioGroupSelector({
  label,
  options,
  value,
  onChange,
  className = '',
  description
}: RadioGroupSelectorProps) {
  return (
    <div className={className}>
      <div className="mb-3">
        <label className="block text-sm font-semibold text-neutral-700 uppercase tracking-wide">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-neutral-600">{description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value === option;
          const radioId = `radio-${label}-${option}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
          
          return (
            <label
              key={option}
              htmlFor={radioId}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-neutral-300 hover:border-primary-400 bg-white hover:bg-neutral-50'
                }
              `}
            >
              {/* Hidden native radio for accessibility */}
              <input
                id={radioId}
                type="radio"
                name={label}
                value={option}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              
              {/* Custom radio indicator */}
              <div className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all
                ${isSelected 
                  ? 'border-primary-600 bg-primary-600' 
                  : 'border-neutral-400 group-hover:border-primary-500'
                }
              `}>
                {isSelected && (
                  <div className="flex items-center justify-center w-full h-full">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              
              {/* Option text */}
              <span className={`
                text-sm font-medium flex-grow
                ${isSelected ? 'text-primary-900' : 'text-neutral-700'}
              `}>
                {option}
              </span>
              
              {/* Selected badge */}
              {isSelected && (
                <span className="px-2 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded">
                  Selected
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
