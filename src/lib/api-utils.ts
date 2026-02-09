/**
 * @fileoverview API utilities for optimized responses.
 * @module lib/api-utils
 *
 * Provides utilities for:
 * - Optimized JSON responses with compression hints
 * - Cache control headers
 * - Performance-optimized response generation
 *
 * @requires server-only
 */
import "server-only";
import { NextResponse } from "next/server";

/**
 * Cache control options for API responses.
 */
export type CacheOption =
  | "no-cache" // No caching (default for authenticated routes)
  | "public" // Public caching
  | "private" // Private caching
  | { maxAge: number; staleWhileRevalidate?: number }; // Custom cache

/**
 * Options for creating optimized responses.
 */
export interface OptimizedResponseOptions {
  status?: number;
  cache?: CacheOption;
  headers?: Record<string, string>;
}

/**
 * Creates an optimized JSON response with appropriate headers.
 *
 * @param data - The data to send in the response
 * @param options - Response options (status, headers, caching)
 * @returns NextResponse with optimized headers
 */
export function createOptimizedResponse<T>(
  data: T,
  options: OptimizedResponseOptions = {},
): NextResponse {
  const {
    status = 200,
    cache = "no-cache",
    headers: customHeaders = {},
  } = options;

  // Create response headers
  const headers = new Headers(customHeaders);

  // Add cache control headers
  if (cache === "no-cache") {
    headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  } else if (cache === "public") {
    headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=30",
    );
  } else if (cache === "private") {
    headers.set("Cache-Control", "private, max-age=60");
  } else if (typeof cache === "object") {
    const { maxAge, staleWhileRevalidate } = cache;
    const swr = staleWhileRevalidate
      ? `, stale-while-revalidate=${staleWhileRevalidate}`
      : "";
    headers.set("Cache-Control", `public, max-age=${maxAge}${swr}`);
  }

  // Optimize JSON serialization
  const response = NextResponse.json(data, {
    status,
    headers: Object.fromEntries(headers),
  });

  return response;
}

/**
 * Creates an error response with consistent formatting.
 *
 * @param error - Error message
 * @param status - HTTP status code
 * @returns NextResponse with error
 */
export function createErrorResponse(
  error: string,
  status: number,
): NextResponse {
  return createOptimizedResponse({ error }, { status, cache: "no-cache" });
}

/**
 * Creates a success response with consistent formatting.
 *
 * @param data - Response data
 * @param status - HTTP status code
 * @param cache - Cache control setting
 * @returns NextResponse with data
 */
export function createSuccessResponse<T>(
  data: T,
  status = 200,
  cache: CacheOption = "no-cache",
): NextResponse {
  return createOptimizedResponse(data, { status, cache });
}
