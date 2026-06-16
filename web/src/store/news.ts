import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NewsFilters {
  category: string | null;
  searchQuery: string;
  tags: string[];
  startDate: string | null;
  endDate: string | null;
}

interface NewsStore {
  // Filters
  filters: NewsFilters;
  setCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTags: (tags: string[]) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  clearFilters: () => void;

  // Pagination
  cursor: string | null;
  hasMore: boolean;
  setCursor: (cursor: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  resetPagination: () => void;
}

const defaultFilters: NewsFilters = {
  category: null,
  searchQuery: '',
  tags: [],
  startDate: null,
  endDate: null,
};

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      // Filters
      filters: defaultFilters,
      setCategory: (category) =>
        set((state) => ({
          filters: { ...state.filters, category },
        })),
      setSearchQuery: (searchQuery) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery },
        })),
      setTags: (tags) =>
        set((state) => ({
          filters: { ...state.filters, tags },
        })),
      setDateRange: (startDate, endDate) =>
        set((state) => ({
          filters: { ...state.filters, startDate, endDate },
        })),
      clearFilters: () => set({ filters: defaultFilters }),

      // Pagination
      cursor: null,
      hasMore: true,
      setCursor: (cursor) => set({ cursor }),
      setHasMore: (hasMore) => set({ hasMore }),
      resetPagination: () => set({ cursor: null, hasMore: true }),
    }),
    {
      name: 'news-storage',
      partialize: (state) => ({
        filters: state.filters, // Only persist filters, not pagination
      }),
    }
  )
);
