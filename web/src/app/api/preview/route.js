// web/src/app/api/preview/route.js
import { NextResponse } from 'next/server';

/**
 * GET /api/preview?secret=<secret>&slug=/path
 * - Validates PREVIEW_SECRET
 * - Sets Next preview cookies and redirects to the slug
 */
export async function GET(request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug') || '/';

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse('Invalid or missing preview secret', { status: 401 });
  }

  const res = NextResponse.redirect(slug);

  // Set preview cookies. These are the cookies Next uses for Preview Mode.
  res.cookies.set('__prerender_bypass', '1', { httpOnly: true, path: '/' });
  res.cookies.set('__next_preview_data', '1', { httpOnly: true, path: '/' });

  return res;
}
