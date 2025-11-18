<<<<<<< HEAD
import crypto from 'crypto';
import { NextResponse } from 'next/server';

function safeCompare(a = '', b = '') {
  try {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    // If lengths differ, compare against equal-length buffers to avoid timing leaks
    if (ab.length !== bb.length) {
      const max = Math.max(ab.length, bb.length);
      const pa = Buffer.alloc(max);
      const pb = Buffer.alloc(max);
      ab.copy(pa);
      bb.copy(pb);
      return crypto.timingSafeEqual(pa, pb);
    }
    return crypto.timingSafeEqual(ab, bb);
  } catch (e) {
    return false;
  }
}

export async function GET(request) {
  // DEBUG only: log presence/length, do NOT log secret value
  console.log('PREVIEW_SECRET present?', !!process.env.PREVIEW_SECRET, 'length=', process.env.PREVIEW_SECRET?.length ?? 0);

  const url = new URL(request.url);
  // Support secret via query param `secret` or header `x-preview-secret`.
  const querySecret = url.searchParams.get('secret') || '';
  const headerSecret = request.headers.get('x-preview-secret') || '';
  const provided = headerSecret || querySecret;

  const slugParam = url.searchParams.get('slug') || '/';

  // If PREVIEW_SECRET is not configured, preview functionality is disabled.
  if (!process.env.PREVIEW_SECRET) {
    return new NextResponse('Preview functionality is disabled on this server (no PREVIEW_SECRET)', { status: 503 });
  }

  if (!provided || !safeCompare(provided, process.env.PREVIEW_SECRET || '')) {
    return new NextResponse('Invalid or missing preview secret', { status: 401 });
  }

  // Ensure redirect uses an absolute URL. Build from the incoming request URL.
  const redirectUrl = new URL(slugParam, request.url);
  const res = NextResponse.redirect(redirectUrl.toString());
  res.cookies.set('__prerender_bypass', '1', { httpOnly: true, path: '/' });
  res.cookies.set('__next_preview_data', '1', { httpOnly: true, path: '/' });
  return res;
}
=======
import { NextResponse } from 'next/server';

export async function GET(request) {
	// DEBUG only: log presence/length, do NOT log secret value
	console.log('PREVIEW_SECRET present?', !!process.env.PREVIEW_SECRET, 'length=', process.env.PREVIEW_SECRET?.length ?? 0);

	const url = new URL(request.url);
	const secret = url.searchParams.get('secret');
	const slugParam = url.searchParams.get('slug') || '/';

	if (!secret || secret !== process.env.PREVIEW_SECRET) {
		return new NextResponse('Invalid or missing preview secret', { status: 401 });
	}

	// Ensure redirect uses an absolute URL. Build from the incoming request URL.
	const redirectUrl = new URL(slugParam, request.url);
	const res = NextResponse.redirect(redirectUrl.toString());
	res.cookies.set('__prerender_bypass', '1', { httpOnly: true, path: '/' });
	res.cookies.set('__next_preview_data', '1', { httpOnly: true, path: '/' });
	return res;
}
[PASTE THE CONTENTS OF web/src/app/api/preview/route.js HERE]
>>>>>>> 7df0b0e (feat(api): restore preview GET route (redirect + preview cookies))
