/**
 * /api/catalog/download route tests
 *
 * Covers:
 * - Serves the standard catalog by default (no variant param)
 * - Serves the metric catalog when ?variant=metric is passed
 * - Falls back to the standard catalog for an unsupported variant value
 * - Returns a 502 when the upstream fetch fails
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { GET } from '../route';

const WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL ?? 'https://bapiheadlessstaging.kinsta.cloud/graphql'
).replace(/\/graphql\/?$/, '');

function makeRequest(query = '') {
  return new Request(`http://localhost/api/catalog/download${query}`);
}

describe('GET /api/catalog/download', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('serves the standard catalog when no variant is given', async () => {
    fetchMock.mockResolvedValue(
      new Response(new Blob(['pdf']), { headers: { 'content-length': '3' } })
    );

    const res = await GET(makeRequest());

    expect(fetchMock).toHaveBeenCalledWith(
      `${WORDPRESS_URL}/wp-content/uploads/BAPI_Catalog_2026_Full_Web.pdf`,
      { cache: 'no-store' }
    );
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="BAPI_Catalog_2026_Full_Web.pdf"'
    );
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
  });

  it('serves the metric catalog when ?variant=metric is given', async () => {
    fetchMock.mockResolvedValue(
      new Response(new Blob(['pdf']), { headers: { 'content-length': '3' } })
    );

    const res = await GET(makeRequest('?variant=metric'));

    expect(fetchMock).toHaveBeenCalledWith(
      `${WORDPRESS_URL}/wp-content/uploads/BAPI_Metric_Catalog_2026.pdf`,
      { cache: 'no-store' }
    );
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="BAPI_Metric_Catalog_2026.pdf"'
    );
  });

  it('falls back to the standard catalog for an unsupported variant', async () => {
    fetchMock.mockResolvedValue(
      new Response(new Blob(['pdf']), { headers: { 'content-length': '3' } })
    );

    const res = await GET(makeRequest('?variant=unsupported'));

    expect(fetchMock).toHaveBeenCalledWith(
      `${WORDPRESS_URL}/wp-content/uploads/BAPI_Catalog_2026_Full_Web.pdf`,
      { cache: 'no-store' }
    );
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="BAPI_Catalog_2026_Full_Web.pdf"'
    );
  });

  it('returns a 502 when the upstream fetch fails', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

    const res = await GET(makeRequest());

    expect(res.status).toBe(502);
  });
});
