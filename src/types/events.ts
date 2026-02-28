/**
 * @fileoverview Type definitions for events and RSVPs.
 * @module types/events
 *
 * Re-exports event-related types from the database module for cleaner imports.
 */

export type {
  Event,
  EventWithCounts,
  EventWithCreator,
  RSVP,
  RSVPWithUser,
} from "@/lib/db";
