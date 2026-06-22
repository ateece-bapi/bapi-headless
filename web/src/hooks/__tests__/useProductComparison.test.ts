/**
 * useProductComparison hook tests
 *
 * Pure localStorage hook – no fetch calls.
 *
 * Covers:
 * - Initializes empty when localStorage is empty
 * - Loads existing items from localStorage on mount
 * - addToComparison: adds product, no-op if already present, no-op at max
 * - removeFromComparison: removes by id
 * - clearComparison: resets to []
 * - isInComparison: returns true/false
 * - canAddMore: true when < 3, false at max
 * - count: correct length
 * - Syncs to localStorage on change
 * - Handles corrupt localStorage gracefully
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductComparison } from '../useProductComparison';

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

const STORAGE_KEY = 'bapi-product-comparison';

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

describe('useProductComparison – initialization', () => {
  it('starts empty when localStorage has no data', () => {
    const { result } = renderHook(() => useProductComparison());
    expect(result.current.comparisonProducts).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.canAddMore).toBe(true);
  });

  it('loads existing items from localStorage on mount', () => {
    const products = [makeProduct('1'), makeProduct('2')];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    const { result } = renderHook(() => useProductComparison());
    expect(result.current.comparisonProducts).toHaveLength(2);
    expect(result.current.count).toBe(2);
  });

  it('handles corrupt localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{{');
    const { result } = renderHook(() => useProductComparison());
    // Hook should start empty without throwing
    expect(result.current.comparisonProducts).toEqual([]);
  });
});

describe('useProductComparison – addToComparison', () => {
  it('adds a product', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    expect(result.current.comparisonProducts).toHaveLength(1);
    expect(result.current.comparisonProducts[0].id).toBe('1');
  });

  it('is a no-op when product is already in list', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('1')); });
    expect(result.current.comparisonProducts).toHaveLength(1);
  });

  it('is a no-op when max of 3 is reached', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('2')); });
    act(() => { result.current.addToComparison(makeProduct('3')); });
    act(() => { result.current.addToComparison(makeProduct('4')); }); // should be ignored
    expect(result.current.comparisonProducts).toHaveLength(3);
  });

  it('does not add the 4th product even when different', () => {
    const { result } = renderHook(() => useProductComparison());
    ['1', '2', '3', '4'].forEach((id) => {
      act(() => { result.current.addToComparison(makeProduct(id)); });
    });
    const ids = result.current.comparisonProducts.map((p) => p.id);
    expect(ids).not.toContain('4');
  });
});

describe('useProductComparison – removeFromComparison', () => {
  it('removes a product by id', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('2')); });
    act(() => { result.current.removeFromComparison('1'); });
    expect(result.current.comparisonProducts).toHaveLength(1);
    expect(result.current.comparisonProducts[0].id).toBe('2');
  });

  it('is a no-op when id is not in list', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.removeFromComparison('999'); });
    expect(result.current.comparisonProducts).toHaveLength(1);
  });
});

describe('useProductComparison – clearComparison', () => {
  it('clears all products', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('2')); });
    act(() => { result.current.clearComparison(); });
    expect(result.current.comparisonProducts).toEqual([]);
  });
});

describe('useProductComparison – isInComparison', () => {
  it('returns true when product is in comparison', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    expect(result.current.isInComparison('1')).toBe(true);
  });

  it('returns false when product is not in comparison', () => {
    const { result } = renderHook(() => useProductComparison());
    expect(result.current.isInComparison('999')).toBe(false);
  });
});

describe('useProductComparison – canAddMore', () => {
  it('is true when below max', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    expect(result.current.canAddMore).toBe(true);
  });

  it('is false when at max of 3', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('2')); });
    act(() => { result.current.addToComparison(makeProduct('3')); });
    expect(result.current.canAddMore).toBe(false);
  });
});

describe('useProductComparison – localStorage persistence', () => {
  it('saves to localStorage after adding', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('1');
  });

  it('updates localStorage after removing', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.addToComparison(makeProduct('2')); });
    act(() => { result.current.removeFromComparison('1'); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('2');
  });

  it('clears localStorage after clearComparison', () => {
    const { result } = renderHook(() => useProductComparison());
    act(() => { result.current.addToComparison(makeProduct('1')); });
    act(() => { result.current.clearComparison(); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toEqual([]);
  });
});
