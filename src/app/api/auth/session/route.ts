import { NextResponse } from 'next/server';
import { getCurrentUser, sanitizeUser } from '@/backend/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ user: null });
  }
}
