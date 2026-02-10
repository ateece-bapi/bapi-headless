/**
 * BAPI Global Locations
 * Company facilities worldwide with coordinates for map display
 */

export type FacilityType = 'headquarters' | 'distribution' | 'production' | 'production-service';
export type FacilityStatus = 'operational' | 'opening-soon';

export interface Location {
  id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude] for map libraries
  type: FacilityType;
  status?: FacilityStatus;
  description: string;
  established?: string;
}

export const BAPI_LOCATIONS: Location[] = [
  {
    id: 'headquarters-usa',
    name: 'Global Headquarters',
    city: 'Gays Mills',
    region: 'Wisconsin',
    country: 'USA',
    coordinates: [-90.8543, 43.3297],
    type: 'headquarters',
    status: 'operational',
    description: 'Corporate headquarters and primary manufacturing facility',
    established: '1993'
  },
  {
    id: 'distribution-uk',
    name: 'UK Distribution Centre',
    city: 'Aldershot',
    region: 'Hampshire',
    country: 'United Kingdom',
    coordinates: [-0.7629, 51.2485],
    type: 'distribution',
    status: 'operational',
    description: 'European distribution and logistics hub'
  },
  {
    id: 'production-poland',
    name: 'Production & Customer Service Facility',
    city: 'Nowa Wola',
    region: 'Podkarpackie',
    country: 'Poland',
    coordinates: [21.0333, 50.5833],
    type: 'production-service',
    status: 'operational',
    description: 'European production facility and customer service center'
  },
  {
    id: 'production-vietnam',
    name: 'Asia-Pacific Production Facility',
    city: 'Da Nang',
    region: 'Da Nang Province',
    country: 'Vietnam',
    coordinates: [108.2022, 16.0544],
    type: 'production',
    status: 'opening-soon',
    description: 'New manufacturing facility serving Asian markets'
  }
];

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  headquarters: 'Headquarters',
  distribution: 'Distribution Centre',
  production: 'Production',
  'production-service': 'Production & Service'
};

export const FACILITY_TYPE_COLORS: Record<FacilityType, string> = {
  headquarters: '#1479BC', // BAPI Blue - primary facility
  distribution: '#FFC843', // BAPI Yellow - logistics
  production: '#3B82F6', // Blue-500 - manufacturing
  'production-service': '#10B981' // Green-500 - multi-function
};
