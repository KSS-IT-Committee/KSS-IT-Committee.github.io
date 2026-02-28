/**
 * AuthGuard Component
 *
 * A server-side authentication wrapper that protects child components.
 *
 * Purpose:
 * - Validates user sessions before rendering protected content
 * - Automatically redirects unauthenticated users to the login page
 * - Runs entirely on the server for security
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The protected content to render
 *
 * @example
 * <AuthGuard>
 *   <ProtectedPageContent />
 * </AuthGuard>
 *
 * @note This is an async Server Component - it cannot be used in client components
 */
import { ReactNode } from "react";

import { validateSession } from "@/lib/auth";

interface AuthGuardProps {
  children: ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  // Server-side session validation - redirects to /login if invalid
  await validateSession();

  // Session is valid, render protected content
  return <>{children}</>;
}
