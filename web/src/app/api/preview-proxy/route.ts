import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy that forwards GraphQL queries to WordPress with Basic Auth.
// This keeps the application password secret (never exposed to browser).
// Replaces the Pages Router preview-proxy API.
export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { query, variables } = body;
  
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  const user = process.env.PREVIEW_USER;
  const pass = process.env.PREVIEW_APP_PASSWORD;

  if (user && pass) {
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  if (!graphqlUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_WORDPRESS_GRAPHQL not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
