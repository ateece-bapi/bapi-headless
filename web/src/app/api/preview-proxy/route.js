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
  const upstream = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  if (!upstream) return NextResponse.json({ error: 'No upstream configured' }, { status: 503 });

  if (!process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Preview disabled on this server (no PREVIEW_SECRET)' }, { status: 503 });
  }

  const providedSecret = request.headers.get('x-preview-secret') || '';
  if (!safeCompare(providedSecret, process.env.PREVIEW_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.text();
  const headers = {};
  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) headers['content-type'] = incomingContentType;

  if (process.env.PREVIEW_USER && process.env.PREVIEW_APP_PASSWORD) {
    const creds = Buffer.from(`${process.env.PREVIEW_USER}:${process.env.PREVIEW_APP_PASSWORD}`).toString('base64');
    headers['authorization'] = `Basic ${creds}`;
  }

  const fetchOptions = { method: 'POST', headers, body };

  try {
    if (process.env.PREVIEW_CA_PATH) {
      const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH, 'utf8');
      fetchOptions.agent = new https.Agent({ ca, rejectUnauthorized: !(process.env.PREVIEW_ALLOW_INSECURE === '1') });
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
      const upstream = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
      if (!upstream) return NextResponse.json({ error: 'No upstream configured' }, { status: 503 });

      if (!process.env.PREVIEW_SECRET) {
        return NextResponse.json({ error: 'Preview disabled on this server (no PREVIEW_SECRET)' }, { status: 503 });
      }

      const providedSecret = request.headers.get('x-preview-secret') || '';
      if (!safeCompare(providedSecret, process.env.PREVIEW_SECRET)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.text();
      const headers = {};
      const incomingContentType = request.headers.get('content-type');
      if (incomingContentType) headers['content-type'] = incomingContentType;

      if (process.env.PREVIEW_USER && process.env.PREVIEW_APP_PASSWORD) {
        const creds = Buffer.from(`${process.env.PREVIEW_USER}:${process.env.PREVIEW_APP_PASSWORD}`).toString('base64');
        headers['authorization'] = `Basic ${creds}`;
      }

      const fetchOptions = { method: 'POST', headers, body };

      try {
        if (process.env.PREVIEW_CA_PATH) {
          const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH, 'utf8');
          fetchOptions.agent = new https.Agent({ ca, rejectUnauthorized: !(process.env.PREVIEW_ALLOW_INSECURE === '1') });
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
          const upstream = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
          if (!upstream) return NextResponse.json({ error: 'No upstream configured' }, { status: 503 });

          if (!process.env.PREVIEW_SECRET) {
            return NextResponse.json({ error: 'Preview disabled on this server (no PREVIEW_SECRET)' }, { status: 503 });
          }

          const providedSecret = request.headers.get('x-preview-secret') || '';
          if (!safeCompare(providedSecret, process.env.PREVIEW_SECRET)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

          const body = await request.text();
          const headers = {};
          const incomingContentType = request.headers.get('content-type');
          if (incomingContentType) headers['content-type'] = incomingContentType;

          if (process.env.PREVIEW_USER && process.env.PREVIEW_APP_PASSWORD) {
            const creds = Buffer.from(`${process.env.PREVIEW_USER}:${process.env.PREVIEW_APP_PASSWORD}`).toString('base64');
            headers['authorization'] = `Basic ${creds}`;
          }

          const fetchOptions = { method: 'POST', headers, body };

          try {
            if (process.env.PREVIEW_CA_PATH) {
              const ca = fs.readFileSync(process.env.PREVIEW_CA_PATH, 'utf8');
              fetchOptions.agent = new https.Agent({ ca, rejectUnauthorized: !(process.env.PREVIEW_ALLOW_INSECURE === '1') });
            } else if (process.env.PREVIEW_ALLOW_INSECURE === '1') {
              fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
            }
          } catch (err) {
            console.error('Failed to configure TLS for preview proxy:', err);
            return NextResponse.json({ error: 'Failed to configure TLS' }, { status: 500 });
          }

          try {
            const upstreamRes = await fetch(upstream, fetchOptions);
            const text = await upstreamRes.text();
            const resHeaders = {};
            upstreamRes.headers.forEach((v, k) => (resHeaders[k] = v));
            return new NextResponse(text, { status: upstreamRes.status, headers: resHeaders });
          } catch (err) {
            console.error('Preview proxy upstream fetch failed:', err);
            return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 });
          }
        }
