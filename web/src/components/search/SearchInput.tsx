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
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

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
          className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-20 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              onClick={clear}
              className="rounded p-1.5 transition-colors hover:bg-neutral-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-neutral-500" />
            </button>
          )}

          {!query && (
            <kbd className="hidden items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-500 sm:inline-flex">
              <Command className="h-3 w-3" />K
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
