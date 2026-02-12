import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import logger from '@/lib/logger';
import { RATE_LIMITS } from '@/lib/constants/rate-limits';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, RATE_LIMITS.REVALIDATE_API);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message:
            'You have made too many revalidation requests. Please wait a moment and try again.',
          retryAfter: Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { tag, secret } = body;

    // Verify secret
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      logger.warn('revalidate.unauthorized_attempt', { clientIP, tag });
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid or missing revalidation secret.',
        },
        { status: 401 }
      );
    }

    // Validate tag
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Missing or invalid tag parameter.',
        },
        { status: 400 }
      );
    }

    // Whitelist allowed tags for security
    const allowedTags = ['products', 'product-list', 'categories', 'graphql'];

    // Allow product-specific tags (product-{slug})
    const isProductTag = /^product-[a-z0-9-]+$/.test(tag);

    if (!allowedTags.includes(tag) && !isProductTag) {
      logger.warn('revalidate.invalid_tag', { tag, clientIP });
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: `Tag '${tag}' is not allowed. Allowed tags: ${allowedTags.join(', ')}, or product-{slug}.`,
        },
        { status: 400 }
      );
    }

    // Revalidate the tag
    // @ts-expect-error - Next.js 16 revalidateTag signature may vary
    revalidateTag(tag);

    logger.info('revalidate.success', { tag, clientIP });

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    logger.error('revalidate.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while revalidating. Please try again later.',
      },
      { status: 500 }
    );
  }
}
