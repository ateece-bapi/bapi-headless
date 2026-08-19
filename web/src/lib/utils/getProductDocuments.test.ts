import { describe, expect, it } from 'vitest';
import { getProductDocuments } from './getProductDocuments';

const affectedSlug =
  'outside-air-humidity-sensor-with-temperature-transmitter-40-to-140f-range';

describe('getProductDocuments', () => {
  it('returns the datasheet and instructions for the affected migrated product', () => {
    const documents = getProductDocuments(affectedSlug, []);

    expect(documents).toHaveLength(2);
    expect(documents.map((document) => document.category)).toEqual([
      'Datasheets',
      'Instructions',
    ]);
    expect(documents.every((document) => document.url.endsWith('.pdf'))).toBe(true);
  });

  it('prefers documents supplied by WordPress', () => {
    const cmsDocuments = [
      {
        title: 'Updated Datasheet',
        url: 'https://example.com/updated.pdf',
        category: 'Documents',
      },
    ];

    expect(getProductDocuments(affectedSlug, cmsDocuments)).toBe(cmsDocuments);
  });

  it('does not add documents to unrelated products', () => {
    expect(getProductDocuments('unrelated-product', [])).toEqual([]);
  });
});