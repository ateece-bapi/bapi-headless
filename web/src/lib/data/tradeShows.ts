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
 * Mock Trade Show Data
 * Real industry events with realistic details
 */
export const TRADE_SHOWS: TradeShow[] = [
  {
    id: 'ahr-expo-2026',
    title: 'AHR Expo 2026',
    startDate: '2026-01-26',
    endDate: '2026-01-28',
    location: {
      city: 'Orlando',
      state: 'FL',
      country: 'USA',
      venue: 'Orange County Convention Center',
    },
    booth: 'Hall C, Booth 4521',
    description:
      'The AHR Expo is the world\'s largest HVACR marketplace, bringing together industry professionals to explore the latest innovations in heating, ventilation, air conditioning, and refrigeration. Join BAPI to discover our newest building automation sensors and controls.',
    registrationUrl: 'https://www.ahrexpo.com',
    flyerUrl: '/pdfs/ahr-expo-2026.pdf',
    contact: {
      name: 'Mike Johnson',
      email: 'mjohnson@bapi.com',
      phone: '+1 (651) 481-7224',
    },
    status: 'past',
  },
  {
    id: 'ashrae-winter-conference-2026',
    title: 'ASHRAE Winter Conference 2026',
    startDate: '2026-02-07',
    endDate: '2026-02-11',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      venue: 'McCormick Place',
    },
    booth: 'Booth 312',
    description:
      'ASHRAE brings together HVAC&R professionals, engineers, and industry leaders to discuss the latest advancements in building systems and energy efficiency. Visit BAPI\'s booth to learn about our precision sensors for critical environments.',
    registrationUrl: 'https://www.ashrae.org/conferences',
    flyerUrl: '/pdfs/ashrae-winter-2026.pdf',
    contact: {
      name: 'Sarah Mitchell',
      email: 'smitchell@bapi.com',
      phone: '+1 (651) 481-7229',
    },
    status: 'past',
  },
  {
    id: 'ish-2026',
    title: 'ISH Frankfurt 2026',
    startDate: '2026-03-24',
    endDate: '2026-03-28',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      venue: 'Messe Frankfurt',
    },
    booth: 'Hall 10.3, Stand B45',
    description:
      'ISH is the world\'s leading trade fair for HVAC and water. As Europe\'s premier building technology event, it showcases innovative solutions for sustainable buildings. Experience BAPI\'s full product line including our wireless sensor systems.',
    registrationUrl: 'https://www.ish.messefrankfurt.com',
    flyerUrl: '/pdfs/ish-2026.pdf',
    contact: {
      name: 'Thomas Weber',
      email: 'tweber@bapi.com',
      phone: '+49 69 7575 6866',
    },
    status: 'upcoming',
  },
  {
    id: 'greenbuild-2026',
    title: 'Greenbuild International Conference 2026',
    startDate: '2026-04-15',
    endDate: '2026-04-17',
    location: {
      city: 'San Diego',
      state: 'CA',
      country: 'USA',
      venue: 'San Diego Convention Center',
    },
    booth: 'Booth 1847',
    description:
      'Greenbuild is the world\'s largest conference and expo dedicated to green building. Join thousands of professionals committed to sustainability and discover how BAPI sensors support LEED certification and energy-efficient building operations.',
    registrationUrl: 'https://www.greenbuildexpo.com',
    flyerUrl: '/pdfs/greenbuild-2026.pdf',
    contact: {
      name: 'Jennifer Davis',
      email: 'jdavis@bapi.com',
      phone: '+1 (651) 481-7225',
    },
    status: 'upcoming',
  },
  {
    id: 'aia-conference-2026',
    title: 'AIA Conference on Architecture 2026',
    startDate: '2026-05-14',
    endDate: '2026-05-16',
    location: {
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      venue: 'Boston Convention & Exhibition Center',
    },
    booth: 'Booth 2134',
    description:
      'The AIA Conference brings together architects, designers, and building professionals to explore innovations in architecture and built environments. Learn how BAPI sensors integrate seamlessly into modern building designs.',
    registrationUrl: 'https://conferenceonarchitecture.com',
    flyerUrl: '/pdfs/aia-2026.pdf',
    contact: {
      name: 'Robert Chen',
      email: 'rchen@bapi.com',
      phone: '+1 (651) 481-7227',
    },
    status: 'upcoming',
  },
  {
    id: 'ashrae-annual-conference-2026',
    title: 'ASHRAE Annual Conference 2026',
    startDate: '2026-06-27',
    endDate: '2026-07-01',
    location: {
      city: 'Toronto',
      state: 'ON',
      country: 'Canada',
      venue: 'Metro Toronto Convention Centre',
    },
    booth: 'Booth 428',
    description:
      'ASHRAE\'s flagship annual conference features cutting-edge technical sessions, product showcases, and networking opportunities for HVAC&R professionals worldwide. Discover BAPI\'s latest innovations in building automation.',
    registrationUrl: 'https://www.ashrae.org/conferences/annual-conference',
    flyerUrl: '/pdfs/ashrae-annual-2026.pdf',
    contact: {
      name: 'Laura Thompson',
      email: 'lthompson@bapi.com',
      phone: '+1 (651) 481-7226',
    },
    status: 'upcoming',
  },
  {
    id: 'automationx-2026',
    title: 'AutomationX Building Controls Expo 2026',
    startDate: '2026-08-11',
    endDate: '2026-08-13',
    location: {
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      venue: 'Kay Bailey Hutchison Convention Center',
    },
    booth: 'Hall D, Booth 3012',
    description:
      'AutomationX focuses exclusively on building automation systems, controls, and IoT integration. Join BAPI to explore our comprehensive sensor portfolio and discuss custom solutions for your projects.',
    registrationUrl: 'https://www.automationxexpo.com',
    flyerUrl: '/pdfs/automationx-2026.pdf',
    contact: {
      name: 'David Martinez',
      email: 'dmartinez@bapi.com',
      phone: '+1 (651) 481-7228',
    },
    status: 'upcoming',
  },
  {
    id: 'iaq-conference-2026',
    title: 'Indoor Air Quality Conference 2026',
    startDate: '2026-09-22',
    endDate: '2026-09-24',
    location: {
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      venue: 'Colorado Convention Center',
    },
    booth: 'Booth 615',
    description:
      'This specialized conference addresses indoor air quality challenges in commercial and residential buildings. Learn how BAPI\'s air quality sensors help maintain healthy indoor environments and comply with new IAQ standards.',
    registrationUrl: 'https://www.iaqconference.com',
    flyerUrl: '/pdfs/iaq-2026.pdf',
    contact: {
      name: 'Emily Rodriguez',
      email: 'erodriguez@bapi.com',
      phone: '+1 (651) 481-7230',
    },
    status: 'upcoming',
  },
  {
    id: 'buildtech-asia-2026',
    title: 'BuildTech Asia 2026',
    startDate: '2026-10-19',
    endDate: '2026-10-21',
    location: {
      city: 'Singapore',
      country: 'Singapore',
      venue: 'Marina Bay Sands Expo & Convention Centre',
    },
    booth: 'Hall 3, Booth A42',
    description:
      'BuildTech Asia showcases the latest smart building technologies and sustainable solutions for the Asia-Pacific region. Meet with BAPI representatives to discuss regional distribution and our wireless sensor platforms.',
    registrationUrl: 'https://www.buildtechasia.com',
    flyerUrl: '/pdfs/buildtech-asia-2026.pdf',
    contact: {
      name: 'Kevin Tan',
      email: 'ktan@bapi.com',
      phone: '+65 6789 1234',
    },
    status: 'upcoming',
  },
  {
    id: 'hvac-excellence-2026',
    title: 'HVAC Excellence Summit 2026',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    location: {
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      venue: 'Georgia World Congress Center',
    },
    booth: 'Booth 1523',
    description:
      'The HVAC Excellence Summit brings together contractors, engineers, and manufacturers to discuss best practices and emerging technologies in HVAC systems. See live demonstrations of BAPI\'s complete sensor solutions.',
    registrationUrl: 'https://www.hvacexcellence.com',
    flyerUrl: '/pdfs/hvac-excellence-2026.pdf',
    contact: {
      name: 'Mark Anderson',
      email: 'manderson@bapi.com',
      phone: '+1 (651) 481-7231',
    },
    status: 'upcoming',
  },
];

/**
 * Get all upcoming trade shows, sorted by date (ascending)
 * @returns Array of upcoming TradeShow objects
 */
export function getUpcomingShows(): TradeShow[] {
  const today = new Date().toISOString().split('T')[0];
  return TRADE_SHOWS.filter((show) => show.startDate >= today).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

/**
 * Get all past trade shows, sorted by date (descending - most recent first)
 * @returns Array of past TradeShow objects
 */
export function getPastShows(): TradeShow[] {
  const today = new Date().toISOString().split('T')[0];
  return TRADE_SHOWS.filter((show) => show.startDate < today).sort(
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
 * @param startDate - ISO date string
 * @param endDate - ISO date string
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date range string (e.g., "January 26-28, 2026")
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  locale = 'en-US'
): string {
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
