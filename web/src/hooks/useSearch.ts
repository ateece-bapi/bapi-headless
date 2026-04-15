'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '@/lib/navigation';
import logger from '@/lib/logger';

interface SearchProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  partNumber?: string | null;
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

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minChars) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
          signal: controller.signal,
        });

        // Only update state if this request is still current
        if (controller !== abortControllerRef.current) {
          return; // Newer request has started, discard this response
        }

        if (!response.ok) {
          logger.error('Search API error', { status: response.status });
          setResults([]);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        // Double-check still current before applying results
        if (controller !== abortControllerRef.current) {
          return;
        }

        if (data.products?.nodes) {
          setResults(data.products.nodes);
        } else {
          setResults([]);
        }
        setIsLoading(false);
      } catch (error: unknown) {
        // Only update state if this request is still current
        if (controller !== abortControllerRef.current) {
          return; // Newer request has started, ignore this error
        }

        if (error instanceof Error && error.name === 'AbortError') {
          // Request was cancelled, reset loading state
          setIsLoading(false);
        } else {
          logger.error('Search error', error);
          setResults([]);
          setIsLoading(false);
        }
      }
    },
    [minChars]
  );

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

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      if (newQuery.length >= minChars) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [minChars]
  );

  const handleSelect = useCallback(
    (slug: string) => {
      // Cancel any pending search requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsOpen(false);
      setIsLoading(false); // Reset loading state on navigation
      setQuery('');
      router.push(`/product/${slug}`);
    },
    [router]
  );

  const handleViewAll = useCallback(() => {
    if (query.length >= minChars) {
      // Cancel any pending search requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsOpen(false);
      setIsLoading(false); // Reset loading state on navigation
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, minChars, router]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false); // Reset loading state when clearing
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Abort any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Clear any pending debounce timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
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
