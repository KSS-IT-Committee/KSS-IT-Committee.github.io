/**
 * @fileoverview Create event page (protected).
 * @module app/events/create/page
 *
 * Form page for creating new events.
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import { AuthGuard } from "@/components/AuthGuard";

import { EventCreateClient } from "./EventCreateClient";

/**
 * Create event page component (Server Component).
 *
 * Wraps the create form in AuthGuard for session validation.
 *
 * @returns {Promise<JSX.Element>} The protected create event page
 */
export default async function CreateEventPage() {
  return (
    <AuthGuard>
      <EventCreateClient />
    </AuthGuard>
  );
}
