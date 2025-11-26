/**
 * @fileoverview Logout API route handler.
 * @module api/auth/logout
 *
 * Handles user logout by invalidating sessions.
 *
 * POST /api/auth/logout
 * - Deletes the session from the database
 * - Clears the session cookie
 *
 * @requires server-only
 */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { sessionQueries } from '@/lib/db';

/**
 * POST handler for user logout.
 *
 * @param {NextRequest} request - The incoming request (reads session from cookies)
 * @returns {NextResponse} JSON response confirming logout
 *
 * Response codes:
 * - 200: Logout successful
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;

    if (sessionId) {
      // Delete session from database
      await sessionQueries.delete(sessionId);
    }

    // Create response and clear cookie
    const response = NextResponse.json(
      { success: true, message: 'ログアウトしました' },
      { status: 200 }
    );

    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
