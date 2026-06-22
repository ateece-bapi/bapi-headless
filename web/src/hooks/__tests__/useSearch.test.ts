/**
 * useSearch hook tests
 *
 * Uses vi.spyOn(global, 'fetch') (relative URL fix) + vi.useFakeTimers() for debounce.
 * Mocks @/lib/navigation to capture router.push calls.
 *
 * Covers:
 * - Initial state
 * - Queries below minChars → no fetch, results cleared
 * - Debounce: fetch fires after delay, not before
 * - Successful search → results populated
 * - API error → results cleared
 * - Network error → results cleared
 * - AbortController: rapid typing aborts in-flight request
 * - Unmount: aborts any pending in-flight request
 * - handleSelect → navigates to /product/{slug}, clears state
 * - handleViewAll → navigates to /search?q=..., clears state
 * - clear() → resets all state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../useSearch';

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

const mockPush = vi.fn();
vi.mock('@/lib/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSearchResponse(products: object[]) {
  return new Response(
    JSON.stringify({ products: { nodes: products } }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

const MOCK_PRODUCTS = [
  { id: '1', databaseId: 1, name: 'Sensor A', slug: 'sensor-a', price: '$10.00' },
  { id: '2', databaseId: 2, name: 'Sensor B', slug: 'sensor-b', price: '$20.00' },
];

// ─── Setup ───────────────────────────────────────────────────────────────────

let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, 'fetch'>>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  fetchSpy = vi.spyOn(global, 'fetch');
});

afterEach(() => {
  vi.clearAllTimers();
  fetchSpy.mockRestore();
  vi.useRealTimers();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useSearch – initial state', () => {
  it('starts with empty query, no results, not loading, not open', () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useSearch – minChars guard', () => {
  it('does not fetch when query is below minChars', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 300, minChars: 2 }));

    act(() => { result.current.handleQueryChange('a'); });
    await act(() => vi.advanceTimersByTimeAsync(500));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('clears results and closes dropdown when query drops below minChars', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    // First get results
    act(() => { result.current.handleQueryChange('ab'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    // Then clear
    act(() => { result.current.handleQueryChange('a'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(result.current.results).toEqual([]);
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useSearch – debounce', () => {
  it('does not fetch before debounce delay', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 300 }));

    act(() => { result.current.handleQueryChange('sensor'); });

    // Before debounce fires
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('fetches after debounce delay', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 300 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(400));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.current.results).toEqual(MOCK_PRODUCTS);
    expect(result.current.isLoading).toBe(false);
  });

  it('resets debounce on rapid typing (only fires once)', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 300 }));

    act(() => { result.current.handleQueryChange('se'); });
    await act(() => vi.advanceTimersByTimeAsync(100));
    act(() => { result.current.handleQueryChange('sen'); });
    await act(() => vi.advanceTimersByTimeAsync(100));
    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(400));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe('useSearch – fetch results', () => {
  it('populates results and sets isLoading false on success', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(result.current.results).toEqual(MOCK_PRODUCTS);
    expect(result.current.isLoading).toBe(false);
  });

  it('sends query in POST body', async () => {
    let capturedBody: unknown;
    fetchSpy.mockImplementation((_url, init) => {
      capturedBody = JSON.parse(init?.body as string);
      return Promise.resolve(makeSearchResponse([]));
    });
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(capturedBody).toEqual({ query: 'sensor' });
  });

  it('clears results on API error response', async () => {
    fetchSpy.mockResolvedValue(new Response(null, { status: 500 }));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('clears results on network error', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles empty products.nodes gracefully', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse([]));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('zzz'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    expect(result.current.results).toEqual([]);
  });
});

describe('useSearch – handleSelect', () => {
  it('navigates to /product/{slug}', async () => {
    const { result } = renderHook(() => useSearch());
    act(() => { result.current.handleSelect('sensor-a'); });
    expect(mockPush).toHaveBeenCalledWith('/product/sensor-a');
  });

  it('closes dropdown and clears query on select', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));
    act(() => { result.current.handleSelect('sensor-a'); });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe('');
  });
});

describe('useSearch – handleViewAll', () => {
  it('navigates to /search?q= with encoded query', async () => {
    const { result } = renderHook(() => useSearch({ minChars: 2 }));

    act(() => { result.current.handleQueryChange('sensor x'); });
    act(() => { result.current.handleViewAll(); });

    expect(mockPush).toHaveBeenCalledWith('/search?q=sensor%20x');
  });

  it('does not navigate when query is below minChars', () => {
    const { result } = renderHook(() => useSearch({ minChars: 2 }));

    act(() => { result.current.handleQueryChange('s'); });
    act(() => { result.current.handleViewAll(); });

    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe('useSearch – clear', () => {
  it('resets query, results, isOpen, and isLoading', async () => {
    fetchSpy.mockResolvedValue(makeSearchResponse(MOCK_PRODUCTS));
    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(200));

    act(() => { result.current.clear(); });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useSearch – AbortController', () => {
  it('aborts in-flight request when a new search fires', async () => {
    let firstSignal!: AbortSignal;
    fetchSpy.mockImplementation((_url, init) => {
      if (!firstSignal) {
        firstSignal = (init as RequestInit).signal as AbortSignal;
        // Keep first request hanging so it stays in-flight
        return new Promise<Response>(() => {});
      }
      return Promise.resolve(makeSearchResponse(MOCK_PRODUCTS));
    });

    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    // First search fires
    act(() => { result.current.handleQueryChange('se'); });
    await act(() => vi.advanceTimersByTimeAsync(150));
    expect(firstSignal.aborted).toBe(false);

    // Second search fires → first should be aborted
    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(150));
    expect(firstSignal.aborted).toBe(true);
  });
});

describe('useSearch – unmount cleanup', () => {
  it('aborts pending in-flight request on unmount', async () => {
    let capturedSignal!: AbortSignal;
    fetchSpy.mockImplementation((_url, init) => {
      capturedSignal = (init as RequestInit).signal as AbortSignal;
      return new Promise<Response>(() => {}); // never resolves
    });

    const { result, unmount } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => { result.current.handleQueryChange('sensor'); });
    await act(() => vi.advanceTimersByTimeAsync(150));
    expect(capturedSignal.aborted).toBe(false);

    unmount();
    expect(capturedSignal.aborted).toBe(true);
  });
});
