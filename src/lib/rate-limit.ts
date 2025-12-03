/**
 * @fileoverview Simple in-memory rate limiting utility.
 * @module lib/rate-limit
 *
 * Provides rate limiting functionality to prevent brute force attacks.
 * Uses in-memory storage (resets on server restart).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited.
 *
 * @param {string} identifier - Unique identifier (IP address or username)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if rate limited, false if allowed
 */
export function isRateLimited(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // No entry or window expired, create new entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  // Increment count
  entry.count++;

  if (entry.count > maxAttempts) {
    return true; // Rate limited
  }

  return false;
}

/**
 * Reset rate limit for an identifier (e.g., on successful login).
 *
 * @param {string} identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Clean up expired entries (call periodically).
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
