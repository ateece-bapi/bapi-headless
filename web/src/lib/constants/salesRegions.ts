/**
 * BAPI Global Sales Regions
 *
 * 15 sales territories with regional managers, based on BAPI internal
 * territory map (REV.26.1.0). Used to power the interactive world map
 * hover experience: hovering a country highlights its entire BAPI region
 * and surfaces the correct sales contact.
 *
 * Country names match Natural Earth 110m dataset (world-atlas@2) as used
 * by react-simple-maps. Use geo.properties.name for lookups.
 *
 * Regions:
 *  1  – North America          (Matt Holder)
 *  2  – South America          (John Shields)
 *  3  – Scandinavia & Baltic   (John Shields)
 *  4  – Western Europe         (Mike Moss)
 *  5  – Central Europe         (Mike Moss)
 *  6  – Eastern Europe/Balkans (Jan Zurawski)
 *  7  – West & Central Africa  (John Shields)
 *  8  – East & Southern Africa (John Shields)
 *  9  – Middle East & Turkey   (Murtaza Kalabhai)
 * 10  – South Asia             (Murtaza Kalabhai)
 * 11  – China & Mongolia       (Tim Wilder)
 * 12  – East Asia              (Tim Wilder)
 * 13  – Southeast Asia         (Tim Wilder)
 * 14  – Australia & Pacific    (Andy Brooks)
 * 15  – Russia & Kazakhstan    (John Shields)
 */

export interface SalesRep {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  regions: number[];
}

export interface SalesRegion {
  id: number;
  name: string;
  repId: string;
  description: string;
}

export const SALES_REPS: SalesRep[] = [
  {
    id: 'matt-holder',
    name: 'Matt Holder',
    title: 'Business Development & Regional Sales',
    regions: [1],
  },
  {
    id: 'john-shields',
    name: 'John Shields',
    title: 'Business Development & Regional Sales',
    regions: [2, 3, 7, 8, 15],
  },
  {
    id: 'mike-moss',
    name: 'Mike Moss',
    title: 'Business Development & Regional Sales',
    regions: [4, 5],
  },
  {
    id: 'jan-zurawski',
    name: 'Jan Zurawski',
    title: 'Business Development & Regional Sales',
    regions: [6],
  },
  {
    id: 'murtaza-kalabhai',
    name: 'Murtaza Kalabhai',
    title: 'Business Development & Regional Sales',
    regions: [9, 10],
  },
  {
    id: 'tim-wilder',
    name: 'Tim Wilder',
    title: 'Business Development & Regional Sales',
    regions: [11, 12, 13],
  },
  {
    id: 'andy-brooks',
    name: 'Andy Brooks',
    title: 'Business Development & Regional Sales',
    regions: [14],
  },
];

export const SALES_REGIONS: SalesRegion[] = [
  {
    id: 1,
    name: 'North America',
    repId: 'matt-holder',
    description: 'USA, Canada, Mexico & Caribbean',
  },
  {
    id: 2,
    name: 'South America',
    repId: 'john-shields',
    description: 'All South American countries',
  },
  {
    id: 3,
    name: 'Scandinavia & Baltic',
    repId: 'john-shields',
    description: 'Norway, Sweden, Finland, Denmark, Iceland, Greenland & Baltic States',
  },
  {
    id: 4,
    name: 'Western Europe',
    repId: 'mike-moss',
    description: 'UK, Ireland, France, Benelux, Spain & Portugal',
  },
  {
    id: 5,
    name: 'Central Europe',
    repId: 'mike-moss',
    description: 'Germany, Austria, Switzerland, Italy, Czech Republic, Slovakia & Slovenia',
  },
  {
    id: 6,
    name: 'Eastern Europe & Balkans',
    repId: 'jan-zurawski',
    description: 'Poland, Ukraine, Belarus, Hungary, Romania, Bulgaria & the Balkans',
  },
  {
    id: 7,
    name: 'West & Central Africa',
    repId: 'john-shields',
    description: 'West & Central Africa (Morocco, Algeria, Libya & sub-Saharan west)',
  },
  {
    id: 8,
    name: 'East & Southern Africa',
    repId: 'john-shields',
    description: 'East Africa, Southern Africa & Indian Ocean islands',
  },
  {
    id: 9,
    name: 'Middle East & Turkey',
    repId: 'murtaza-kalabhai',
    description: 'Turkey, Arabian Peninsula, Levant, Iran, Egypt & Caucasus',
  },
  {
    id: 10,
    name: 'South Asia',
    repId: 'murtaza-kalabhai',
    description: 'India, Pakistan, Bangladesh, Sri Lanka & Nepal',
  },
  {
    id: 11,
    name: 'China & Mongolia',
    repId: 'tim-wilder',
    description: 'China & Mongolia',
  },
  {
    id: 12,
    name: 'East Asia',
    repId: 'tim-wilder',
    description: 'Japan, South Korea, North Korea & Taiwan',
  },
  {
    id: 13,
    name: 'Southeast Asia',
    repId: 'tim-wilder',
    description: 'Vietnam, Thailand, Malaysia, Indonesia, Philippines & neighbors',
  },
  {
    id: 14,
    name: 'Australia & Pacific',
    repId: 'andy-brooks',
    description: 'Australia, New Zealand & Pacific Islands',
  },
  {
    id: 15,
    name: 'Russia & Kazakhstan',
    repId: 'john-shields',
    description: 'Russia & Kazakhstan',
  },
];

