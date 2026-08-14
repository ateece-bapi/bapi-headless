const CATALOG_FILENAME = 'BAPI_Catalog_2026_Full_Web.pdf';

/** Proxies the current catalog through the app so browsers reliably download it. */
export async function GET(): Promise<Response> {
  const wordpressGraphqlUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL ??
    'https://bapiheadlessstaging.kinsta.cloud/graphql';
  const wordpressUrl = wordpressGraphqlUrl.replace(/\/graphql\/?$/, '');
  const catalogUrl = `${wordpressUrl}/wp-content/uploads/${CATALOG_FILENAME}`;
  const upstreamResponse = await fetch(catalogUrl, { cache: 'no-store' });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response('Catalog download is temporarily unavailable.', { status: 502 });
  }

  return new Response(upstreamResponse.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${CATALOG_FILENAME}"`,
      'Content-Length': upstreamResponse.headers.get('content-length') ?? '',
      'Content-Type': 'application/pdf',
    },
  });
}