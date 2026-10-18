import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/backend/db';
import { verifyPassword } from '@/backend/lib/crypto';
import { createSessionToken, getSessionCookieOptions, sanitizeUser, checkRateLimit } from '@/backend/lib/auth';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const body = await req.json();
    const { email, password } = body;

    // Rate limiting (max 5 attempts per minute per IP)
    if (!checkRateLimit(`login_${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. For security, please wait 60 seconds before trying again.' },
        { status: 429 }
      );
    }

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Prevent user enumeration by taking similar time or returning consistent message
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Create session token and set HTTP-only cookie
    const token = createSessionToken(user);
    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      message: `Welcome back, ${user.name}!`,
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
