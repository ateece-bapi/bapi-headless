'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string | null;
  shortDescription: string | null;
  image: {
    sourceUrl: string;
    altText: string | null;
  } | null;
  productCategories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
}

interface UseSearchOptions {
  debounceMs?: number;
  minChars?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, minChars = 2 } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minChars) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();
      
      if (data.products?.nodes) {
        setResults(data.products.nodes);
      } else {
        setResults([]);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [minChars]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length >= minChars) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceMs);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, minChars, debounceMs, performSearch]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length >= minChars) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [minChars]);

  const handleSelect = useCallback((slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
  }, [router]);

  const handleViewAll = useCallback(() => {
    if (query.length >= minChars) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, minChars, router]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    handleQueryChange,
    handleSelect,
    handleViewAll,
    clear,
  };
}
