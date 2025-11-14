<<<<<<< HEAD
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

function safeCompare(a = '', b = '') {
  try {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch (e) {
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

    const fetchOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    };

    if (process.env.PREVIEW_CA_PATH) {
      try {
        const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH);
        fetchOptions.agent = new https.Agent({ ca });
        console.log('preview-proxy: using PREVIEW_CA_PATH for upstream TLS verification');
      } catch (e) {
        console.warn('preview-proxy: failed to use PREVIEW_CA_PATH, falling back to default CA behavior', e?.message ?? e);
      }
    }

    if (!fetchOptions.agent && process.env.PREVIEW_ALLOW_INSECURE === 'true' && process.env.NODE_ENV !== 'production') {
      try {
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
      const name = fetchErr?.name || 'Error';
      const code = fetchErr?.code || null;
      const message = String(fetchErr?.message || fetchErr);
      console.error('preview-proxy: upstream fetch failed', { name, code, message });
      if (fetchErr?.stack) console.error(fetchErr.stack);

      if (message.includes('unable to verify the first certificate') || message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')) {
        return NextResponse.json({ error: 'Upstream TLS verification failed. If this is a local DDEV site with mkcert, either trust the mkcert CA system-wide or set PREVIEW_ALLOW_INSECURE=true for local development.' }, { status: 502 });
      }

      return NextResponse.json({ error: 'Upstream fetch failed', name, code, message }, { status: 502 });
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
=======
[PASTE THE CONTENTS OF web/src/app/api/preview-proxy/route.js HERE]
>>>>>>> 808c9fa (feat(api): add app-router preview route and server-side preview proxy)
