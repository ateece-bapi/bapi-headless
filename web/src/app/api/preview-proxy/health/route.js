import fs from 'fs';
import https from 'https';
import { NextResponse } from 'next/server';

function createAgent() {
  // Prefer an explicit CA file for local dev (mkcert)
  if (process.env.PREVIEW_CA_PATH) {
    try {
      const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH);
      return new https.Agent({ ca });
    } catch (e) {
      // fall through to other options
      console.warn('preview-proxy/health: failed to load PREVIEW_CA_PATH', e?.message ?? e);
    }
  }

  // Opt-in insecure mode for local development only
  if (process.env.PREVIEW_ALLOW_INSECURE === 'true' && process.env.NODE_ENV !== 'production') {
    return new https.Agent({ rejectUnauthorized: false });
  }

  return undefined;
}

export async function GET() {
  const wpEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  if (!wpEndpoint) {
    return NextResponse.json(
      { ok: false, error: 'Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL' },
      { status: 503 }
    );
  }

  const agent = createAgent();

  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ __typename }' }),
  };
  if (agent) fetchOptions.agent = agent;

  try {
    const res = await fetch(wpEndpoint, fetchOptions);
    if (res.ok) {
      return NextResponse.json({ ok: true, upstream: wpEndpoint }, { status: 200 });
    }
    const text = await res.text();
    return NextResponse.json(
      { ok: false, upstream: wpEndpoint, status: res.status, body: text },
      { status: 502 }
    );
  } catch (err) {
    const message = String(err?.message || err);
    // Provide a friendly hint for local mkcert/TLS issues without exposing secrets
    if (
      message.includes('unable to verify the first certificate') ||
      message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Upstream TLS verification failed. Consider setting PREVIEW_CA_PATH or PREVIEW_ALLOW_INSECURE for local dev.',
        },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { ok: false, error: 'Upstream fetch failed', message },
      { status: 502 }
    );
  }
}
