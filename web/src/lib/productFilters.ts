export const PRODUCT_FILTERS = {
  application: {
    title: 'Temperature Application',
    attributeNames: ['pa_application', 'pa-application'],
  },
  roomEnclosure: {
    title: 'Temperature Room Enclosure Style',
    attributeNames: ['pa_room_enclosure_style', 'pa_room-enclosure-style'],
  },
  sensorOutput: {
    title: 'Temperature Sensor/Output',
    attributeNames: ['pa_temperature_sensor_output', 'pa_temperature-sensor-output'],
  },
  display: {
    title: 'Display',
    attributeNames: ['pa_display', 'pa-display'],
  },
  setpointOverride: {
    title: 'Temperature Setpoint and Override',
    attributeNames: ['pa_temp_setpoint_and_override', 'pa_temp-setpoint-and-override'],
  },
  optionalTempHumidity: {
    title: 'Optional Temp & Humidity',
    attributeNames: ['pa_optional_temp_humidity', 'pa_optional-temp-humidity'],
  },
  optionalSensorOutput: {
    title: 'Optional Temp Sensor & Output',
    attributeNames: ['pa_optional_temp_sensor_output', 'pa_optional-temp-sensor-output'],
  },
  humidityApplication: {
    title: 'Humidity Application',
    attributeNames: ['pa_humidity_application', 'pa_humidity-application'],
  },
  humidityRoomEnclosure: {
    title: 'Humidity Room Enclosure',
    attributeNames: ['pa_humidity_room_enclosure', 'pa_humidity-room-enclosure'],
  },
  humiditySensorOutput: {
    title: 'Humidity Sensor Output',
    attributeNames: ['pa_humidity_sensor_output', 'pa_humidity-sensor-output'],
  },
  pressureApplication: {
    title: 'Pressure Application',
    attributeNames: ['pa_pressure_application', 'pa_pressure-application'],
  },
  pressureSensorStyle: {
    title: 'Pressure Sensor Style',
    attributeNames: ['pa_pressure_sensor_style', 'pa_pressure-sensor-style'],
  },
  airQualityApplication: {
    title: 'Air Quality Application',
    attributeNames: ['pa_air_quality_application', 'pa_air-quality-application'],
  },
  airQualitySensorType: {
    title: 'Air Quality Sensor Type',
    attributeNames: ['pa_air_quality_sensor_type', 'pa_air-quality-sensor-type'],
  },
  wirelessApplication: {
    title: 'Wireless Application',
    attributeNames: ['pa_wireless_application', 'pa_wireless-application'],
  },
} as const;

/** Supported URL keys for product attribute filters. */
export type ProductFilterKey = keyof typeof PRODUCT_FILTERS;

/** Filter keys in stable sidebar display order. */
export const PRODUCT_FILTER_KEYS = Object.keys(PRODUCT_FILTERS) as ProductFilterKey[];

/** Minimal GraphQL product shape required by product filters. */
export interface FilterableProduct {
  id: string;
  attributes?: {
    nodes?: Array<{
      name?: string | null;
      options?: Array<string | null | undefined> | null;
    } | null> | null;
  } | null;
}

/** Sidebar option derived from product attributes. */
export interface ProductFilterOption {
  slug: string;
  name: string;
  count: number;
  title: string;
}

/** Normalizes a WooCommerce attribute option for URL matching. */
export function slugifyProductAttribute(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Converts slug-shaped WordPress values into readable technical labels. */
export function formatProductAttributeLabel(value: string): string {
  if (/\s/.test(value) || value === value.toUpperCase()) return value;
  if (!value.includes('-')) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }

  const ranges: string[] = [];
  const withRangeTokens = value.replace(/\b\d+-\d+(?:ma|v)\b/gi, (range) => {
    ranges.push(range);
    return `rangevalue${ranges.length - 1}`;
  });

  const wordOverrides: Record<string, string> = {
    bapi: 'BAPI',
    hvac: 'HVAC',
    ma: 'mA',
    or: 'or',
    rtd: 'RTD',
    stat: 'Stat',
    temp: 'Temp',
    v: 'V',
  };

  return withRangeTokens
    .split('-')
    .map((word) => {
      const rangeMatch = word.match(/^rangevalue(\d+)$/);
      if (rangeMatch) {
        return ranges[Number(rangeMatch[1])]
          .replace(/ma$/i, 'mA')
          .replace(/v$/i, 'V');
      }

      return wordOverrides[word.toLowerCase()] || `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

/** Returns normalized values for one filter group on a product. */
export function getProductFilterValues(
  product: FilterableProduct,
  filterKey: ProductFilterKey
): string[] {
  const attributeNames = PRODUCT_FILTERS[filterKey].attributeNames as readonly string[];

  return (product.attributes?.nodes || [])
    .filter((attribute) => !!attribute?.name && attributeNames.includes(attribute.name))
    .flatMap((attribute) => attribute?.options || [])
    .filter((option): option is string => typeof option === 'string')
    .map(slugifyProductAttribute);
}

/** Builds sidebar options and counts from the loaded category products. */
export function extractProductFilterOptions(
  products: FilterableProduct[]
): Partial<Record<ProductFilterKey, ProductFilterOption[]>> {
  const counts = new Map<ProductFilterKey, Map<string, { name: string; count: number }>>();

  for (const product of products) {
    for (const filterKey of PRODUCT_FILTER_KEYS) {
      const values = getProductFilterValues(product, filterKey);
      if (values.length === 0) continue;

      const options = counts.get(filterKey) || new Map<string, { name: string; count: number }>();
      const attributeNames = PRODUCT_FILTERS[filterKey].attributeNames as readonly string[];
      const matchingAttributes = (product.attributes?.nodes || []).filter(
        (attribute) => !!attribute?.name && attributeNames.includes(attribute.name)
      );

      for (const attribute of matchingAttributes) {
        for (const option of attribute?.options || []) {
          if (!option) continue;
          const slug = slugifyProductAttribute(option);
          const current = options.get(slug);
          options.set(slug, {
            name: formatProductAttributeLabel(option),
            count: (current?.count || 0) + 1,
          });
        }
      }

      counts.set(filterKey, options);
    }
  }

  const result: Partial<Record<ProductFilterKey, ProductFilterOption[]>> = {};

  for (const filterKey of PRODUCT_FILTER_KEYS) {
    const options = counts.get(filterKey);
    if (!options) continue;

    result[filterKey] = Array.from(options, ([slug, option]) => ({
      slug,
      ...option,
      title: PRODUCT_FILTERS[filterKey].title,
    })).sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
  }

  return result;
}