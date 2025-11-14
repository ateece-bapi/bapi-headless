import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// Route handler for enabling preview/draft mode in Next.js App Router.
// Expects ?secret=<PREVIEW_SECRET> and optional ?slug=/path
// This replaces the Pages Router preview API.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Check the secret to authorize the preview request
  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  (await draftMode()).enable();

  // Redirect to the path specified in the query or home
  const redirectUrl = slug || '/';
  redirect(redirectUrl);
}
