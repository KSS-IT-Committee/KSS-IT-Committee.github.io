/**
 * @fileoverview Shared API type definitions.
 * @module types/api
 *
 * Provides common types used across API routes.
 */

/**
 * Route context for dynamic route parameters.
 * Used in Next.js API routes with dynamic segments.
 */
export interface RouteContext<T = Record<string, string>> {
  params: Promise<T>;
}
