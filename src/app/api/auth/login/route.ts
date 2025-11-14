import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userQueries, sessionQueries } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードを入力してください' },
        { status: 400 }
      );
    }

    // Find user
    const user = userQueries.findByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Clean up expired sessions
    sessionQueries.deleteExpired();

    // Create session
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    sessionQueries.create(sessionId, user.id, expiresAt);

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, message: 'ログインに成功しました' },
      { status: 200 }
    );

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
