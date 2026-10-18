import { NextResponse } from 'next/server';
import { getCurrentUser, sanitizeUser } from '@/backend/lib/auth';
import { updateUser } from '@/backend/db';

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, addresses, favorites } = body;

    const updates: any = {};
    if (typeof name === 'string' && name.trim().length >= 2) {
      updates.name = name.trim();
    }
    if (typeof phone === 'string') {
      updates.phone = phone.trim();
    }
    if (Array.isArray(addresses)) {
      updates.addresses = addresses;
    }
    if (Array.isArray(favorites)) {
      updates.favorites = favorites;
    }

    const updatedUser = await updateUser(user.id, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(updatedUser),
      message: 'Profile updated successfully!',
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
