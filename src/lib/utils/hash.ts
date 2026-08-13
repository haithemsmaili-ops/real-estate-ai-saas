import crypto from 'crypto';

/**
 * Hash a password using SHA-256 with a local app secret salt
 * @param password The plain text password
 */
export function hashPassword(password: string): string {
  const salt = process.env.NEXTAUTH_SECRET || 'propai_default_secret_salt_123';
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

/**
 * Verify a plain text password matches a given hash
 * @param password The plain text password
 * @param hash The stored hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
