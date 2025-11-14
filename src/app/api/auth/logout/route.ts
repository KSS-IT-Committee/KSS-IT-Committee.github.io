import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { sessionQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;

    if (sessionId) {
      // Delete session from database
      sessionQueries.delete(sessionId);
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
