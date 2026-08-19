type VariationAttributeOverrides = Record<string, Record<string, Record<string, string>>>;

const variationAttributeOverrides: VariationAttributeOverrides = {
  'carbon-monoxide-rough-service-with-optional-bacnet': {
    'BA/BBV-COV-H': {
      configuration: 'Rough Service CO Sensor with %RH Measurement and Flying Leads',
    },
    'BA/BBV-COV-H-TS': {
      configuration: 'Rough Service CO Sensor with %RH Measurement and Terminal Strip',
    },
  },
};

/** Return the source attribute value, falling back to a known catalog correction when blank. */
export function getVariationAttributeValue(
  productSlug: string | null | undefined,
  variationSku: string | null | undefined,
  attributeName: string,
  value: string | null | undefined
): string {
  if (value) {
    return value;
  }

  if (!productSlug || !variationSku) {
    return '';
  }

  return variationAttributeOverrides[productSlug]?.[variationSku]?.[attributeName.toLowerCase()] || '';
}