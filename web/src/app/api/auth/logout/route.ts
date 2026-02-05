import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * 
 * Clears authentication token cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');

  return NextResponse.json({ success: true });
}
