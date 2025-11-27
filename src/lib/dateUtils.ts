/**
 * @fileoverview Date and time formatting utilities.
 * @module lib/dateUtils
 *
 * Provides consistent date and time formatting across the application.
 */

/**
 * Formats a date string to Japanese locale format.
 * @param {string} dateStr - The date string (YYYY-MM-DD or ISO 8601)
 * @param {boolean} includeWeekday - Whether to include the weekday
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr: string, includeWeekday = false): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeWeekday && { weekday: 'long' }),
  });
}

/**
 * Formats a time string to HH:MM format.
 * @param {string} timeStr - The time string (HH:MM:SS or HH:MM)
 * @returns {string} Formatted time string (HH:MM)
 */
export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}
