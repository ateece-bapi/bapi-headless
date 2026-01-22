/**
 * Virtual Application-Based Navigation
 * 
 * Maps WordPress sensor-type categories to customer-facing application categories.
 * This is a presentation layer transformation - WordPress data structure stays unchanged.
 * 
 * Key Principle: WordPress = CMS (what we make), Next.js = UX (what customers need)
 */

export interface ApplicationSubcategory {
  name: string;
  slug: string;
  description: string;
  /** WordPress product categories to fetch products from */
  wpCategories: string[];
  /** Additional filters to apply (location, mounting, industry, etc.) */
  filters?: {
    location?: 'indoor' | 'outdoor' | 'duct' | 'industrial';
    mounting?: 'wall' | 'probe' | 'strap-on' | 'immersion';
    industry?: 'commercial' | 'industrial' | 'residential';
    connectivity?: 'wired' | 'wireless';
    [key: string]: string | undefined;
  };
  /** Featured product SKUs for this application */
  featuredProducts?: string[];
}

export interface ApplicationCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: Record<string, ApplicationSubcategory>;
}

/**
 * Application-based navigation structure
 * 
 * Primary navigation for B2B customers who think in applications/use cases,
 * not sensor types. This maps to underlying WordPress sensor categories.
 */
export const applicationCategories: Record<string, ApplicationCategory> = {
  'building-automation': {
    name: 'Building Automation Solutions',
    slug: 'building-automation',
    description: 'Sensors and controls for commercial buildings, offices, schools, and healthcare facilities',
    icon: 'Building2',
    subcategories: {
      'room-monitoring': {
        name: 'Room & Space Monitoring',
        slug: 'room-monitoring',
        description: 'Monitor temperature, humidity, and air quality in offices, classrooms, conference rooms, and living spaces',
        wpCategories: [
          'room-sensors',
          'room-humidity',
          'room-co2',
          'room-temperature'
        ],
        filters: {
          location: 'indoor',
          mounting: 'wall'
        },
        featuredProducts: ['BA/10K-3', 'BA/H-WD', 'BA/RH-WD-V4']
      },
      
      'hvac-duct': {
        name: 'HVAC Duct & Air Handler Monitoring',
        slug: 'hvac-duct',
        description: 'Supply air, return air, mixed air sensing for air handling units and duct systems',
        wpCategories: [
          'duct-sensors',
          'duct-humidity',
          'duct-pressure',
          'averaging-elements'
        ],
        filters: {
          location: 'duct',
          mounting: 'probe'
        },
        featuredProducts: ['BA/10K-D', 'BA/H-D', 'BA/P-D']
      },
      
      'outdoor-weather': {
        name: 'Outdoor & Weather Stations',
        slug: 'outdoor-weather',
        description: 'Building weather stations, enthalpy control, and outdoor air monitoring',
        wpCategories: [
          'outside-air-sensors',
          'weather-stations',
          'outdoor-temperature'
        ],
        filters: {
          location: 'outdoor'
        },
        featuredProducts: ['BA/10K-O', 'BA/WS', 'BA/ENT']
      },
      
      'critical-spaces': {
        name: 'Data Centers & Critical Spaces',
        slug: 'critical-spaces',
        description: 'Precision monitoring for server rooms, labs, clean rooms, and mission-critical environments',
        wpCategories: [
          'room-sensors',
          'room-humidity',
          'room-co2',
          'temperature-sensors'
        ],
        filters: {
          location: 'indoor',
          industry: 'commercial'
        },
        featuredProducts: ['BA/10K-3-R', 'BA/RH-WD-V4']
      },
      
      'indoor-air-quality': {
        name: 'Indoor Air Quality (IAQ)',
        slug: 'indoor-air-quality',
        description: 'CO2, VOC, and air quality monitoring for healthy indoor environments',
        wpCategories: [
          'air-quality-sensors',
          'co2-sensors',
          'voc-sensors'
        ],
        filters: {
          location: 'indoor'
        },
        featuredProducts: ['BA/CO2', 'BA/VOC']
      }
    }
  },
  
  'industrial-process': {
    name: 'Industrial & Process Control',
    slug: 'industrial-process',
    description: 'Sensors for manufacturing, industrial refrigeration, and process control applications',
    icon: 'Factory',
    subcategories: {
      'manufacturing': {
        name: 'Manufacturing Process Monitoring',
        slug: 'manufacturing',
        description: 'Temperature, pressure, and humidity sensors for industrial processes',
        wpCategories: [
          'industrial-pressure',
          'process-temperature',
          'immersion-sensors'
        ],
        filters: {
          location: 'industrial',
          industry: 'industrial'
        }
      },
      
      'refrigeration': {
        name: 'Industrial Refrigeration',
        slug: 'refrigeration',
        description: 'Cold storage, food service, and refrigeration monitoring',
        wpCategories: [
          'temperature-sensors',
          'pressure-sensors',
          'immersion-sensors'
        ],
        filters: {
          industry: 'industrial'
        }
      },
      
      'compressed-air': {
        name: 'Compressed Air Systems',
        slug: 'compressed-air',
        description: 'Pressure and temperature monitoring for compressed air systems',
        wpCategories: [
          'pressure-sensors',
          'industrial-pressure'
        ],
        filters: {
          industry: 'industrial'
        }
      }
    }
  },
  
  'wireless-remote': {
    name: 'Wireless & Remote Monitoring',
    slug: 'wireless-remote',
    description: 'Battery-powered wireless sensors for retrofit and hard-to-reach locations',
    icon: 'Radio',
    subcategories: {
      'wireless-temp-humidity': {
        name: 'Wireless Temperature & Humidity',
        slug: 'wireless-temp-humidity',
        description: 'Battery-powered wireless sensors for temperature and humidity monitoring',
        wpCategories: [
          'wireless-sensors',
          'wireless-temperature',
          'wireless-humidity'
        ],
        filters: {
          connectivity: 'wireless'
        }
      },
      
      'wireless-pressure': {
        name: 'Wireless Pressure',
        slug: 'wireless-pressure',
        description: 'Wireless differential pressure sensors for filter monitoring',
        wpCategories: [
          'wireless-sensors',
          'wireless-pressure'
        ],
        filters: {
          connectivity: 'wireless'
        }
      },
      
      'wireless-iaq': {
        name: 'Wireless Indoor Air Quality',
        slug: 'wireless-iaq',
        description: 'Wireless CO2 and air quality monitoring',
        wpCategories: [
          'wireless-sensors',
          'air-quality-sensors'
        ],
        filters: {
          connectivity: 'wireless'
        }
      }
    }
  },
  
  'retrofit-replacement': {
    name: 'Retrofit & Replacement Solutions',
    slug: 'retrofit-replacement',
    description: 'Upgrade legacy systems with BACnet-compatible sensors and direct replacements',
    icon: 'RefreshCw',
    subcategories: {
      'bacnet-upgrades': {
        name: 'BACnet-Compatible Upgrades',
        slug: 'bacnet-upgrades',
        description: 'Modernize pneumatic and analog systems with BACnet MS/TP sensors',
        wpCategories: [
          'temperature-sensors',
          'humidity-sensors',
          'pressure-sensors'
        ],
        filters: {
          // Filter by products with BACnet in description/attributes
        }
      },
      
      'pneumatic-to-electronic': {
        name: 'Pneumatic-to-Electronic Conversions',
        slug: 'pneumatic-to-electronic',
        description: 'Replace pneumatic sensors with modern electronic equivalents',
        wpCategories: [
          'temperature-sensors',
          'pressure-sensors'
        ]
      },
      
      'direct-replacements': {
        name: 'Direct Mount Replacements',
        slug: 'direct-replacements',
        description: 'Drop-in replacements for existing sensor mounting patterns',
        wpCategories: [
          'room-sensors',
          'duct-sensors',
          'outside-air-sensors'
        ]
      }
    }
  },
  
  'installation-support': {
    name: 'Installation & Support',
    slug: 'installation-support',
    description: 'Mounting hardware, test equipment, and commissioning tools',
    icon: 'Wrench',
    subcategories: {
      'mounting-hardware': {
        name: 'Mounting Hardware & Accessories',
        slug: 'mounting-hardware',
        description: 'Mounting plates, brackets, enclosures, and installation accessories',
        wpCategories: [
          'accessories',
          'mounting-hardware'
        ]
      },
      
      'test-equipment': {
        name: 'Test Equipment & Commissioning',
        slug: 'test-equipment',
        description: 'Calibration tools, test instruments, and commissioning equipment',
        wpCategories: [
          'test-instruments',
          'calibration-tools'
        ]
      },
      
      'technical-resources': {
        name: 'Technical Resources',
        slug: 'technical-resources',
        description: 'Documentation, spec sheets, CAD files, and technical support',
        wpCategories: [] // Not product-based, content pages
      }
    }
  }
};

