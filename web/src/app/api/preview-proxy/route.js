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

    const wpRes = await fetch(wpEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

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