'use client';

import { ChevronDown } from 'lucide-react';
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
  description
}: DropdownSelectorProps) {
  return (
    <div className={className}>
      <div className="mb-2">
        <label 
          htmlFor={`dropdown-${label}`}
          className="block text-sm font-semibold text-neutral-700 uppercase tracking-wide"
        >
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-neutral-600">{description}</p>
        )}
      </div>
      
      <div className="relative">
        <select
          id={`dropdown-${label}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3 pr-10 rounded-lg border-2 transition-all appearance-none bg-white
            ${value 
              ? 'border-primary-500 text-neutral-900 font-medium' 
              : 'border-neutral-300 text-neutral-600'
            }
            hover:border-primary-400
            focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
          `}
        >
          <option value="">Choose an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        
        {/* Custom chevron icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`
            w-5 h-5 transition-colors
            ${value ? 'text-primary-600' : 'text-neutral-400'}
          `} />
        </div>
      </div>
      
      {/* Show shortened label for long selections */}
      {value && value.length > 50 && (
        <div className="mt-2 p-2 bg-neutral-50 rounded border border-neutral-200">
          <span className="text-xs font-semibold text-neutral-700">Selected:</span>
          <p className="text-sm text-neutral-900 mt-1">{getShortLabel(value)}</p>
          <p className="text-xs text-neutral-600 mt-1">{value}</p>
        </div>
      )}
    </div>
  );
}
