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
    <div className={`${className}`}>
      <label 
        htmlFor={`dropdown-${label}`}
        className="block text-sm font-bold text-neutral-900 uppercase tracking-wide mb-2"
      >
        {label}
      </label>
      {description && (
        <p className="mb-2 text-xs text-neutral-600">{description}</p>
      )}
      
      <div className="relative">
        <select
          id={`dropdown-${label}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3.5 pr-12 rounded-lg border-2 transition-all appearance-none bg-white text-base
            ${value 
              ? 'border-accent-500 text-neutral-900 font-semibold shadow-sm' 
              : 'border-neutral-300 text-neutral-600'
            }
            hover:border-accent-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 focus:outline-none
            cursor-pointer
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`
            w-5 h-5 transition-colors
            ${value ? 'text-accent-600' : 'text-neutral-400'}
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
