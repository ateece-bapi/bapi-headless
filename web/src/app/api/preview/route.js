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