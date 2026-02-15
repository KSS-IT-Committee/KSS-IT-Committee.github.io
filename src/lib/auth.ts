/**
 * @fileoverview Server-side authentication utilities for session validation.
 * @module lib/auth
 *
 * This module provides authentication helpers that run exclusively on the server.
 * It validates user sessions by checking cookies and database records.
 *
 * @requires server-only - Ensures this module cannot be imported in client components
 */
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { type Session,sessionQueries } from "@/lib/db";

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
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  try {
    // Clean up expired sessions periodically
    // This runs in the background and doesn't block the response
    sessionQueries
      .deleteExpired()
      .catch((err) => console.error("Failed to delete expired sessions:", err));

    const session = await sessionQueries.findById(sessionId);

    if (!session) {
      // Session not found or expired (findById now filters expired sessions)
      redirect("/login");
    }

    // Double-check expiry (belt and suspenders approach)
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      await sessionQueries.delete(sessionId);
      redirect("/login");
    }

    return session;
  } catch (error) {
    console.error(`Session validation error: ${error}`);
    redirect("/login");
  }
}

/**
 * Result of authentication check for API routes.
 */
export interface AuthResult {
  authenticated: boolean;
  session?: Session;
  errorResponse?: NextResponse;
}

/**
 * Checks if the current request is authenticated (for API routes).
 * Returns authentication status and either the session or an error response.
 *
 * @returns {Promise<AuthResult>} Authentication result with session or error
 *
 * @example
 * // In an API route handler
 * export async function GET() {
 *   const auth = await requireAuth();
 *   if (!auth.authenticated) {
 *     return auth.errorResponse;
 *   }
 *   // Use auth.session.user_id
 *   const userId = auth.session.user_id;
 * }
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    // Clean up expired sessions periodically
    // This runs in the background and doesn't block the response
    sessionQueries
      .deleteExpired()
      .catch((err) => console.error("Failed to delete expired sessions:", err));

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return {
        authenticated: false,
        errorResponse: NextResponse.json(
          { error: "認証が必要です" },
          { status: 401 },
        ),
      };
    }

    const session = await sessionQueries.findById(sessionId);
    if (!session) {
      // Session not found or expired (findById now filters expired sessions)
      return {
        authenticated: false,
        errorResponse: NextResponse.json(
          { error: "認証が必要です" },
          { status: 401 },
        ),
      };
    }

    // Double-check expiry (belt and suspenders approach)
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      await sessionQueries.delete(sessionId);
      return {
        authenticated: false,
        errorResponse: NextResponse.json(
          { error: "認証が必要です" },
          { status: 401 },
        ),
      };
    }

    return {
      authenticated: true,
      session,
    };
  } catch (error) {
    console.error(`Error checking authentication: ${error}`);
    return {
      authenticated: false,
      errorResponse: NextResponse.json(
        { error: "サーバーエラーが発生しました" },
        { status: 500 },
      ),
    };
  }
}

/**
 * Checks if authentication is required (i.e., if the user is NOT authenticated).
 * This function satisfies issue #66: "Create a function that returns whether
 * the requirement to display '認証が必要です' is met"
 *
 * @returns {Promise<boolean>} True if authentication is required (user is not authenticated)
 *
 * @example
 * // Check if user needs to authenticate
 * if (await isAuthenticationRequired()) {
 *   // Show "認証が必要です" message or return 401
 *   return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
 * }
 */
export async function isAuthenticationRequired(): Promise<boolean> {
  const auth = await requireAuth();
  return !auth.authenticated;
}
