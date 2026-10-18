import { NextResponse } from 'next/server';
import { findUserByEmail, findValidPasswordReset, markPasswordResetUsed, updatePassword } from '@/backend/db';
import { hashPassword, hashToken } from '@/backend/lib/crypto';
import { checkRateLimit } from '@/backend/lib/auth';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const body = await req.json();
    const { email, token, newPassword, confirmPassword } = body;

    // Rate limiting
    if (!checkRateLimit(`reset_exec_${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    if (!email || !token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Missing required parameters. Please provide email, token, and new password.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify and re-enter.' },
        { status: 400 }
      );
    }

    // Hash the incoming raw token to find it in the DB
    const tokenHash = hashToken(token.trim());
    const resetRecord = await findValidPasswordReset(email.trim().toLowerCase(), tokenHash);

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'This password reset link is invalid or has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'Account not found.' },
        { status: 404 }
      );
    }

    // Hash new password using scrypt
    const newHash = await hashPassword(newPassword);

    // Update password in DB
    await updatePassword(user.id, newHash);

    // Invalidate reset token so it cannot be used again
    await markPasswordResetUsed(resetRecord.id);

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new credentials.',
    });
  } catch (error: any) {
    console.error('Password reset execution error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while resetting your password.' },
      { status: 500 }
    );
  }
}
