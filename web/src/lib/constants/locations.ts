/**
 * BAPI Global Locations
 *
 * Company facilities worldwide with coordinates for map display.
 *
 * Updated February 2026 per Mike Moss feedback:
 * - All production facilities (Poland, Vietnam) standardized as "Manufacturing & Office"
 * - UK changed from "Distribution Centre" to "Sales Office"
 * - Added support for sales staff locations
 * - Added support for distribution partner locations
 *
 * Performance: Zero runtime cost - constant data structure
 * i18n: Location translations handled via locationTranslations prop in component
 */

export type FacilityType =
  | 'headquarters' // Gays Mills - Corporate HQ + Manufacturing
  | 'manufacturing' // Poland, Vietnam - Production + Office (was 'production' / 'production-service')
  | 'sales' // UK + sales representatives (was 'distribution')
  | 'distribution-partner'; // Third-party distributor locations (NEW)

export type FacilityStatus = 'operational' | 'opening-soon';

export interface Location {
  id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude] for react-simple-maps
  type: FacilityType;
  status?: FacilityStatus;
  description: string;
  established?: string;
  // For sales representatives
  salesRep?: {
    name: string;
    territory: string;
  };
  // For distribution partners
  partner?: {
    companyName: string;
    website?: string;
  };
}

/**
 * BAPI Global Locations
 *
 * Updated February 2026:
 * - Poland & Vietnam: Now 'manufacturing' type (was 'production-service' / 'production')
 * - UK: Now 'sales' type (was 'distribution')
 * - All manufacturing facilities use same category for consistency
 */
export const BAPI_LOCATIONS: Location[] = [
  // === HEADQUARTERS ===
  // BAPI map shows both the HQ marker AND a Business Dev person marker here
  {
    id: 'headquarters-usa',
    name: 'Global Headquarters',
    city: 'Gays Mills',
    region: 'Wisconsin',
    country: 'USA',
    coordinates: [-90.8543, 43.3297], // [lng, lat]
    type: 'headquarters',
    status: 'operational',
    description: 'Corporate headquarters and primary manufacturing facility',
    established: '1993',
  },
  {
    id: 'sales-rep-usa',
    name: 'North America Sales',
    city: 'Gays Mills',
    region: 'Wisconsin',
    country: 'USA',
    coordinates: [-90.8543, 43.3297], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'North America regional sales',
    salesRep: {
      name: 'Matt Holder',
      territory: 'North America',
    },
  },

  // === MANUFACTURING & OFFICE FACILITIES ===
  // Per Mike Moss: All production facilities should be same category
  {
    id: 'manufacturing-poland',
    name: 'European Manufacturing & Office',
    city: 'Nowa Wola',
    region: 'Podkarpackie',
    country: 'Poland',
    coordinates: [21.0333, 50.5833], // [lng, lat]
    type: 'manufacturing',
    status: 'operational',
    description: 'European production facility, office, and customer service center',
  },
  // BAPI map shows both a Factory Distribution Center AND a Business Dev marker here
  {
    id: 'sales-rep-poland',
    name: 'Central & Eastern Europe Sales',
    city: 'Nowa Wola',
    region: 'Podkarpackie',
    country: 'Poland',
    coordinates: [21.0333, 50.5833], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'Central & Eastern Europe regional sales',
    salesRep: {
      name: 'Jan Zurawski',
      territory: 'Central & Eastern Europe',
    },
  },
  {
    id: 'manufacturing-vietnam',
    name: 'Asia-Pacific Manufacturing & Office',
    city: 'Da Nang',
    region: 'Da Nang Province',
    country: 'Vietnam',
    coordinates: [108.2022, 16.0544], // [lng, lat]
    type: 'manufacturing',
    status: 'opening-soon',
    description: 'New manufacturing facility and office serving Asian markets',
  },

  // === SALES OFFICES ===
  // Per Mike Moss: UK should be listed as sales office (not distribution)
  // BAPI map shows both a Factory Distribution Center AND a Business Dev marker here
  {
    id: 'manufacturing-uk',
    name: 'UK Factory Distribution Center',
    city: 'Aldershot',
    region: 'Hampshire',
    country: 'United Kingdom',
    coordinates: [-0.7629, 51.2485], // [lng, lat]
    type: 'manufacturing',
    status: 'operational',
    description: 'European factory distribution center',
  },
  {
    id: 'sales-uk',
    name: 'UK Sales Office',
    city: 'Aldershot',
    region: 'Hampshire',
    country: 'United Kingdom',
    coordinates: [-0.7629, 51.2485], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'European sales and customer support hub',
    salesRep: {
      name: 'Mike Moss',
      territory: 'Western Europe',
    },
  },

  // === SALES REPRESENTATIVE LOCATIONS ===
  {
    id: 'sales-rep-uae',
    name: 'Middle East & South Asia Sales',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: [55.2708, 25.2048], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'Middle East, Turkey & South Asia regional sales',
    salesRep: {
      name: 'Murtaza Kalabhai',
      territory: 'Middle East, Turkey & South Asia',
    },
  },
  {
    id: 'sales-rep-india',
    name: 'South Asia Sales',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    coordinates: [72.8777, 19.076], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'South Asia regional sales',
    salesRep: {
      name: 'Murtaza Kalabhai',
      territory: 'South Asia',
    },
  },
  // BAPI map shows both a Factory Distribution Center AND a Business Dev marker here
  {
    id: 'sales-rep-sea',
    name: 'Southeast Asia Sales',
    city: 'Bangkok',
    region: 'Bangkok',
    country: 'Thailand',
    coordinates: [100.5018, 13.7563], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'Southeast Asia regional sales',
    salesRep: {
      name: 'Andy Brooks',
      territory: 'Southeast Asia',
    },
  },
  {
    id: 'sales-rep-australia',
    name: 'Asia-Pacific Sales',
    city: 'Sydney',
    region: 'New South Wales',
    country: 'Australia',
    coordinates: [151.2093, -33.8688], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'Asia-Pacific regional sales',
    salesRep: {
      name: 'Andy Brooks',
      territory: 'Asia, Australia & Pacific',
    },
  },
  {
    id: 'sales-rep-newzealand',
    name: 'New Zealand Sales',
    city: 'Auckland',
    region: 'Auckland',
    country: 'New Zealand',
    coordinates: [174.7633, -36.8485], // [lng, lat]
    type: 'sales',
    status: 'operational',
    description: 'New Zealand regional sales',
    salesRep: {
      name: 'Andy Brooks',
      territory: 'Asia, Australia & Pacific',
    },
  },

  // TODO: Add distribution partner locations (awaiting data from Mike Moss)
];

