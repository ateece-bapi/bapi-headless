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
  if (!GRAPHQL_ENDPOINT) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_GRAPHQL is not configured');
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  // WordPress may return HTTP 401/403 for an invalid or expired JWT.
  // Convert these to an errors[] payload so isAuthError() / clearAuthCookies() handles them
  // correctly instead of falling through to the generic catch → 500 path.
  if (response.status === 401 || response.status === 403) {
    return { errors: [{ message: 'Unauthorized' }] };
  }

  if (!response.ok) {
    throw new Error(`WordPress GraphQL request failed: ${response.status}`);
  }

  return response.json() as Promise<GraphQLResponse<T>>;
}

function isAuthError(errors: Array<{ message: string }>): boolean {
  return errors.some((e) => /unauthorized|invalid.?token|expired/i.test(e.message));
}

function isLimitError(errors: Array<{ message: string }>): boolean {
  return errors.some((e) => /favorites limit reached/i.test(e.message));
}

async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('refresh_token');
}

// ---------------------------------------------------------------------------
// GET — fetch current user's favorites
// ---------------------------------------------------------------------------

export async function GET(_request: NextRequest) {
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
      if (isAuthError(errors)) {
        await clearAuthCookies();
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    if (!Array.isArray(data?.myFavorites)) {
      logger.error('myFavorites returned unexpected response shape', { data });
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites: data.myFavorites });
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

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { productId, productName, productSlug, productImage, productPrice } = body;

    if (
      typeof productId !== 'string' || !productId ||
      typeof productName !== 'string' || !productName ||
      typeof productSlug !== 'string' || !productSlug
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only forward strings for optional fields
    const imageStr = typeof productImage === 'string' ? productImage : undefined;
    const priceStr = typeof productPrice === 'string' ? productPrice : undefined;

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
      { input: { productId, productName, productSlug, productImage: imageStr, productPrice: priceStr } }
    );

    if (errors?.length) {
      logger.error('GraphQL errors adding favorite', errors);
      if (isAuthError(errors)) {
        await clearAuthCookies();
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (isLimitError(errors)) {
        return NextResponse.json({ error: 'Favorites limit reached (max 500)' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
    }

    const result = data?.addFavorite;

    if (result?.alreadyExists) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 409 });
    }

    if (!result?.success || !result?.favorite) {
      logger.error('addFavorite returned unexpected response', result);
      return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      favorite: result.favorite,
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
      if (isAuthError(errors)) {
        await clearAuthCookies();
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
    }

    const result = data?.removeFavorite;

    if (result?.notFound) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    if (!result?.success) {
      logger.error('removeFavorite returned unexpected response', result);
      return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product removed from favorites' });
  } catch (error) {
    logger.error('Error removing from favorites', error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}
