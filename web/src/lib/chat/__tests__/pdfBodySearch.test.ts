import { describe, expect, it } from 'vitest';
import { searchPdfIndex, type PdfTextIndex } from '../pdfBodySearch';

const index: PdfTextIndex = {
  version: 1,
  generatedAt: '2026-08-11T00:00:00.000Z',
  source: 'test',
  documents: [
    {
      id: 'public-1-page-2',
      documentId: 'public-1',
      title: 'BA/10K-2 Duct Sensor Installation Instructions',
      url: 'https://cms.example.com/duct-sensor.pdf',
      page: 2,
      text: 'Mount the averaging probe downstream of the fan and upstream of the filter.',
      accessGroup: null,
      checksum: 'public-checksum',
    },
    {
      id: 'alc-1-page-1',
      documentId: 'alc-1',
      title: '(ALC) Controller Installation Instructions',
      url: 'https://cms.example.com/alc-controller.pdf',
      page: 1,
      text: 'Restricted ALC controller wiring instructions.',
      accessGroup: 'alc',
      checksum: 'alc-checksum',
    },
  ],
};

describe('PDF body search', () => {
  it('returns page-level excerpts and citations for exact model searches', () => {
    const results = searchPdfIndex('BA/10K-2', index, 5, ['end-user']);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      type: 'pdf',
      title: 'BA/10K-2 Duct Sensor Installation Instructions',
      url: 'https://cms.example.com/duct-sensor.pdf#page=2',
      page: 2,
    });
    expect(results[0].excerpt).toContain('downstream of the fan');
  });

  it('excludes restricted documents for guests', () => {
    expect(searchPdfIndex('controller wiring', index, 5, ['end-user'])).toEqual([]);
  });

  it('includes restricted documents for matching customer groups', () => {
    const results = searchPdfIndex('controller wiring', index, 5, ['alc']);

    expect(results[0].url).toBe('https://cms.example.com/alc-controller.pdf#page=1');
  });
});