/**
 * Facility type labels for UI display
 *
 * Updated February 2026:
 * - 'manufacturing' replaces 'production' and 'production-service'
 * - 'sales' replaces 'distribution'
 * - Added 'distribution-partner' for third-party distributors
 */
export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  headquarters: 'BAPI Headquarters',
  manufacturing: 'Factory Distribution Center',
  sales: 'Business Development & Regional Sales',
  'distribution-partner': 'Distribution Partner',
};

/**
 * Facility type colors for map markers — matches BAPI internal world map legend:
 * - Blue (#166fb9): BAPI Headquarters (pulsing blue badge)
 * - Gray (#6B7280): Factory Distribution Center (grey arrow badge)
 * - Blue-400 (#60A5FA): Business Development & Regional Sales (blue person badge)
 * - Gray-400 (#9CA3AF): Distribution Partners
 */
export const FACILITY_TYPE_COLORS: Record<FacilityType, string> = {
  headquarters: '#166fb9', // BAPI Blue — pulsing HQ badge
  manufacturing: '#6B7280', // Gray-500 — Factory Distribution Center grey arrow
  sales: '#60A5FA',         // Blue-400 — Business Development & Regional Sales person
  'distribution-partner': '#9CA3AF', // Gray-400 — third-party partners
};

/**
 * Get locations by type
 * @param type - Facility type to filter by
 * @returns Array of locations matching the specified type
 * @note Reserved for Phase 2: Filtering sales staff and distribution partner locations
 */
export function getLocationsByType(type: FacilityType): Location[] {
  return BAPI_LOCATIONS.filter((location) => location.type === type);
}

/**
 * Get location by ID
 * @param id - Location ID to search for
 * @returns Location object if found, undefined otherwise
 * @note Reserved for Phase 2: Individual location lookups for detail pages
 */
export function getLocationById(id: string): Location | undefined {
  return BAPI_LOCATIONS.find((location) => location.id === id);
}

/**
 * Get all unique facility types currently in use
 */
export function getActiveFacilityTypes(): FacilityType[] {
  const types = new Set(BAPI_LOCATIONS.map((loc) => loc.type));
  return Array.from(types);
}
