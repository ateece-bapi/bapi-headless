export type ProductDocumentLink = {
  title: string;
  url: string;
  category?: string;
};

const DOCUMENTS_BY_PRODUCT_SLUG: Readonly<Record<string, readonly ProductDocumentLink[]>> = {
  'outside-air-humidity-sensor-with-temperature-transmitter-40-to-140f-range': [
    {
      title: 'Outside Air Humidity Datasheet for Submittal',
      url: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/Outside_Air_humid_NoPrice-v17.pdf',
      category: 'Datasheets',
    },
    {
      title:
        'Instructions for Duct or Outside Air Humidity Units (for all units except those with a BAPI-Box Crossover)',
      url: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/49483_ins_duct_OSA_humidity.pdf',
      category: 'Instructions',
    },
  ],
};

/** Return CMS documents, falling back to known links for incomplete migrated products. */
export function getProductDocuments(
  slug: string | null | undefined,
  documents: ProductDocumentLink[]
): ProductDocumentLink[] {
  if (documents.length > 0 || !slug) return documents;

  return [...(DOCUMENTS_BY_PRODUCT_SLUG[slug.toLowerCase()] || [])];
}