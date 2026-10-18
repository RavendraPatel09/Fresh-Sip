import { NextResponse } from 'next/server';
import { findUserByEmail, createPasswordReset } from '@/backend/db';
import { generateSecureToken, hashToken } from '@/backend/lib/crypto';
import { sendPasswordResetEmail } from '@/backend/services/email';
import { checkRateLimit } from '@/backend/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting: max 3 reset attempts per 15 minutes per email/IP
    if (!checkRateLimit(`pw_reset_${ip}_${normalizedEmail}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const user = await findUserByEmail(normalizedEmail);

    // SECURITY: Always return a generic success message to prevent user enumeration
    const genericResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
    };

    if (!user) {
      // Don't reveal account doesn't exist
      return NextResponse.json(genericResponse);
    }

    // Generate cryptographically secure single-use token (32 bytes = 64 hex chars)
    const rawToken = generateSecureToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = Date.now() + RESET_TOKEN_LIFETIME;

    // Save token hash to DB (never store raw token in DB)
    await createPasswordReset(normalizedEmail, tokenHash, expiresAt);

    // Build reset link
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${origin}/?resetToken=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

    // Dispatch email
    await sendPasswordResetEmail(normalizedEmail, resetLink);

    // In development mode only, return debug preview helper if email isn't configured so testing is painless
    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      ...genericResponse,
      ...(isDev ? { devResetLink: resetLink } : {}),
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}
