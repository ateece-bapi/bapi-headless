// Preview proxy: forwards GraphQL requests to WordPress endpoint for previewing.
// Security: requires the preview secret be present in header `x-preview-secret`.

import crypto from 'crypto';
import { NextResponse } from 'next/server';

function safeCompare(a = '', b = '') {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      const max = Math.max(bufA.length, bufB.length);
      const pa = Buffer.alloc(max);
      const pb = Buffer.alloc(max);
      bufA.copy(pa);
      bufB.copy(pb);
      return crypto.timingSafeEqual(pa, pb);
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const previewEnabled = !!process.env.PREVIEW_SECRET;
    console.log('preview-proxy POST - previewEnabled=', previewEnabled);
    if (!previewEnabled) return NextResponse.json({ error: 'Preview disabled' }, { status: 503 });

    const provided = request.headers.get('x-preview-secret');
    if (!provided || !safeCompare(provided, process.env.PREVIEW_SECRET)) {
      return NextResponse.json({ error: 'Invalid or missing preview secret' }, { status: 401 });
    }

    const raw = await request.text();
    let body;
    try {
      body = JSON.parse(raw || '{}');
    } catch (e) {
      console.error('preview-proxy: invalid JSON body', { error: String(e) });
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { query, variables } = body || {};
    if (!query) {
      console.error('preview-proxy: missing query in body');
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const headers = { 'Content-Type': 'application/json' };
    const user = process.env.PREVIEW_USER;
    const pass = process.env.PREVIEW_APP_PASSWORD;
    const wpEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    if (!wpEndpoint) {
      console.error('preview-proxy: missing NEXT_PUBLIC_WORDPRESS_GRAPHQL env var');
      return NextResponse.json({ error: 'Missing WP endpoint env' }, { status: 500 });
    }

    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
      console.log('preview-proxy: upstream Authorization will be sent');
    }

    // Configure fetch agent for local development if explicitly allowed.
    // DO NOT enable insecure fetch in production.
    const fetchOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    };

    // If PREVIEW_ALLOW_INSECURE is set to 'true' and we're not in production,
    // allow skipping TLS verification for local mkcert/DDEV setups.
    // If a CA path is provided, use it to verify the upstream TLS certificate.
    // This allows using the mkcert root CA without disabling verification.
    if (process.env.PREVIEW_CA_PATH) {
      try {
        const https = await import('https');
        const fs = await import('fs');
        const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH);
        fetchOptions.agent = new https.Agent({ ca });
        console.log('preview-proxy: using PREVIEW_CA_PATH for upstream TLS verification');
      } catch (e) {
        console.warn('preview-proxy: failed to use PREVIEW_CA_PATH, falling back to default CA behavior', e?.message ?? e);
      }
    }

    // If PREVIEW_ALLOW_INSECURE is explicitly enabled (dev only), allow skipping TLS
    // verification. This is a fallback convenience for local debugging only.
    if (!fetchOptions.agent && process.env.PREVIEW_ALLOW_INSECURE === 'true' && process.env.NODE_ENV !== 'production') {
      try {
        const https = await import('https');
        fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
        console.warn('preview-proxy: PREVIEW_ALLOW_INSECURE=true, skipping TLS verification for upstream (dev only)');
      } catch {
        // ignore and continue without custom agent
      }
    }

    let wpRes;
    try {
      wpRes = await fetch(wpEndpoint, fetchOptions);
    } catch (fetchErr) {
      // Provide a clearer, non-secret diagnostic for TLS/network failures.
      const msg = String(fetchErr?.message || fetchErr);
      console.error('preview-proxy: upstream fetch failed', { message: msg });
      if (msg.includes('unable to verify the first certificate') || msg.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')) {
        return NextResponse.json({ error: 'Upstream TLS verification failed. If this is a local DDEV site with mkcert, either trust the mkcert CA system-wide or set PREVIEW_ALLOW_INSECURE=true for local development.' }, { status: 502 });
      }
      return NextResponse.json({ error: 'Upstream fetch failed', details: msg }, { status: 502 });
    }

    const status = wpRes.status;
    const textRes = await wpRes.text();
    let json;
    try {
      json = JSON.parse(textRes);
    } catch {
      json = { raw: textRes };
    }

    return NextResponse.json(json, { status });
  } catch (err) {
    console.error('preview-proxy: caught', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}