import { cookies } from 'next/headers';
import { signSessionPayload, verifySessionToken } from './crypto';
import { findUserById, UserRecord } from '@/backend/db';

export const SESSION_COOKIE_NAME = 'freshsip_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface SessionPayload {
  userId: string;
  role: 'customer' | 'admin';
  email: string;
  exp: number;
}

export function createSessionToken(user: UserRecord): string {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  return signSessionPayload(payload);
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    maxAge: SESSION_MAX_AGE,
    path: '/',
  };
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const payload = verifySessionToken<SessionPayload>(sessionCookie.value);
    if (!payload || !payload.userId) {
      return null;
    }

    const user = await findUserById(payload.userId);
    return user;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function requireAuth(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireAdmin(): Promise<UserRecord> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Administrator privileges required');
  }
  return user;
}

export function sanitizeUser(user: UserRecord) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// In-memory rate limiting map for brute-force protection
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count += 1;
  return true;
}
