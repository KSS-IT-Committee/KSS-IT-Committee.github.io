/**
 * @fileoverview Session check API route handler.
 * @module api/auth/check
 *
 * Validates whether the current user has an active session.
 *
 * GET /api/auth/check
 * - Checks for session cookie
 * - Validates session exists in database
 * - Verifies session has not expired
 *
 * @requires server-only
 */
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionQueries } from "@/lib/db";

/**
 * GET handler for session validation.
 *
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} JSON response with { valid: boolean }
 *
 * Response codes:
 * - 200: Session is valid
 * - 401: No session or invalid/expired session
 * - 500: Server error
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const session = await sessionQueries.findById(sessionId);

    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      await sessionQueries.delete(sessionId);
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error(`Session check error: ${error}`);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
