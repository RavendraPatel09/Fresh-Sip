import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser, findUserByEmail } from '@/backend/db';
import { hashPassword } from '@/backend/lib/crypto';
import { createSessionToken, getSessionCookieOptions, sanitizeUser, checkRateLimit } from '@/backend/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    if (!checkRateLimit(`reg_${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, confirmPassword, phone } = body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify and re-enter.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Securely hash password using scrypt
    const passwordHash = await hashPassword(password);

    // Create user in DB (always defaults to role: 'customer')
    const newUser = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: typeof phone === 'string' ? phone.trim() : '',
      role: 'customer',
    });

    // Generate secure session token and set HTTP-only cookie
    const token = createSessionToken(newUser);
    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(newUser),
      message: 'Account created successfully! Welcome to FreshSip.',
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account. Please try again later.' },
      { status: 500 }
    );
  }
}
