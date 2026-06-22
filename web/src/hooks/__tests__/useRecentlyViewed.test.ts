/**
 * useRecentlyViewed hook tests
 *
 * Pure localStorage hook – no fetch calls.
 *
 * Covers:
 * - Initializes empty when localStorage is empty
 * - Loads existing items from localStorage on mount
 * - addToRecentlyViewed: prepends to front, deduplicates (moves to front), enforces max 5
 * - clearRecentlyViewed: resets to []
 * - Syncs to localStorage on change
 * - Handles corrupt localStorage gracefully (clears bad data)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentlyViewed } from '../useRecentlyViewed';

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

const STORAGE_KEY = 'bapi-recently-viewed';

// Minimal Product shape required by the hook
function makeProduct(id: string, name = `Product ${id}`) {
  return {
    id,
    databaseId: Number(id),
    name,
    slug: `product-${id}`,
    __typename: 'SimpleProduct' as const,
    price: '$10.00',
    stockStatus: 'IN_STOCK' as const,
    shortDescription: null,
    description: null,
    image: null,
    galleryImages: { nodes: [] },
    variations: { nodes: [] },
  };
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('useRecentlyViewed – initialization', () => {
  it('starts empty when localStorage has no data', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recentlyViewed).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('loads existing items from localStorage on mount', () => {
    const products = [makeProduct('1'), makeProduct('2')];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recentlyViewed).toHaveLength(2);
    expect(result.current.recentlyViewed[0].id).toBe('1');
  });

  it('handles corrupt localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    const { result } = renderHook(() => useRecentlyViewed());
    // Hook should start empty without throwing
    expect(result.current.recentlyViewed).toEqual([]);
  });
});

describe('useRecentlyViewed – addToRecentlyViewed', () => {
  it('adds a product to an empty list', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    expect(result.current.recentlyViewed).toHaveLength(1);
    expect(result.current.recentlyViewed[0].id).toBe('1');
  });

  it('prepends new products to front of list', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    act(() => { result.current.addToRecentlyViewed(makeProduct('2')); });
    expect(result.current.recentlyViewed[0].id).toBe('2');
    expect(result.current.recentlyViewed[1].id).toBe('1');
  });

  it('moves existing product to front (deduplication)', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    act(() => { result.current.addToRecentlyViewed(makeProduct('2')); });
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); }); // re-add '1'
    expect(result.current.recentlyViewed).toHaveLength(2);
    expect(result.current.recentlyViewed[0].id).toBe('1'); // moved to front
    expect(result.current.recentlyViewed[1].id).toBe('2');
  });

  it('enforces max 5 items (FIFO – oldest dropped)', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    for (let i = 1; i <= 6; i++) {
      act(() => { result.current.addToRecentlyViewed(makeProduct(String(i))); });
    }
    expect(result.current.recentlyViewed).toHaveLength(5);
    expect(result.current.recentlyViewed[0].id).toBe('6'); // newest at front
    // Product '1' should be dropped
    expect(result.current.recentlyViewed.find((p) => p.id === '1')).toBeUndefined();
  });

  it('increments count correctly', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    act(() => { result.current.addToRecentlyViewed(makeProduct('2')); });
    expect(result.current.count).toBe(2);
  });
});

describe('useRecentlyViewed – clearRecentlyViewed', () => {
  it('clears all items', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    act(() => { result.current.addToRecentlyViewed(makeProduct('2')); });
    act(() => { result.current.clearRecentlyViewed(); });
    expect(result.current.recentlyViewed).toEqual([]);
    expect(result.current.count).toBe(0);
  });
});

describe('useRecentlyViewed – localStorage persistence', () => {
  it('saves to localStorage after adding a product', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('1');
  });

  it('clears localStorage after clearRecentlyViewed', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => { result.current.addToRecentlyViewed(makeProduct('1')); });
    act(() => { result.current.clearRecentlyViewed(); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toEqual([]);
  });
});
