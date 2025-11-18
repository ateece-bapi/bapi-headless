import { NextResponse } from 'next/server';

// Health endpoint for preview-proxy. Verifies the configured WordPress GraphQL
// endpoint is defined and reachable using the same TLS handling as the proxy.
export async function GET() {
  const wpEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  if (!wpEndpoint) {
    return NextResponse.json({ ok: false, error: 'Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL env var' }, { status: 500 });
  }

  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{__typename}' }),
  };

  // Try to configure a custom CA if provided (PREVIEW_CA_PATH), otherwise allow
  // an explicit dev-only insecure option (PREVIEW_ALLOW_INSECURE).
  try {
    if (process.env.PREVIEW_CA_PATH) {
      const https = await import('https');
      const fs = await import('fs');
      const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH);
      fetchOptions.agent = new https.Agent({ ca });
    } else if (process.env.PREVIEW_ALLOW_INSECURE === 'true' && process.env.NODE_ENV !== 'production') {
      const https = await import('https');
      fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
    }
  } catch (err) {
    // Don't fail the health check just because the agent construction failed -
    // report the error and proceed with default system CA behaviour.
    console.warn('preview-proxy/health: failed to configure TLS agent', err?.message || err);
  }

  try {
    const res = await fetch(wpEndpoint, fetchOptions);
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }

    return NextResponse.json({ ok: res.ok, status: res.status, upstream: body }, { status: res.ok ? 200 : 502 });
  } catch (err) {
    console.error('preview-proxy/health: upstream fetch failed', err?.name || '', err?.message || err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 502 });
  }
}
