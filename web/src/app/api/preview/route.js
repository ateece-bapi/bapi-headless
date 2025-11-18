import crypto from 'crypto';
import { NextResponse } from 'next/server';

function safeCompare(a = '', b = '') {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Pad the shorter buffer to match lengths to avoid leaking length via timing
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

export async function GET(request) {
  // Do not log secret values. Log only whether preview is enabled.
  const previewEnabled = !!process.env.PREVIEW_SECRET;
  console.log('preview GET - previewEnabled=', previewEnabled);

  if (!previewEnabled) {
    return new NextResponse('Preview functionality is disabled on this environment', { status: 503 });
  }

  const url = new URL(request.url);
  // Accept the secret via query param `secret` or header `x-preview-secret`.
  const secretFromQuery = url.searchParams.get('secret');
  const secretFromHeader = request.headers.get('x-preview-secret');
  const provided = secretFromHeader || secretFromQuery;
  const slugParam = url.searchParams.get('slug') || '/';

  if (!provided || !safeCompare(provided, process.env.PREVIEW_SECRET)) {
    return new NextResponse('Invalid or missing preview secret', { status: 401 });
  }

  // Sanitize slugParam: avoid CRLF and ensure it's a valid path
  const sanitizedSlug = slugParam.replace(/(\r|\n)/g, '');

  // Ensure redirect uses an absolute URL. Build from the incoming request URL.
  const redirectUrl = new URL(sanitizedSlug, request.url);
  const res = NextResponse.redirect(redirectUrl.toString());
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('__prerender_bypass', '1', { httpOnly: true, path: '/', secure });
  res.cookies.set('__next_preview_data', '1', { httpOnly: true, path: '/', secure });
  return res;
}