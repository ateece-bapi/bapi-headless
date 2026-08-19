import { afterEach, describe, expect, it, vi } from 'vitest';
import { getProductDocuments } from './getProductDocuments';

const affectedSlug =
  'outside-air-humidity-sensor-with-temperature-transmitter-40-to-140f-range';

describe('getProductDocuments', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the datasheet and instructions for the affected migrated product', () => {
    vi.stubEnv('NEXT_PUBLIC_WORDPRESS_GRAPHQL', 'https://cms.example.com/graphql/');

    const documents = getProductDocuments(affectedSlug, []);

    expect(documents).toHaveLength(2);
    expect(documents.map((document) => document.category)).toEqual([
      'Datasheets',
      'Instructions',
    ]);
    expect(documents.every((document) => document.url.startsWith('https://cms.example.com/'))).toBe(
      true
    );
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