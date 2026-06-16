import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const { perPage = 12, after } = await request.json();

    // Validate and clamp perPage to prevent excessive load
    const validatedPerPage = Math.min(Math.max(Number(perPage) || 12, 1), 100);

    const { posts, pageInfo } = await getPosts({
      perPage: validatedPerPage,
      after: after || undefined,
    });

    return NextResponse.json({ posts, pageInfo });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
