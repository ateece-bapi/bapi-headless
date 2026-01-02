'use client';

import { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { SearchDropdown } from './SearchDropdown';

export function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    handleQueryChange,
    handleSelect,
    handleViewAll,
    clear,
  } = useSearch();

  // CMD+K / CTRL+K to focus search
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    onTrigger: () => {
      inputRef.current?.focus();
      setIsOpen(true);
    },
  });

  // ESC to clear and close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        clear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [clear]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (query.length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder="Search products..."
          className="w-full pl-10 pr-20 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={clear}
              className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
          
          {!query && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">
              <Command className="w-3 h-3" />
              K
            </kbd>
          )}
        </div>
      </div>

      <SearchDropdown
        results={results}
        isLoading={isLoading}
        isOpen={isOpen}
        query={query}
        onSelect={handleSelect}
        onViewAll={handleViewAll}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
