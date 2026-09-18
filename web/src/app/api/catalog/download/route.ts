const CATALOG_FILENAMES = {
  standard: 'BAPI_Catalog_2026_Full_Web.pdf',
  metric: 'BAPI_Metric_Catalog_2026.pdf',
} as const;

type CatalogVariant = keyof typeof CATALOG_FILENAMES;

/** Narrows a query string value to a supported catalog variant. */
function isCatalogVariant(value: string | null): value is CatalogVariant {
  return value === 'standard' || value === 'metric';
}


/** Proxies the current catalog through the app so browsers reliably download it. */
export async function GET(request: Request): Promise<Response> {
  const requestedVariant = new URL(request.url).searchParams.get('variant');
  const variant = isCatalogVariant(requestedVariant) ? requestedVariant : 'standard';
  const catalogFilename = CATALOG_FILENAMES[variant];

  const wordpressGraphqlUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL ??
    'https://bapiheadlessstaging.kinsta.cloud/graphql';
  const wordpressUrl = wordpressGraphqlUrl.replace(/\/graphql\/?$/, '');
  const catalogUrl = `${wordpressUrl}/wp-content/uploads/${catalogFilename}`;
  const upstreamResponse = await fetch(catalogUrl, { cache: 'no-store' });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response('Catalog download is temporarily unavailable.', { status: 502 });
  }

  return new Response(upstreamResponse.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${catalogFilename}"`,
      'Content-Length': upstreamResponse.headers.get('content-length') ?? '',
      'Content-Type': 'application/pdf',
    },
  });
}