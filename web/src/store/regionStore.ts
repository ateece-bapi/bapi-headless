import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegionCode, Region } from '@/types/region';
import { REGIONS } from '@/types/region';

interface RegionStore {
  regionCode: RegionCode;
  region: Region;
  setRegion: (code: RegionCode) => void;
  getRegion: () => Region;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      regionCode: 'us',
      region: REGIONS.us,
      
      setRegion: (code: RegionCode) => {
        const region = REGIONS[code];
        set({ regionCode: code, region });
      },
      
      getRegion: () => get().region,
    }),
    {
      name: 'bapi-region-storage',
    }
  )
);

// Convenience hooks
export const useRegion = () => useRegionStore((state) => state.region);
export const useRegionCode = () => useRegionStore((state) => state.regionCode);
export const useSetRegion = () => useRegionStore((state) => state.setRegion);
