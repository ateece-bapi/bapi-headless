/**
 * Trade Show Data Model
 * @module lib/data/tradeShows
 *
 * TypeScript data model for BAPI trade show calendar.
 * Phase 1: Static data (mock events from Asana)
 * Phase 2: Migrate to WordPress custom post type via GraphQL
 */

export interface TradeShow {
  /** Unique identifier (slug format) */
  id: string;
  /** Event name/title */
  title: string;
  /** Start date in ISO 8601 format (YYYY-MM-DD) */
  startDate: string;
  /** End date in ISO 8601 format (YYYY-MM-DD) */
  endDate: string;
  /** Location details */
  location: {
    /** City name */
    city: string;
    /** State/Province (optional) */
    state?: string;
    /** Country */
    country: string;
    /** Venue name (optional) */
    venue?: string;
  };
  /** BAPI booth number (e.g., "Hall C, Booth 1234") */
  booth?: string;
  /** Event description/summary (2-3 sentences max for card display) */
  description: string;
  /** External registration/event website URL */
  registrationUrl?: string;
  /** Path to event flyer PDF (relative to /public, e.g., "/pdfs/ahr-expo-2026.pdf") */
  flyerUrl?: string;
  /** BAPI contact person for this event */
  contact?: {
    /** Contact name */
    name: string;
    /** Contact email */
    email: string;
    /** Contact phone (optional) */
    phone?: string;
  };
  /** Featured image or event logo (optional) */
  featuredImage?: string;
  /** Event status (derived from dates) */
  status: 'upcoming' | 'past';
}

/**
 * BAPI Trade Show Calendar 2026
 * Real events imported from Asana Sales Event Coordination project
 * Data refreshed: March 9, 2026
 */
