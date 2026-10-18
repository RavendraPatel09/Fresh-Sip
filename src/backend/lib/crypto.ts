import crypto from 'node:crypto';

const SCRYPT_KEYLEN = 64;
const DEFAULT_SESSION_SECRET = process.env.SESSION_SECRET || 'freshsip-super-secure-production-secret-key-change-me-2026';

/**
 * Securely hashes a plain text password using scrypt with a unique 16-byte salt.
 * Returns salt:derivedKey
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, SCRYPT_KEYLEN, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a password against the stored scrypt hash using timingSafeEqual
 * to eliminate timing-attack vulnerabilities.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!storedHash || !storedHash.includes(':')) {
      return resolve(false);
    }

    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) {
      return resolve(false);
    }

    crypto.scrypt(password, salt, SCRYPT_KEYLEN, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const storedKey = Buffer.from(keyHex, 'hex');
        if (storedKey.length !== derivedKey.length) {
          return resolve(false);
        }
        resolve(crypto.timingSafeEqual(storedKey, derivedKey));
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Generates a cryptographically strong random token.
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hashes a token with SHA-256 for safe storage in the database.
 * This guarantees that even if the database is read, raw reset tokens are never exposed.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Signs a session payload with HMAC-SHA256 and base64url encoding.
 */
export function signSessionPayload(payload: Record<string, any>, secret = DEFAULT_SESSION_SECRET): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 */
export function verifySessionToken<T = any>(token: string, secret = DEFAULT_SESSION_SECRET): T | null {
  if (!token || !token.includes('.')) return null;

  const [data, signature] = token.split('.');
  if (!data || !signature) return null;

  try {
    const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(data, 'base64url').toString('utf-8');
    const parsed = JSON.parse(jsonStr);

    // Check expiration if present
    if (parsed.exp && Date.now() > parsed.exp) {
      return null;
    }

    return parsed as T;
  } catch {
    return null;
  }
}
