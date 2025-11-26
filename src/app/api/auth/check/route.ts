import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessionQueries } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

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
    console.error('Session check error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
