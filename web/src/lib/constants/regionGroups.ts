/**
 * Regional grouping configuration for organized display
 * Groups regions by geographic/economic areas for better UX
 */

import type { RegionCode } from '@/types/region';

export interface RegionGroup {
  id: string;
  label: string;
  regions: RegionCode[];
}

export const REGION_GROUPS: RegionGroup[] = [
  {
    id: 'americas',
    label: 'Americas',
    regions: ['us', 'ca', 'mx'],
  },
  {
    id: 'europe',
    label: 'Europe',
    regions: ['uk', 'eu'],
  },
  {
    id: 'asia-pacific',
    label: 'Asia Pacific',
    regions: ['jp', 'cn', 'sg', 'vn', 'th', 'in'],
  },
  {
    id: 'middle-east',
    label: 'Middle East',
    regions: ['mena'],
  },
];

/**
 * Get the group label for a given region code
 */
export function getRegionGroup(regionCode: RegionCode): string {
  const group = REGION_GROUPS.find((g) => g.regions.includes(regionCode));
  return group?.label || 'Other';
}
