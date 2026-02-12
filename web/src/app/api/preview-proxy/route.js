import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import logger from '../../../lib/logger.js';

function safeCompare(a = '', b = '') {
  try {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const previewEnabled = !!process.env.PREVIEW_SECRET;
    logger.info('preview-proxy.post_start', { previewEnabled });
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
      logger.warn('preview-proxy.invalid_json', { error: String(e) });
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { query, variables } = body || {};
    if (!query) {
      logger.warn('preview-proxy.missing_query');
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const headers = { 'Content-Type': 'application/json' };
    const user = process.env.PREVIEW_USER;
    const pass = process.env.PREVIEW_APP_PASSWORD;
    const wpEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    if (!wpEndpoint) {
      logger.error('preview-proxy.missing_wp_endpoint');
      return NextResponse.json({ error: 'Missing WP endpoint env' }, { status: 500 });
    }

    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
      logger.info('preview-proxy.upstream_auth_set');
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
        logger.info('preview-proxy.using_preview_ca_path');
      } catch (e) {
        logger.warn('preview-proxy.failed_use_preview_ca', { err: e?.message ?? String(e) });
      }
    }

    if (
      !fetchOptions.agent &&
      process.env.PREVIEW_ALLOW_INSECURE === 'true' &&
      process.env.NODE_ENV !== 'production'
    ) {
      try {
        fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
        logger.warn('preview-proxy.preview_allow_insecure');
      } catch {
        // ignore and continue without custom agent
      }
    }

    let wpRes;
    // Attach AbortController to upstream fetch so we can timeout hung requests.
    const controller = new AbortController();
    const timeoutMs = Number(process.env.PREVIEW_FETCH_TIMEOUT_MS || '10000');
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    fetchOptions.signal = controller.signal;
    const start = Date.now();

    try {
      wpRes = await fetch(wpEndpoint, fetchOptions);
    } catch (fetchErr) {
      const name = fetchErr?.name || 'Error';
      const code = fetchErr?.code || null;
      const message = String(fetchErr?.message || fetchErr);
      logger.error('preview-proxy.upstream_fetch_failed', { name, code, message });
      if (fetchErr?.stack)
        logger.error('preview-proxy.upstream_fetch_stack', { stack: fetchErr.stack });

      // Recognize aborts as timeouts and return a 502 with a clear message.
      if (
        name === 'AbortError' ||
        message.toLowerCase().includes('aborted') ||
        message.toLowerCase().includes('abort')
      ) {
        logger.warn('preview-proxy.upstream_timeout');
        return NextResponse.json({ error: 'Upstream fetch timed out' }, { status: 502 });
      }

      if (
        message.includes('unable to verify the first certificate') ||
        message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')
      ) {
        return NextResponse.json(
          {
            error:
              'Upstream TLS verification failed. If this is a local DDEV site with mkcert, either trust the mkcert CA system-wide or set PREVIEW_ALLOW_INSECURE=true for local development.',
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: 'Upstream fetch failed', name, code, message },
        { status: 502 }
      );
    }

    // clear the timeout if fetch succeeded
    clearTimeout(timeoutId);

    const status = wpRes.status;
    const textRes = await wpRes.text();
    const duration = Date.now() - start;

    // If upstream returned a non-2xx, do not forward upstream body or status
    // verbatim. Normalize to 502 to present a consistent contract to callers
    // and avoid leaking upstream internals.
    if (!wpRes.ok) {
      logger.warn('preview-proxy.upstream_non_2xx', { status });
      logger.metric('preview-proxy.upstream.duration_ms', duration, { status });
      return NextResponse.json(
        { error: 'Upstream returned non-2xx', upstreamStatus: status },
        { status: 502 }
      );
    }

    let json;
    try {
      json = JSON.parse(textRes);
    } catch {
      json = { raw: textRes };
    }

    logger.metric('preview-proxy.upstream.duration_ms', duration, { status });
    return NextResponse.json(json, { status });
  } catch (err) {
    logger.error('preview-proxy.caught', { error: String(err) });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
