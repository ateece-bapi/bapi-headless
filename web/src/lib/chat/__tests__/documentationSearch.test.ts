import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRequest, mockSearchPdfBody } = vi.hoisted(() => ({
  mockRequest: vi.fn(),
  mockSearchPdfBody: vi.fn((): unknown[] => []),
}));

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({ request: mockRequest })),
}));

vi.mock('@/lib/logger', () => ({
  default: { error: vi.fn() },
}));

vi.mock('../pdfBodySearch', () => ({
  searchPdfBody: mockSearchPdfBody,
}));

import { formatDocumentationForAI, searchDocumentation } from '../documentationSearch';

describe('chat documentation search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchPdfBody.mockReturnValue([]);
  });

  it('searches published application notes, pages, and PDF media', async () => {
    mockRequest.mockResolvedValue({
      applicationNotes: {
        nodes: [
          {
            id: 'note-1',
            title: 'Duct Sensor Installation',
            slug: 'duct-sensor-installation',
            content: '<p>Mount the probe downstream of the fan.</p>',
            excerpt: '<p>Installation guidance.</p>',
          },
        ],
      },
      pages: {
        nodes: [
          {
            id: 'page-1',
            title: 'Sensor Specifications',
            uri: '/sensor-specs/',
            content: '<p>Reference specifications.</p>',
          },
        ],
      },
      mediaItems: {
        nodes: [
          {
            id: 'pdf-1',
            title: 'Duct Sensor Instructions',
            description: 'Installation instructions',
            caption: null,
            mediaItemUrl: 'https://cms.example.com/duct-sensor-instructions.pdf',
          },
        ],
      },
    });

    const results = await searchDocumentation('duct sensor installation', 5, ['end-user']);

    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), {
      search: 'duct sensor installation',
      first: 5,
    });
    expect(results.map((result) => result.type)).toEqual(['application-note', 'page', 'pdf']);
    expect(results[0].url).toBe('/application-notes/duct-sensor-installation');
  });

  it('filters restricted PDF metadata by customer group', async () => {
    mockRequest.mockResolvedValue({
      applicationNotes: { nodes: [] },
      pages: { nodes: [] },
      mediaItems: {
        nodes: [
          {
            id: 'public-pdf',
            title: 'Public Instructions',
            mediaItemUrl: 'https://cms.example.com/public.pdf',
          },
          {
            id: 'alc-pdf',
            title: '(ALC) Restricted Instructions',
            mediaItemUrl: 'https://cms.example.com/alc.pdf',
          },
        ],
      },
    });

    const results = await searchDocumentation('instructions', 5, ['end-user']);

    expect(results.map((result) => result.id)).toEqual(['public-pdf']);
  });

  it('formats source content with citation-ready links', () => {
    const formatted = formatDocumentationForAI([
      {
        id: 'note-1',
        type: 'application-note',
        title: 'Duct Sensor Installation',
        url: '/application-notes/duct-sensor-installation',
        excerpt: 'Mount the probe downstream of the fan.',
      },
    ]);

    expect(formatted).toContain(
      '[Duct Sensor Installation](/application-notes/duct-sensor-installation)'
    );
    expect(formatted).toContain('Mount the probe downstream of the fan.');
  });

  it('returns bundled PDF results when WordPress search fails', async () => {
    const localResult = {
      id: 'local-page',
      type: 'pdf' as const,
      title: 'Local Instructions',
      url: 'https://cms.example.com/local.pdf#page=2',
      excerpt: 'Locally indexed instructions.',
      page: 2,
    };
    mockSearchPdfBody.mockReturnValue([localResult]);
    mockRequest.mockRejectedValue(new Error('WordPress unavailable'));

    await expect(searchDocumentation('local instructions')).resolves.toEqual([localResult]);
  });
});