/**
 * Get all application category slugs (for routing)
 */
export function getApplicationCategorySlugs(): string[] {
  return Object.keys(applicationCategories);
}

/**
 * Get all subcategory slugs for a given application category
 */
export function getSubcategorySlugs(applicationSlug: string): string[] {
  const category = applicationCategories[applicationSlug];
  return category ? Object.keys(category.subcategories) : [];
}

/**
 * Get WordPress categories to query for a given application subcategory
 */
export function getWordPressCategoriesForApplication(
  applicationSlug: string,
  subcategorySlug: string
): string[] {
  const category = applicationCategories[applicationSlug];
  const subcategory = category?.subcategories[subcategorySlug];
  return subcategory?.wpCategories || [];
}

/**
 * Get filters to apply for a given application subcategory
 */
export function getFiltersForApplication(
  applicationSlug: string,
  subcategorySlug: string
): ApplicationSubcategory['filters'] {
  const category = applicationCategories[applicationSlug];
  const subcategory = category?.subcategories[subcategorySlug];
  return subcategory?.filters || {};
}

/**
 * Check if a product matches application filters
 * (This will be used when filtering products in the frontend)
 */
export function productMatchesApplicationFilters(
  product: any, // Replace with your Product type
  filters: ApplicationSubcategory['filters']
): boolean {
  if (!filters || Object.keys(filters).length === 0) {
    return true; // No filters = all products match
  }

  // TODO: Implement filtering logic based on product attributes/metadata
  // For now, return true (no filtering)
  return true;
}

/**
 * Get breadcrumb trail for virtual navigation
 */
export function getApplicationBreadcrumbs(
  applicationSlug: string,
  subcategorySlug?: string
): Array<{ name: string; href: string }> {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Applications', href: '/applications' }
  ];

  const category = applicationCategories[applicationSlug];
  if (category) {
    breadcrumbs.push({
      name: category.name,
      href: `/applications/${applicationSlug}`
    });

    if (subcategorySlug) {
      const subcategory = category.subcategories[subcategorySlug];
      if (subcategory) {
        breadcrumbs.push({
          name: subcategory.name,
          href: `/applications/${applicationSlug}/${subcategorySlug}`
        });
      }
    }
  }

  return breadcrumbs;
}
