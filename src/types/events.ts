/**
 * @fileoverview Type definitions for events and RSVPs.
 * @module types/events
 *
 * Re-exports event-related types from the database module for cleaner imports.
 */

export type {
  Event,
  EventWithCreator,
  EventWithCounts,
  RSVP,
  RSVPWithUser,
} from '@/lib/db';

/**
 * Event data returned from event detail API.
 */
export interface EventDetailData {
  event: EventWithCreator;
  attendees: RSVPWithUser[];
  counts: { yes: number; no: number; maybe: number };
  user_rsvp: 'yes' | 'no' | 'maybe' | null;
  user_id: number;
  is_creator: boolean;
}

/**
 * Event form data for create/edit operations.
 */
export interface EventFormData {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
}
