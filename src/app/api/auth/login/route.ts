/**
 * @fileoverview Login API route handler.
 * @module api/auth/login
 *
 * Handles user authentication by validating credentials and creating sessions.
 *
 * POST /api/auth/login
 * - Validates username and password
 * - Checks user verification status (admin approval required)
 * - Creates a new session with 7-day expiration
 * - Sets secure HTTP-only session cookie
 *
 * @requires server-only
 */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userQueries, sessionQueries } from '@/lib/db';
import { randomBytes } from 'crypto';
import { SESSION_EXPIRY_DAYS } from '@/lib/constants';

/**
 * POST handler for user login.
 *
 * @param {NextRequest} request - The incoming request with JSON body { username, password }
 * @returns {NextResponse} JSON response with success/error message
 *
 * Response codes:
 * - 200: Login successful, session cookie set
 * - 400: Missing username or password
 * - 401: Invalid credentials
 * - 403: Account not verified by admin
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードを 入力してください' },
        { status: 400 }
      );
    }

    // Find user
    const user = await userQueries.findByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが 正しくありません' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが 正しくありません' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.verified) {
      return NextResponse.json(
        { error: 'アカウントは まだ承認されていません。 管理者の承認を お待ちください。' },
        { status: 403 }
      );
    }

    // Clean up expired sessions
    await sessionQueries.deleteExpired();

    // Create session
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

    await sessionQueries.create(sessionId, user.id, expiresAt);

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, message: 'ログインに成功しました' },
      { status: 200 }
    );

    // Check if original request was HTTPS (via reverse proxy)
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isSecure = forwardedProto === 'https' || process.env.NODE_ENV === 'development';

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが 発生しました' },
      { status: 500 }
    );
  }
}
