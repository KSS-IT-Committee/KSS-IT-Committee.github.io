/**
 * @fileoverview Event detail page (protected).
 * @module app/events/[id]/page
 *
 * Displays event details with attendees and RSVP functionality.
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import AuthGuard from '@/components/AuthGuard';
import EventDetailClient from './EventDetailClient';

/**
 * Event detail page component (Server Component).
 *
 * Wraps the event detail in AuthGuard for session validation.
 *
 * @returns {Promise<JSX.Element>} The protected event detail page
 */
export default async function EventDetailPage() {
  return (
    <AuthGuard>
      <EventDetailClient />
    </AuthGuard>
  );
}
