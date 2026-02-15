/**
 * @fileoverview Events list page (protected).
 * @module app/events/page
 *
 * Displays all events with RSVP counts.
 * Allows users to view events and navigate to create new ones.
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import { AuthGuard } from "@/components/AuthGuard";

import { EventsPageClient } from "./EventsPageClient";

/**
 * Events page component (Server Component).
 *
 * Wraps the events list in AuthGuard for session validation.
 *
 * @returns {Promise<JSX.Element>} The protected events page
 */
export default async function EventsPage() {
  return (
    <AuthGuard>
      <EventsPageClient />
    </AuthGuard>
  );
}
