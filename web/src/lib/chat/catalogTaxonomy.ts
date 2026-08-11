export interface UnavailableCatalogProduct {
  id: string;
  label: string;
  patterns: RegExp[];
}

const UNAVAILABLE_CATALOG_PRODUCTS: UnavailableCatalogProduct[] = [
  {
    id: 'current-sensors',
    label: 'electrical current sensors',
    patterns: [
      /\bcurrent\s+(?:sensor|switch|transducer)s?\b/i,
      /\belectrical\s+current\s+(?:sensor|switch|transducer)s?\b/i,
    ],
  },
];

/** Finds product families known to be absent from BAPI's current public catalog. */
export function findUnavailableCatalogProducts(query: string): UnavailableCatalogProduct[] {
  return UNAVAILABLE_CATALOG_PRODUCTS.filter((product) =>
    product.patterns.some((pattern) => pattern.test(query))
  );
}

/** Formats an authoritative response for unavailable product families. */
export function formatUnavailableCatalogProducts(products: UnavailableCatalogProduct[]): string {
  const labels = products.map((product) => product.label);
  const formattedLabels =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1]}`;

  return `AUTHORITATIVE CATALOG AVAILABILITY: BAPI does not currently list ${formattedLabels} in its public catalog. Do not recommend models or claim availability for these product families. State that they are not currently available and offer technical support for alternatives.`;
}
