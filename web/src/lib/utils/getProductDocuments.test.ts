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

  it('separates the Room Pressure Pickup Ports submittal datasheet', () => {
    const documents = getProductDocuments('room-pressure-pickup-ports', [
      {
        title: 'Zone Pressure Pickup Ports, Datasheet with Pricing',
        url: 'https://example.com/pricing.pdf',
        category: 'Datasheet with Pricing',
      },
      {
        title: 'Zone Pressure Pickup Ports, Datasheet for Submittal',
        url: 'https://example.com/submittal.pdf',
        category: 'Datasheet with Pricing',
      },
    ]);

    expect(documents.map((document) => document.category)).toEqual([
      'Datasheet with Pricing',
      'Datasheet for Submittal',
    ]);
  });

  it('ignores document titles inherited from the override object prototype', () => {
    const cmsDocument = {
      title: 'toString',
      url: 'https://example.com/document.pdf',
      category: 'Documents',
    };

    expect(getProductDocuments('room-pressure-pickup-ports', [cmsDocument])).toEqual([
      cmsDocument,
    ]);
  });

  it('does not add documents to unrelated products', () => {
    expect(getProductDocuments('unrelated-product', [])).toEqual([]);
  });
});