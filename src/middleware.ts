/**
 * @fileoverview Next.js Edge Middleware for route protection.
 * @module middleware
 *
 * This middleware runs on the Edge runtime before requests reach pages.
 * It handles authentication-based route protection and cache control.
 *
 * Protected Routes:
 * - /tutorial/* - Tutorial content (requires authentication)
 * - /committee-info/* - Committee member area (requires authentication)
 * - /events/* - Events and attendance management (requires authentication)
 *
 * Public Routes:
 * - /login - Login page
 * - /api/auth/* - Authentication API endpoints
 * - Static files (_next/static, images, favicon, etc.)
 *
 * Security Features:
 * - Checks for session cookie presence
 * - Redirects unauthenticated users to /login
 * - Sets no-cache headers on protected pages to prevent browser caching
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware function that runs before each request.
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} The response (either next() to continue or redirect)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and API routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if accessing protected routes (committee-info, tutorial, events)
  if (pathname.startsWith("/tutorial") || pathname.startsWith("/committee-info") || pathname.startsWith("/events")) {
    const sessionId = request.cookies.get("session")?.value;

    if (!sessionId) {
      // No session cookie, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session cookie exists, allow access
    // Add cache-control and security headers
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return response;
  }

  // Allow all other routes
  return NextResponse.next();
}

/**
 * Middleware configuration.
 *
 * Defines which routes the middleware should run on.
 * Excludes static assets and image files for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
