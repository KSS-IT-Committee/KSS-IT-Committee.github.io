/**
 * @fileoverview Server-side authentication utilities for session validation.
 * @module lib/auth
 *
 * This module provides authentication helpers that run exclusively on the server.
 * It validates user sessions by checking cookies and database records.
 *
 * @requires server-only - Ensures this module cannot be imported in client components
 */
import 'server-only';
import { cookies } from 'next/headers';
import { sessionQueries } from '@/lib/db';
import { redirect } from 'next/navigation';

/**
 * Validates the current user's session from cookies.
 *
 * This function performs server-side session validation by:
 * 1. Reading the session ID from HTTP-only cookies
 * 2. Looking up the session in the database
 * 3. Checking if the session has expired
 * 4. Redirecting to login if any validation fails
 *
 * @async
 * @returns {Promise<Session>} The valid session object if validation passes
 * @throws {redirect} Redirects to /login if session is invalid or expired
 *
 * @example
 * // Use in a Server Component to protect a page
 * export default async function ProtectedPage() {
 *   const session = await validateSession();
 *   return <div>Welcome, user {session.user_id}</div>;
 * }
 */
export async function validateSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    redirect('/login');
  }

  try {
    const session = await sessionQueries.findById(sessionId);

    if (!session) {
      redirect('/login');
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      await sessionQueries.delete(sessionId);
      redirect('/login');
    }

    return session;
  } catch (error) {
    console.error('Session validation error:', error);
    redirect('/login');
  }
}
