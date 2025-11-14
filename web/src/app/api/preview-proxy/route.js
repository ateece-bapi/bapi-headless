// web/src/app/api/preview-proxy/route.js
import { NextResponse } from 'next/server';

/**
 * POST /api/preview-proxy
 * Body: { query: "...", variables: {...} }
 * Forwards the GraphQL request to WordPress and injects Basic Auth using
 * PREVIEW_USER / PREVIEW_APP_PASSWORD server-side env vars.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { query, variables } = body || {};

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const headers = { 'Content-Type': 'application/json' };
    const user = process.env.PREVIEW_USER;
    const pass = process.env.PREVIEW_APP_PASSWORD;

    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const wpRes = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const data = await wpRes.json();
    return NextResponse.json(data, { status: wpRes.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}