import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const { perPage = 12, after } = await request.json();

    const { posts, pageInfo } = await getPosts({
      perPage,
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
