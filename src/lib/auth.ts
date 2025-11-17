import 'server-only';
import { cookies } from 'next/headers';
import { sessionQueries } from '@/lib/db';
import { redirect } from 'next/navigation';

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
