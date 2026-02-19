import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegionCode, Region, LanguageCode } from '@/types/region';
import { REGIONS } from '@/types/region';

interface RegionStore {
  regionCode: RegionCode;
  region: Region;
  languageCode: LanguageCode;
  setRegion: (code: RegionCode) => void;
  setLanguage: (code: LanguageCode) => void;
  getRegion: () => Region;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      regionCode: 'us',
      region: REGIONS.us,
      languageCode: 'en',

      setRegion: (code: RegionCode) => {
        const region = REGIONS[code];
        set({ regionCode: code, region });

        // Auto-switch language for region if user hasn't set a preference
        // MENA -> Arabic, others stay on current language
        if (code === 'mena' && get().languageCode === 'en') {
          set({ languageCode: 'ar' });
        }
      },

      setLanguage: (code: LanguageCode) => {
        set({ languageCode: code });
      },

      getRegion: () => get().region,
    }),
    {
      name: 'bapi-region-storage',
      version: 1,
      // Migration: Handle deprecated 'asia' region from previous version
      migrate: (persistedState: unknown) => {
        const state = persistedState as
          | Partial<{
              regionCode: string; // Use string to allow deprecated 'asia'
              region: Region;
              languageCode: LanguageCode;
            }>
          | undefined;

        // If user has deprecated 'asia' region, migrate to 'sg' (Singapore hub)
        if (state?.regionCode === 'asia') {
          return {
            ...state,
            regionCode: 'sg' as RegionCode,
            region: REGIONS.sg,
            languageCode: state.languageCode ?? 'en',
          };
        }

        // If there is no persisted state, fall back to defaults
        if (!state) {
          return {
            regionCode: 'us',
            region: REGIONS.us,
            languageCode: 'en',
          };
        }

        // Return a normalized, well-typed state when no migration is needed
        const normalizedRegionCode = (state.regionCode as RegionCode) ?? 'us';

        return {
          regionCode: normalizedRegionCode,
          region: state.region ?? REGIONS[normalizedRegionCode],
          languageCode: state.languageCode ?? 'en',
        };
      },
    }
  )
);

// Convenience hooks
export const useRegion = () => useRegionStore((state) => state.region);
export const useRegionCode = () => useRegionStore((state) => state.regionCode);
export const useLanguageCode = () => useRegionStore((state) => state.languageCode);
export const useSetRegion = () => useRegionStore((state) => state.setRegion);
export const useSetLanguage = () => useRegionStore((state) => state.setLanguage);
