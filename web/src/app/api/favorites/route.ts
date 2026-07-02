import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Favorite {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  productPrice?: string;
  createdAt: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value ?? null;
}

async function wpGraphQL<T>(
  token: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<GraphQLResponse<T>> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`WordPress GraphQL request failed: ${response.status}`);
  }

  return response.json() as Promise<GraphQLResponse<T>>;
}

// ---------------------------------------------------------------------------
// GET — fetch current user's favorites
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, errors } = await wpGraphQL<{ myFavorites: Favorite[] }>(
      token,
      `query GetMyFavorites {
        myFavorites {
          id productId productName productSlug productImage productPrice createdAt
        }
      }`
    );

    if (errors?.length) {
      logger.error('GraphQL errors fetching favorites', errors);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites: data?.myFavorites ?? [] });
  } catch (error) {
    logger.error('Error fetching favorites', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — add a product to favorites
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const { productId, productName, productSlug, productImage, productPrice } = body;

    if (!productId || !productName || !productSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, errors } = await wpGraphQL<{
      addFavorite: { favorite: Favorite; alreadyExists: boolean; success: boolean };
    }>(
      token,
      `mutation AddFavorite($input: AddFavoriteInput!) {
        addFavorite(input: $input) {
          favorite { id productId productName productSlug productImage productPrice createdAt }
          alreadyExists
          success
        }
      }`,
      { input: { productId, productName, productSlug, productImage, productPrice } }
    );

    if (errors?.length) {
      logger.error('GraphQL errors adding favorite', errors);
      return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
    }

    const result = data?.addFavorite;

    if (result?.alreadyExists) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      favorite: result?.favorite,
      message: 'Product added to favorites',
    });
  } catch (error) {
    logger.error('Error adding to favorites', error);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove a product from favorites
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const { data, errors } = await wpGraphQL<{
      removeFavorite: { success: boolean; notFound: boolean };
    }>(
      token,
      `mutation RemoveFavorite($input: RemoveFavoriteInput!) {
        removeFavorite(input: $input) { success notFound }
      }`,
      { input: { productId } }
    );

    if (errors?.length) {
      logger.error('GraphQL errors removing favorite', errors);
      return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
    }

    const result = data?.removeFavorite;

    if (result?.notFound) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product removed from favorites' });
  } catch (error) {
    logger.error('Error removing from favorites', error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}
