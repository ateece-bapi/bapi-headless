import crypto from 'crypto';
import { NextResponse } from 'next/server';
import logger from '../../../lib/logger.js';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit.ts';
import { RATE_LIMITS } from '../../../lib/constants/rate-limits.ts';

function safeCompare(a = '', b = '') {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');

  if (bufA.length !== bufB.length) {
    return false; // Fast-fail is OK for different lengths
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(clientIP, RATE_LIMITS.PREVIEW_API);

  if (!rateLimitResult.success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'You have made too many preview requests. Please wait a moment and try again.',
        retryAfter: Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
          'Retry-After': String(Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)),
        },
      }
    );
  }

  // DEBUG only: log presence/length, do NOT log secret value
  logger.debug('preview.secret_presence', {
    present: !!process.env.PREVIEW_SECRET,
    length: process.env.PREVIEW_SECRET?.length ?? 0,
  });

  const url = new URL(request.url);
  // Support secret via query param `secret` or header `x-preview-secret`.
  const querySecret = url.searchParams.get('secret') || '';
  const headerSecret = request.headers.get('x-preview-secret') || '';
  const provided = headerSecret || querySecret;

  const slugParam = url.searchParams.get('slug') || '/';

  // If PREVIEW_SECRET is not configured, preview functionality is disabled.
  if (!process.env.PREVIEW_SECRET) {
    return new NextResponse(
      JSON.stringify({
        error: 'Service Unavailable',
        message: 'Preview functionality is currently disabled.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (!provided || !safeCompare(provided, process.env.PREVIEW_SECRET || '')) {
    return new NextResponse(
      JSON.stringify({
        error: 'Unauthorized',
        message: 'Invalid or missing preview secret. Please check your preview URL.',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Ensure redirect uses an absolute URL. Build from the incoming request URL.
  const redirectUrl = new URL(slugParam, request.url);
  const res = NextResponse.redirect(redirectUrl.toString());
  res.cookies.set('__prerender_bypass', '1', { httpOnly: true, path: '/' });
  res.cookies.set('__next_preview_data', '1', { httpOnly: true, path: '/' });
  return res;
}