export const TRADE_SHOWS: TradeShow[] = [
  // COMPLETED EVENTS (January - February 2026)
  {
    id: 'hvacr-japan-2026',
    title: 'HVAC/R Japan',
    startDate: '2026-01-27',
    endDate: '2026-01-30',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      venue: 'Tokyo Big Sight',
    },
    booth: 'TBD',
    description:
      'Japan\'s premier HVAC and refrigeration trade show, showcasing the latest innovations in climate control and building automation technologies for the Asia-Pacific market.',
    registrationUrl: 'https://www.jraia.or.jp/hvacr/',
    contact: {
      name: 'T Wilder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'past',
  },
  {
    id: 'ahr-expo-2026',
    title: 'AHR Expo 2026 - Las Vegas',
    startDate: '2026-02-02',
    endDate: '2026-02-04',
    location: {
      city: 'Las Vegas',
      state: 'NV',
      country: 'USA',
      venue: 'Las Vegas Convention Center',
    },
    booth: 'TBD',
    description:
      'The AHR Expo is the world\'s largest HVACR marketplace, attracting thousands of industry professionals from around the globe. Experience BAPI\'s full line of building automation sensors and controls.',
    registrationUrl: 'https://www.ahrexpo.com/',
    flyerUrl: '/pdfs/ahr-expo-2026.pdf',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'past',
  },
  {
    id: 'ptak-warsaw-hvac-2026',
    title: 'PTAK Warsaw HVAC',
    startDate: '2026-02-24',
    endDate: '2026-02-26',
    location: {
      city: 'Warsaw',
      country: 'Poland',
      venue: 'Ptak Warsaw Expo',
    },
    booth: 'TBD',
    description:
      'Leading Central European exhibition for heating, ventilation, air conditioning, water, sewage, and environmental protection. Connect with BAPI to explore solutions for the European market.',
    registrationUrl: 'https://warsawexpo.eu/en/',
    contact: {
      name: 'Jan Zurawski',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'past',
  },
  
  // UPCOMING EVENTS (March - December 2026)
  {
    id: 'acrex-india-2026',
    title: 'Acrex India 2026',
    startDate: '2026-03-12',
    endDate: '2026-03-14',
    location: {
      city: 'Mumbai',
      country: 'India',
      venue: 'Bombay Exhibition Centre',
    },
    booth: 'TBD',
    description:
      'Asia\'s premier HVAC&R exhibition, bringing together industry leaders and innovative solutions for the South Asian market. Discover BAPI\'s precision sensors for challenging climates.',
    registrationUrl: 'https://www.acrex.in/home',
    contact: {
      name: 'Jonathan Hillebrand',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'holiday-wholesale-event-2026',
    title: 'Holiday Wholesale Event',
    startDate: '2026-03-12',
    endDate: '2026-03-13',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Annual wholesale event connecting BAPI with distribution partners. Network with industry professionals and explore partnership opportunities.',
    contact: {
      name: 'Courtney Meyer',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'mce-expocomfort-2026',
    title: 'Mostra Convegno Expocomfort MCE',
    startDate: '2026-03-24',
    endDate: '2026-03-27',
    location: {
      city: 'Milan',
      country: 'Italy',
      venue: 'Fiera Milano',
    },
    booth: 'TBD',
    description:
      'Italy\'s premier exhibition for HVAC, renewable energy, and building technology solutions. Experience BAPI\'s innovative sensor portfolio for European applications.',
    registrationUrl: 'https://www.mcexpocomfort.it/en-gb.html',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'hrc-2026',
    title: 'HRC 2026',
    startDate: '2026-03-29',
    endDate: '2026-04-01',
    location: {
      city: 'Harrogate',
      country: 'United Kingdom',
      venue: 'Harrogate Convention Centre',
    },
    booth: 'TBD',
    description:
      'The UK\'s leading hospitality, restaurant, and catering trade show. Explore BAPI\'s solutions for commercial kitchen and foodservice applications.',
    registrationUrl: 'https://www.hrc.co.uk/',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'niagara-summit-2026',
    title: 'Niagara Summit',
    startDate: '2026-04-07',
    endDate: '2026-04-09',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Join BAPI at the Tridium Niagara Summit to explore the latest in building automation and IoT integration for smart buildings.',
    registrationUrl: 'https://www.tridium.com/us/en/niagarasummit',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'pharmatech-expo-2026',
    title: 'Pharmatech Expo',
    startDate: '2026-04-09',
    endDate: '2026-04-11',
    location: {
      city: 'Mumbai',
      country: 'India',
      venue: 'Bombay Exhibition Centre',
    },
    booth: 'TBD',
    description:
      'Leading pharmaceutical manufacturing and packaging technology exhibition in India. Discover BAPI\'s precision sensors for cleanroom and pharmaceutical applications.',
    registrationUrl: 'https://pharmatechexpo.com/',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'data-center-world-2026',
    title: 'Data Center World',
    startDate: '2026-04-20',
    endDate: '2026-04-23',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'The data center industry\'s most comprehensive conference and expo, featuring the latest in facility design, operations, and technology. Explore BAPI\'s environmental monitoring solutions.',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'nordbygg-stockholm-2026',
    title: 'Nordbygg - Stockholm 2026',
    startDate: '2026-04-21',
    endDate: '2026-04-24',
    location: {
      city: 'Stockholm',
      country: 'Sweden',
      venue: 'Stockholm Exhibition Centre',
    },
    booth: 'TBD',
    description:
      'Scandinavia\'s largest construction and building technology exhibition. Connect with BAPI to discuss sensor solutions for Nordic building standards.',
    registrationUrl: 'https://nordbygg.se/en/',
    contact: {
      name: 'Jan Zurawski',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'alc-distribution-meeting-puerto-rico-2026',
    title: 'ALC Distribution Meeting - Puerto Rico',
    startDate: '2026-04-27',
    endDate: '2026-04-30',
    location: {
      city: 'Puerto Rico',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Automated Logic distribution partner meeting in Puerto Rico. Network with regional distribution partners and explore new opportunities.',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'arbs-qld-2026',
    title: 'ARBS QLD 2026',
    startDate: '2026-05-05',
    endDate: '2026-05-07',
    location: {
      city: 'Brisbane',
      state: 'QLD',
      country: 'Australia',
      venue: 'Brisbane Convention & Exhibition Centre',
    },
    booth: 'TBD',
    description:
      'Australia\'s premier refrigeration and air conditioning trade show. Meet with BAPI representatives to discuss solutions for the Asia-Pacific market.',
    registrationUrl: 'https://www.arbs.com.au/',
    contact: {
      name: 'A Brooks',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'controls-con-2026',
    title: 'Controls-Con 2026',
    startDate: '2026-05-14',
    endDate: '2026-05-15',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Building automation and controls conference focused on cutting-edge HVAC control strategies. Discover BAPI\'s comprehensive sensor portfolio for BAS integration.',
    registrationUrl: 'https://www.controlscon.com/',
    contact: {
      name: 'Jonathan Hillebrand',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'national-restaurant-show-2026',
    title: 'National Restaurant Show 2026',
    startDate: '2026-05-16',
    endDate: '2026-05-19',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      venue: 'McCormick Place',
    },
    booth: 'TBD',
    description:
      'The foodservice industry\'s premier event showcasing the latest equipment, technology, and trends. Explore BAPI\'s temperature and humidity sensors for commercial kitchens.',
    registrationUrl: 'https://www.nationalrestaurantshow.com/home/',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'data-center-techex-2026',
    title: 'Data Center - TechEx',
    startDate: '2026-05-18',
    endDate: '2026-05-19',
    location: {
      city: 'Santa Clara',
      state: 'CA',
      country: 'USA',
      venue: 'Santa Clara Convention Center',
    },
    booth: 'TBD',
    description:
      'North America\'s leading data center technology exhibition. Learn how BAPI sensors support efficient data center operations and environmental monitoring.',
    registrationUrl: 'https://techexevent.com/techex-north-america-2026-exhibitor-hub/',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'nova-build-expo-2026',
    title: 'Nova Build Expo 2026',
    startDate: '2026-06-03',
    endDate: '2026-06-05',
    location: {
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      venue: 'Saigon Exhibition & Convention Center',
    },
    booth: 'TBD',
    description:
      'Vietnam\'s leading international construction and building materials exhibition. Connect with BAPI to explore sensor solutions for Southeast Asian markets.',
    registrationUrl: 'https://www.thenovaexpo.com/index.html',
    contact: {
      name: 'T Wilder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'embe-expo-2026',
    title: 'EMBE Expo',
    startDate: '2026-06-24',
    endDate: '2026-06-25',
    location: {
      city: 'Coventry',
      country: 'United Kingdom',
      venue: 'Coventry Building Society Arena',
    },
    booth: 'TBD',
    description:
      'Europe\'s premier biomedical engineering and healthcare technology exhibition. Discover BAPI\'s precision sensors for healthcare and laboratory environments.',
    registrationUrl: 'https://www.coventrybuildingsocietyarena.co.uk/whats-on/ebme-expo',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  
  // SEPTEMBER - DECEMBER 2026
  {
    id: 'delta-global-conference-2026',
    title: 'Delta Global Conference',
    startDate: '2026-09-01',
    endDate: '2026-09-01',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Delta Controls annual global conference. Date typically in September but TBD. Network with Delta partners and explore BAPI integration opportunities.',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'world-coldchain-expo-2026',
    title: 'World Coldchain Expo',
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Global exhibition focused on cold chain logistics and temperature-controlled warehouse solutions. Discover BAPI\'s temperature monitoring solutions for cold storage.',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'cold-chain-hub-2026',
    title: 'Cold Chain Hub 2026',
    startDate: '2026-09-09',
    endDate: '2026-09-10',
    location: {
      city: 'Birmingham',
      country: 'United Kingdom',
      venue: 'NEC Birmingham',
    },
    booth: 'TBD',
    description:
      'The UK\'s premier cold chain and temperature-controlled logistics exhibition. Explore BAPI\'s precision sensors for critical temperature monitoring applications.',
    registrationUrl: 'https://www.thenec.co.uk/whats-on/cold-chain-hub-by-tcsd/',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'iheem-healthcare-estates-2026',
    title: 'IHEEM Healthcare Estates',
    startDate: '2026-09-13',
    endDate: '2026-09-14',
    location: {
      city: 'Manchester',
      country: 'United Kingdom',
      venue: 'Manchester Central',
    },
    booth: 'TBD',
    description:
      'The UK\'s leading healthcare estates and facilities management conference and exhibition. Learn about BAPI\'s healthcare facility monitoring solutions.',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'data-center-world-power-2026',
    title: 'Data Center World-Power',
    startDate: '2026-09-21',
    endDate: '2026-09-23',
    location: {
      city: 'Location TBD',
      country: 'USA',
    },
    booth: 'TBD',
    description:
      'Focused on data center power infrastructure, energy efficiency, and critical facilities management. Discover BAPI\'s environmental monitoring and control solutions.',
    registrationUrl: 'https://dcwpower.com/',
    contact: {
      name: 'M Holder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'isk-sodex-2026',
    title: 'Isk Sodex',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      venue: 'Istanbul Expo Center',
    },
    booth: 'TBD',
    description:
      'Turkey\'s international HVAC and refrigeration technology exhibition. Connect with BAPI to discuss sensor solutions for Middle Eastern and Turkish markets.',
    registrationUrl: 'https://www.sodex.com.tr/en',
    contact: {
      name: 'Jan Zurawski',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'chillventa-2026',
    title: 'Chillventa 2026',
    startDate: '2026-10-13',
    endDate: '2026-10-15',
    location: {
      city: 'Nuremberg',
      country: 'Germany',
      venue: 'Messe Nürnberg',
    },
    booth: 'TBD',
    description:
      'International trade fair for refrigeration, AC, ventilation and heat pumps. Europe\'s No. 1 refrigeration technology platform. Experience BAPI\'s full sensor portfolio.',
    registrationUrl: 'https://www.chillventa.de/en',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'smart-buildings-london-2026',
    title: 'Smart Buildings - London',
    startDate: '2026-10-14',
    endDate: '2026-10-15',
    location: {
      city: 'London',
      country: 'United Kingdom',
      venue: 'ExCeL London',
    },
    booth: 'TBD',
    description:
      'Explore the future of intelligent building systems, IoT integration, and energy management solutions. Join BAPI to discover smart sensor technologies.',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'hvacr-vietnam-2026',
    title: 'HVAC/R Vietnam',
    startDate: '2026-11-04',
    endDate: '2026-11-06',
    location: {
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      venue: 'Saigon Exhibition & Convention Center',
    },
    booth: 'TBD',
    description:
      'Vietnam\'s leading HVAC and refrigeration trade show showcasing the latest climate control innovations. Meet BAPI representatives for Southeast Asia.',
    contact: {
      name: 'T Wilder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'suffa-2026',
    title: 'SUFFA 2026',
    startDate: '2026-11-07',
    endDate: '2026-11-09',
    location: {
      city: 'Stuttgart',
      country: 'Germany',
      venue: 'Messe Stuttgart',
    },
    booth: 'TBD',
    description:
      'Leading European trade fair for dairy, oil, food, and beverage technology. Explore BAPI\'s sensors for food processing and cold chain applications.',
    registrationUrl: 'https://www.messe-stuttgart.de/sueffa/en/',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'elemental-2026',
    title: 'Elemental',
    startDate: '2026-11-19',
    endDate: '2026-11-20',
    location: {
      city: 'Birmingham',
      country: 'United Kingdom',
      venue: 'NEC Birmingham',
    },
    booth: 'TBD',
    description:
      'The UK\'s fire, security, and electrical safety exhibition. Learn how BAPI sensors contribute to building safety and compliance.',
    contact: {
      name: 'M Moss',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'big-5-global-2026',
    title: 'Big 5 Global 2026',
    startDate: '2026-11-23',
    endDate: '2026-11-26',
    location: {
      city: 'Dubai',
      country: 'UAE',
      venue: 'Dubai World Trade Centre',
    },
    booth: 'TBD',
    description:
      'The Middle East\'s largest construction industry event covering all aspects of building and construction. Connect with BAPI for regional partnership opportunities.',
    registrationUrl: 'https://www.big5global.com/',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'pmtech-2026',
    title: 'Pmtech',
    startDate: '2026-11-24',
    endDate: '2026-11-26',
    location: {
      city: 'Location TBD',
      country: 'UAE',
    },
    booth: 'TBD',
    description:
      'Property management and facilities technology exhibition. Discover how BAPI sensors enhance facility management and building performance.',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  
  // EVENTS WITHOUT CONFIRMED DATES
  {
    id: 'automated-logic-mideast-meeting-2026',
    title: 'Automated Logic Mideast Meeting',
    startDate: '',
    endDate: '',
    location: {
      city: 'Middle East',
      country: 'UAE',
    },
    booth: 'TBD',
    description:
      'Automated Logic regional partner meeting in the Middle East. Date to be announced. Network with regional distributors and explore partnership opportunities.',
    contact: {
      name: 'J Shields',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
  {
    id: 'ish-shanghai-2026',
    title: 'ISH Shanghai',
    startDate: '',
    endDate: '',
    location: {
      city: 'Shanghai',
      country: 'China',
      venue: 'National Exhibition and Convention Center',
    },
    booth: 'TBD',
    description:
      'Asia\'s leading trade fair for HVAC, water, and energy. Date to be confirmed. Connect with BAPI to discuss opportunities in the Chinese market.',
    registrationUrl: 'https://ishs-cihe.hk.messefrankfurt.com/shanghai/en.html',
    contact: {
      name: 'T Wilder',
      email: 'sales@bapisensors.com',
      phone: '+1 (815) 456-0134',
    },
    status: 'upcoming',
  },
];

/**
 * Get all upcoming trade shows, sorted by date (ascending)
 * Events without dates are shown last
 * @returns Array of upcoming TradeShow objects
 */
export function getUpcomingShows(): TradeShow[] {
  const today = new Date().toISOString().split('T')[0];
  
  // Separate events with and without dates
  const withDates = TRADE_SHOWS.filter((show) => show.startDate && show.startDate >= today);
  const withoutDates = TRADE_SHOWS.filter((show) => !show.startDate);
  
  // Sort events with dates
  withDates.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  // Return confirmed events first, then TBD events
  return [...withDates, ...withoutDates];
}

/**
 * Get all past trade shows, sorted by date (descending - most recent first)
 * Only returns events with confirmed dates that have passed
 * @returns Array of past TradeShow objects
 */
export function getPastShows(): TradeShow[] {
  const today = new Date().toISOString().split('T')[0];
  return TRADE_SHOWS.filter((show) => show.startDate && show.startDate < today).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

/**
 * Get all trade shows (upcoming first, then past)
 * @returns Array of all TradeShow objects
 */
export function getAllShows(): TradeShow[] {
  return [...getUpcomingShows(), ...getPastShows()];
}

/**
 * Get a single trade show by ID
 * @param id - Trade show ID (slug)
 * @returns TradeShow object or undefined if not found
 */
export function getShowById(id: string): TradeShow | undefined {
  return TRADE_SHOWS.find((show) => show.id === id);
}

/**
 * Format date range for display
 * Handles events without confirmed dates
 * @param startDate - ISO date string (or empty string for TBD)
 * @param endDate - ISO date string (or empty string for TBD)
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date range string (e.g., "January 26-28, 2026") or "Date TBD"
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  locale = 'en-US'
): string {
  // Handle events without confirmed dates
  if (!startDate || !endDate) {
    return 'Date TBD';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  // Same month and year - show abbreviated range
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    const monthYear = start.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    });
    return `${monthYear} ${start.getDate()}-${end.getDate()}`;
  }

  // Different months or years - show full range
  const startStr = start.toLocaleDateString(locale, options);
  const endStr = end.toLocaleDateString(locale, options);
  return `${startStr} - ${endStr}`;
}