/**
 * Map from Natural Earth country name → BAPI region ID.
 *
 * Country names must match what react-simple-maps / world-atlas@2 exposes in
 * `geo.properties.name`.  Uncommon variants are included as aliases.
 */
export const COUNTRY_TO_REGION: Record<string, number> = {
  // ── Region 1: North America ──────────────────────────────────────────────
  'United States of America': 1,
  Canada: 1,
  Mexico: 1,
  Guatemala: 1,
  Belize: 1,
  Honduras: 1,
  'El Salvador': 1,
  Nicaragua: 1,
  'Costa Rica': 1,
  Panama: 1,
  Cuba: 1,
  Jamaica: 1,
  Haiti: 1,
  'Dominican Rep.': 1,
  'Puerto Rico': 1,
  'Trinidad and Tobago': 1,
  Bahamas: 1,
  Barbados: 1,
  'Antigua and Barb.': 1,
  'St. Kitts and Nevis': 1,
  Grenada: 1,
  'St. Vincent and the Grenadines': 1,
  Dominica: 1,
  'St. Lucia': 1,

  // ── Region 2: South America ──────────────────────────────────────────────
  Brazil: 2,
  Argentina: 2,
  Chile: 2,
  Peru: 2,
  Colombia: 2,
  Venezuela: 2,
  Bolivia: 2,
  Ecuador: 2,
  Paraguay: 2,
  Uruguay: 2,
  Guyana: 2,
  Suriname: 2,
  'Fr. Guiana': 2,
  'Falkland Is.': 2,

  // ── Region 3: Scandinavia, Baltic & Greenland ──────────────────────────────
  Norway: 3,
  Sweden: 3,
  Finland: 3,
  Denmark: 3,
  Iceland: 3,
  Greenland: 3,
  Estonia: 3,
  Latvia: 3,
  Lithuania: 3,
  'Faroe Is.': 3,

  // ── Region 4: Western Europe (UK, Ireland, France, Iberia, Benelux) ───────
  'United Kingdom': 4,
  Ireland: 4,
  France: 4,
  Netherlands: 4,
  Belgium: 4,
  Luxembourg: 4,
  Spain: 4,
  Portugal: 4,
  Andorra: 4,
  Monaco: 4,

  // ── Region 5: Central Europe (German-speaking + Italy cluster) ───────────
  Germany: 5,
  Austria: 5,
  Switzerland: 5,
  Liechtenstein: 5,
  Italy: 5,
  Slovenia: 5,
  Czechia: 5,
  'Czech Rep.': 5,
  Slovakia: 5,

  // ── Region 6: Eastern Europe & Balkans ────────────────────────────────────
  Poland: 6,
  Ukraine: 6,
  Belarus: 6,
  Moldova: 6,
  Romania: 6,
  Bulgaria: 6,
  Hungary: 6,
  Croatia: 6,
  Serbia: 6,
  'Bosnia and Herz.': 6,
  Montenegro: 6,
  'North Macedonia': 6,
  Macedonia: 6,
  Albania: 6,
  Kosovo: 6,
  Greece: 6,
  Malta: 6,

  // ── Region 7: West & Central Africa (incl. North Africa) ─────────────────
  Morocco: 7,
  Algeria: 7,
  Tunisia: 7,
  Libya: 7,
  'W. Sahara': 7,
  Mauritania: 7,
  Mali: 7,
  Niger: 7,
  Chad: 7,
  Senegal: 7,
  Gambia: 7,
  'Guinea-Bissau': 7,
  Guinea: 7,
  'Sierra Leone': 7,
  Liberia: 7,
  "Côte d'Ivoire": 7,
  Ghana: 7,
  Togo: 7,
  Benin: 7,
  Nigeria: 7,
  Cameroon: 7,
  Gabon: 7,
  'Eq. Guinea': 7,
  Congo: 7,
  'Central African Rep.': 7,
  'Burkina Faso': 7,
  'Cape Verde': 7,
  'São Tomé and Principe': 7,
  Sudan: 7,

  // ── Region 8: East & Southern Africa ─────────────────────────────────────
  'Dem. Rep. Congo': 8,
  'S. Sudan': 8,
  Ethiopia: 8,
  Eritrea: 8,
  Djibouti: 8,
  Somalia: 8,
  Somaliland: 8,
  Kenya: 8,
  Uganda: 8,
  Tanzania: 8,
  Rwanda: 8,
  Burundi: 8,
  Zambia: 8,
  Zimbabwe: 8,
  Mozambique: 8,
  Madagascar: 8,
  Malawi: 8,
  Botswana: 8,
  Namibia: 8,
  'South Africa': 8,
  Lesotho: 8,
  eSwatini: 8,
  Swaziland: 8,
  Angola: 8,
  Comoros: 8,
  Seychelles: 8,
  Mauritius: 8,

  // ── Region 9: Middle East, Turkey & Caucasus ────────────────────────────
  Turkey: 9,
  Cyprus: 9,
  Egypt: 9,
  'Saudi Arabia': 9,
  Yemen: 9,
  Oman: 9,
  'United Arab Emirates': 9,
  Qatar: 9,
  Bahrain: 9,
  Kuwait: 9,
  Iraq: 9,
  Iran: 9,
  Israel: 9,
  Palestine: 9,
  Jordan: 9,
  Lebanon: 9,
  Syria: 9,
  Afghanistan: 9,
  // Caucasus
  Georgia: 9,
  Armenia: 9,
  Azerbaijan: 9,
  // Central Asian stans (dark red on map, not purple Russia zone)
  Uzbekistan: 9,
  Turkmenistan: 9,
  Kyrgyzstan: 9,
  Tajikistan: 9,

  // ── Region 10: South Asia ─────────────────────────────────────────────────
  India: 10,
  Pakistan: 10,
  Bangladesh: 10,
  'Sri Lanka': 10,
  Nepal: 10,
  Bhutan: 10,
  Maldives: 10,

  // ── Region 11: China & Mongolia ───────────────────────────────────────────
  China: 11,
  Mongolia: 11,

  // ── Region 12: East Asia ──────────────────────────────────────────────────
  Japan: 12,
  'S. Korea': 12,
  'N. Korea': 12,
  'South Korea': 12,
  'North Korea': 12,
  Taiwan: 12,

  // ── Region 13: Southeast Asia ─────────────────────────────────────────────
  Vietnam: 13,
  Thailand: 13,
  Malaysia: 13,
  Singapore: 13,
  Indonesia: 13,
  Philippines: 13,
  Myanmar: 13,
  Cambodia: 13,
  Laos: 13,
  Brunei: 13,
  'Timor-Leste': 13,
  'East Timor': 13,

  // ── Region 14: Australia & Pacific ───────────────────────────────────────
  Australia: 14,
  'New Zealand': 14,
  'Papua New Guinea': 14,
  'Solomon Is.': 14,
  Vanuatu: 14,
  Fiji: 14,
  'New Caledonia': 14,

  // ── Region 15: Russia & Kazakhstan ─────────────────────────────────────
  Russia: 15,
  Kazakhstan: 15,
};

/** Look up a SalesRep by their id. */
export function getSalesRep(repId: string): SalesRep | undefined {
  return SALES_REPS.find((r) => r.id === repId);
}

/**
 * Precomputed O(1) lookup maps — built once at module load so per-render calls
 * in GlobalPresence (called for every geography on every hover) stay fast.
 */
const REGION_BY_ID = new Map<number, SalesRegion>(
  SALES_REGIONS.map((r) => [r.id, r]),
);

const REP_BY_ID = new Map<string, SalesRep>(
  SALES_REPS.map((r) => [r.id, r]),
);

/** Look up a SalesRegion and its SalesRep for a given Natural Earth country name. */
export function getRegionForCountry(
  countryName: string,
): { region: SalesRegion; rep: SalesRep } | null {
  const regionId = COUNTRY_TO_REGION[countryName];
  if (!regionId) return null;

  const region = REGION_BY_ID.get(regionId);
  if (!region) return null;

  const rep = REP_BY_ID.get(region.repId);
  if (!rep) return null;

  return { region, rep };
}
