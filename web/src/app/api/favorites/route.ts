import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth/server';
import logger from '@/lib/logger';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Type definitions
interface Favorite {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  productPrice?: string;
  createdAt: string;
}

const favoritesFilePath = path.join(process.cwd(), 'data', 'favorites.json');

// Helper to read favorites from file
async function readFavorites(): Promise<Favorite[]> {
  if (!existsSync(favoritesFilePath)) {
    return [];
  }
  const { readFile } = await import('fs/promises');
  const data = await readFile(favoritesFilePath, 'utf-8');
  return JSON.parse(data);
}

// Helper to write favorites to file
async function writeFavorites(favorites: Favorite[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
  await writeFile(favoritesFilePath, JSON.stringify(favorites, null, 2));
}

// GET - Fetch user's favorites
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getServerAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allFavorites = await readFavorites();
    const userFavorites = allFavorites.filter((fav) => fav.userId === userId);

    // Sort by creation date (newest first)
    userFavorites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ favorites: userFavorites });
  } catch (error) {
    logger.error('Error fetching favorites', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const { userId } = await getServerAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, productName, productSlug, productImage, productPrice } = body;

    if (!productId || !productName || !productSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const favorites = await readFavorites();

    // Check if already favorited
    const alreadyFavorited = favorites.some(
      (fav) => fav.userId === userId && fav.productId === productId
    );

    if (alreadyFavorited) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 409 });
    }

    // Create new favorite
    const newFavorite: Favorite = {
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      productId,
      productName,
      productSlug,
      productImage,
      productPrice,
      createdAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    await writeFavorites(favorites);

    return NextResponse.json({
      success: true,
      favorite: newFavorite,
      message: 'Product added to favorites',
    });
  } catch (error) {
    logger.error('Error adding to favorites', error);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await getServerAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const favorites = await readFavorites();

    // Find and remove the favorite
    const favoriteIndex = favorites.findIndex(
      (fav) => fav.userId === userId && fav.productId === productId
    );

    if (favoriteIndex === -1) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    favorites.splice(favoriteIndex, 1);
    await writeFavorites(favorites);

    return NextResponse.json({
      success: true,
      message: 'Product removed from favorites',
    });
  } catch (error) {
    logger.error('Error removing from favorites', error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}
