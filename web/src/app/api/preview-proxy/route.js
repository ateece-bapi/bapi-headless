// Temporary debug proxy - logs request body, env presence, and upstream status.
// Remove or revert this file after debugging.

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const raw = await request.text();
    let body;
    try {
      body = JSON.parse(raw || '{}');
    } catch (e) {
      console.error('preview-proxy: invalid JSON body', { error: String(e), raw });
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { query, variables } = body || {};
    if (!query) {
      console.error('preview-proxy: missing query in body', { body });
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const headers = { 'Content-Type': 'application/json' };
    const user = process.env.PREVIEW_USER;
    const pass = process.env.PREVIEW_APP_PASSWORD;
    const wpEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    // Debug logs (do NOT log secret values)
    console.log('preview-proxy: PREVIEW_USER present?', !!user, 'PREVIEW_APP_PASSWORD present?', !!pass);
    console.log('preview-proxy: NEXT_PUBLIC_WORDPRESS_GRAPHQL =', wpEndpoint);

    if (!wpEndpoint) {
      console.error('preview-proxy: missing NEXT_PUBLIC_WORDPRESS_GRAPHQL env var');
      return NextResponse.json({ error: 'Missing WP endpoint env' }, { status: 500 });
    }

    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
      console.log('preview-proxy: Authorization header will be set for upstream request');
    } else {
      console.warn('preview-proxy: missing PREVIEW_USER or PREVIEW_APP_PASSWORD env vars');
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
    } catch (e) {
      json = { raw: textRes };
    }

    console.log('preview-proxy: upstream status', status);
    return NextResponse.json(json, { status });
  } catch (err) {
    console.error('preview-proxy: caught', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}