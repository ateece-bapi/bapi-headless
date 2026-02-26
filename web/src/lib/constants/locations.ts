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
  },

  // TODO: Add sales staff locations (awaiting data from Mike Moss)
  // Per Mike Moss: "include the locations of our sales staff"
  // Example structure:
  // {
  //   id: 'sales-rep-midwest',
  //   name: 'Midwest Sales Representative',
  //   city: 'Chicago',
  //   region: 'Illinois',
  //   country: 'USA',
  //   coordinates: [-87.6298, 41.8781],
  //   type: 'sales',
  //   status: 'operational',
  //   description: 'Midwest territory sales and support',
  //   salesRep: {
  //     name: 'John Doe',
  //     territory: 'IL, WI, MI, IN, OH',
  //   },
  // },

  // TODO: Add distribution partner locations (awaiting data from Mike Moss)
  // Per Mike Moss: "possibly even distribution partners"
  // Example structure:
  // {
  //   id: 'partner-germany',
  //   name: 'European Distribution Partner',
  //   city: 'Munich',
  //   region: 'Bavaria',
  //   country: 'Germany',
  //   coordinates: [11.5820, 48.1351],
  //   type: 'distribution-partner',
  //   status: 'operational',
  //   description: 'Authorized distributor for Central Europe',
  //   partner: {
  //     companyName: 'Example GmbH',
  //     website: 'https://example.com',
  //   },
  // },
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
  headquarters: 'Headquarters',
  manufacturing: 'Manufacturing & Office',
  sales: 'Sales Office',
  'distribution-partner': 'Distribution Partner',
};

/**
 * Facility type colors for map markers
 *
 * Per Mike Moss: All manufacturing facilities (Poland, Vietnam) use same color
 *
 * Color palette:
 * - Blue (#1479BC): BAPI primary - headquarters
 * - Green (#10B981): Manufacturing facilities (consistent color for all)
 * - Yellow (#FFC843): BAPI accent - sales offices
 * - Gray (#6B7280): Distribution partners
 */
export const FACILITY_TYPE_COLORS: Record<FacilityType, string> = {
  headquarters: '#1479BC', // BAPI Blue - primary facility
  manufacturing: '#10B981', // Green-500 - all manufacturing (Poland + Vietnam same)
  sales: '#FFC843', // BAPI Yellow - sales offices
  'distribution-partner': '#6B7280', // Gray-500 - third-party partners
};

/**
 * Get locations by type
 */
export function getLocationsByType(type: FacilityType): Location[] {
  return BAPI_LOCATIONS.filter((location) => location.type === type);
}

/**
 * Get location by ID
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