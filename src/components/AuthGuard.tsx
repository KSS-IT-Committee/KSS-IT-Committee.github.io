import { ReactNode } from 'react';
import { validateSession } from '@/lib/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  // This runs on the server and validates the session
  await validateSession();

  // If validation passes, render children
  return <>{children}</>;
}
