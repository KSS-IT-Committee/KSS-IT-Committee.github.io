/**
 * @fileoverview CSRF token generation and validation.
 * @module lib/csrf
 *
 * Provides CSRF protection for state-changing operations.
 * Uses synchronizer token pattern stored in session cookies.
 */
import { randomBytes } from 'crypto';

const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a new CSRF token for a session.
 *
 * @param {string} sessionId - The session ID
 * @returns {string} The generated CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  csrfTokens.set(sessionId, { token, expires });

  // Clean up expired tokens
  cleanupExpiredTokens();

  return token;
}

/**
 * Validate a CSRF token for a session.
 *
 * @param {string} sessionId - The session ID
 * @param {string} token - The CSRF token to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const entry = csrfTokens.get(sessionId);

  if (!entry) {
    return false;
  }

  if (Date.now() > entry.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }

  return entry.token === token;
}

/**
 * Clean up expired CSRF tokens.
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, entry] of csrfTokens.entries()) {
    if (now > entry.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}

// Clean up every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
