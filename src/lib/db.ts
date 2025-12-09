/**
 * @fileoverview Database utilities and query functions for user and session management.
 * @module lib/db
 *
 * This module provides:
 * - Database schema initialization (users and sessions tables)
 * - User CRUD operations (create, find, check existence)
 * - Session management (create, find, delete, cleanup expired)
 *
 * Uses Cloudflare D1 (SQLite) as the database backend with bcryptjs for password hashing.
 *
 * @requires server-only - Ensures this module cannot be imported in client components
 */
import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Gets the D1 database instance from the Cloudflare environment.
 * @returns {D1Database} The D1 database instance
 */
function getDatabase(): D1Database {
  const { env } = getCloudflareContext();
  return env.kss_it_committee_db;
}

/**
 * Represents a user in the database.
 * @interface User
 */
export interface User {
  id: number;
  username: string;
  password: string;
  verified: number; // SQLite uses INTEGER for boolean (0 or 1)
  created_at: string;
}

/**
 * Represents a session in the database.
 * @interface Session
 */
export interface Session {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

/**
 * Represents an event in the database.
 * @interface Event
 */
export interface Event {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  created_by: number;
  created_at: string;
}

/**
 * Represents an event with creator username.
 * @interface EventWithCreator
 */
export interface EventWithCreator extends Event {
  creator_username: string;
}

/**
 * Represents an event with RSVP counts and user's RSVP status.
 * @interface EventWithCounts
 */
export interface EventWithCounts extends Event {
  yes_count: number;
  no_count: number;
  maybe_count: number;
  user_rsvp: 'yes' | 'no' | 'maybe' | null;
  creator_username: string;
}

/**
 * Represents an RSVP in the database.
 * @interface RSVP
 */
export interface RSVP {
  id: number;
  event_id: number;
  user_id: number;
  status: 'yes' | 'no' | 'maybe';
  comment: string | null;
  created_at: string;
}

/**
 * Represents an RSVP with username.
 * @interface RSVPWithUser
 */
export interface RSVPWithUser extends RSVP {
  username: string;
}

/**
 * User database query functions.
 * @namespace userQueries
 */
export const userQueries = {
  /**
   * Finds a user by their username.
   * @param {string} username - The username to search for
   * @returns {Promise<User | undefined>} The user object or undefined if not found
   */
  findByUsername: async (username: string): Promise<User | undefined> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare('SELECT * FROM users WHERE username = ?')
        .bind(username)
        .first<User>();

      return result || undefined;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return undefined;
    }
  },

  /**
   * Creates a new user with the given credentials.
   * New users are created with verified=0 and require admin approval.
   * @param {string} username - The username for the new user
   * @param {string} hashedPassword - The bcrypt-hashed password
   * @returns {Promise<User | undefined>} The created user object
   * @throws {Error} If user creation fails
   */
  create: async (username: string, hashedPassword: string): Promise<User | undefined> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare('INSERT INTO users (username, password, verified) VALUES (?, ?, 0) RETURNING *')
        .bind(username, hashedPassword)
        .first<User>();

      return result || undefined;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Checks if a username already exists in the database.
   * @param {string} username - The username to check
   * @returns {Promise<boolean>} True if username exists, false otherwise
   */
  existsByUsername: async (username: string): Promise<boolean> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare('SELECT 1 FROM users WHERE username = ?')
        .bind(username)
        .first();

      return result !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  },
};

/**
 * Session database query functions.
 * @namespace sessionQueries
 */
export const sessionQueries = {
  /**
   * Creates a new session for a user.
   * @param {string} sessionId - The unique session identifier (hex string)
   * @param {number} userId - The user's database ID
   * @param {Date} expiresAt - When the session expires
   * @returns {Promise<void>}
   * @throws {Error} If session creation fails
   */
  create: async (sessionId: string, userId: number, expiresAt: Date): Promise<void> => {
    try {
      const db = getDatabase();
      await db
        .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
        .bind(sessionId, userId, expiresAt.toISOString())
        .run();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  /**
   * Finds a session by ID and extends its expiration (sliding expiration).
   * Each time a session is accessed, its expiration is extended by 7 days.
   * @param {string} sessionId - The session ID to look up
   * @returns {Promise<Session | undefined>} The session object or undefined
   */
  findById: async (sessionId: string): Promise<Session | undefined> => {
    try {
      const db = getDatabase();
      const session = await db
        .prepare('SELECT * FROM sessions WHERE id = ?')
        .bind(sessionId)
        .first<Session>();

      // Extend session expiry by 7 days on each access (sliding expiration)
      if (session) {
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);
        await db
          .prepare('UPDATE sessions SET expires_at = ? WHERE id = ?')
          .bind(newExpiresAt.toISOString(), sessionId)
          .run();
      }

      return session || undefined;
    } catch (error) {
      console.error('Error finding session by id:', error);
      return undefined;
    }
  },

  /**
   * Deletes a session by ID (used for logout).
   * @param {string} sessionId - The session ID to delete
   * @returns {Promise<void>}
   */
  delete: async (sessionId: string): Promise<void> => {
    try {
      const db = getDatabase();
      await db
        .prepare('DELETE FROM sessions WHERE id = ?')
        .bind(sessionId)
        .run();
    } catch (error) {
      console.error('Error deleting session:', error);
      // Don't throw, just log the error
    }
  },

  /**
   * Deletes all expired sessions from the database.
   * Called during login to clean up stale sessions.
   * @returns {Promise<void>}
   */
  deleteExpired: async (): Promise<void> => {
    try {
      const db = getDatabase();
      await db
        .prepare("DELETE FROM sessions WHERE expires_at < datetime('now')")
        .run();
    } catch (error) {
      console.error('Error deleting expired sessions:', error);
      // Don't throw, just log the error
    }
  },
};

/**
 * Event database query functions.
 * @namespace eventQueries
 */

export const eventQueries = {
  /**
   * Creates a new event.
   * @param {string} title - Event title
   * @param {string | null} description - Event description (optional)
   * @param {string} eventDate - Event date (YYYY-MM-DD)
   * @param {string} eventTime - Event time (HH:MM)
   * @param {string} location - Event location
   * @param {number} createdBy - User ID of the creator
   * @returns {Promise<Event | undefined>} The created event
   */
  create: async (
    title: string,
    description: string | null,
    eventDate: string,
    eventTime: string,
    location: string,
    createdBy: number
  ): Promise<Event | undefined> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare('INSERT INTO events (title, description, event_date, event_time, location, created_by) VALUES (?, ?, ?, ?, ?, ?) RETURNING *')
        .bind(title, description, eventDate, eventTime, location, createdBy)
        .first<Event>();

      return result || undefined;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Finds all events with RSVP counts and the current user's RSVP status.
   * @param {number} userId - Current user's ID for checking their RSVP
   * @returns {Promise<EventWithCounts[]>} Array of events with counts
   */
  findAll: async (userId: number): Promise<EventWithCounts[]> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          SELECT
            e.*,
            u.username as creator_username,
            COALESCE(SUM(CASE WHEN r.status = 'yes' THEN 1 ELSE 0 END), 0) as yes_count,
            COALESCE(SUM(CASE WHEN r.status = 'no' THEN 1 ELSE 0 END), 0) as no_count,
            COALESCE(SUM(CASE WHEN r.status = 'maybe' THEN 1 ELSE 0 END), 0) as maybe_count,
            (SELECT status FROM rsvps WHERE event_id = e.id AND user_id = ?) as user_rsvp
          FROM events e
          LEFT JOIN users u ON e.created_by = u.id
          LEFT JOIN rsvps r ON e.id = r.event_id
          GROUP BY e.id, u.username
          ORDER BY e.event_date ASC, e.event_time ASC
        `)
        .bind(userId)
        .all<EventWithCounts>();

      return result.results || [];
    } catch (error) {
      console.error('Error finding all events:', error);
      return [];
    }
  },

  /**
   * Finds an event by ID with creator username.
   * @param {number} id - Event ID
   * @returns {Promise<EventWithCreator | undefined>} The event or undefined
   */
  findById: async (id: number): Promise<EventWithCreator | undefined> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          SELECT e.*, u.username as creator_username
          FROM events e
          LEFT JOIN users u ON e.created_by = u.id
          WHERE e.id = ?
        `)
        .bind(id)
        .first<EventWithCreator>();

      return result || undefined;
    } catch (error) {
      console.error('Error finding event by id:', error);
      return undefined;
    }
  },

  /**
   * Finds an event by ID with attendees and counts in a single query.
   * @param {number} id - Event ID
   * @param {number} userId - Current user ID (unused but kept for API compatibility)
   * @returns {Promise<{event: EventWithCreator, attendees: RSVPWithUser[], counts: {yes: number, no: number, maybe: number}} | null>}
   */
  findByIdWithAttendees: async (
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: number
  ): Promise<{
    event: EventWithCreator;
    attendees: RSVPWithUser[];
    counts: { yes: number; no: number; maybe: number };
  } | null> => {
    try {
      const db = getDatabase();

      // Get event with creator
      const event = await db
        .prepare(`
          SELECT e.*, u.username as creator_username
          FROM events e
          LEFT JOIN users u ON e.created_by = u.id
          WHERE e.id = ?
        `)
        .bind(id)
        .first<EventWithCreator>();

      if (!event) {
        return null;
      }

      // Get attendees
      const attendeesResult = await db
        .prepare(`
          SELECT r.*, u.username
          FROM rsvps r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.event_id = ?
          ORDER BY r.created_at ASC
        `)
        .bind(id)
        .all<RSVPWithUser>();

      const attendees = attendeesResult.results || [];

      // Calculate counts from attendees
      const counts = {
        yes: attendees.filter(a => a.status === 'yes').length,
        no: attendees.filter(a => a.status === 'no').length,
        maybe: attendees.filter(a => a.status === 'maybe').length,
      };

      return {
        event,
        attendees,
        counts,
      };
    } catch (error) {
      console.error('Error finding event with attendees:', error);
      return null;
    }
  },

  /**
   * Deletes an event (only if the user is the creator).
   * @param {number} id - Event ID
   * @param {number} userId - User ID attempting to delete
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  delete: async (id: number, userId: number): Promise<boolean> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare('DELETE FROM events WHERE id = ? AND created_by = ? RETURNING id')
        .bind(id, userId)
        .first();

      return result !== null;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  /**
   * Updates an event (only if the user is the creator).
   * @param {number} id - Event ID
   * @param {number} userId - User ID attempting to update
   * @param {object} data - Fields to update
   * @returns {Promise<Event | null>} The updated event or null if not found/not authorized
   */
  update: async (
    id: number,
    userId: number,
    data: {
      title?: string;
      description?: string | null;
      event_date?: string;
      event_time?: string;
      location?: string;
    }
  ): Promise<Event | null> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          UPDATE events
          SET
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            event_date = COALESCE(?, event_date),
            event_time = COALESCE(?, event_time),
            location = COALESCE(?, location)
          WHERE id = ? AND created_by = ?
          RETURNING *
        `)
        .bind(
          data.title ?? null,
          data.description ?? null,
          data.event_date ?? null,
          data.event_time ?? null,
          data.location ?? null,
          id,
          userId
        )
        .first<Event>();

      return result || null;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },
};

/**
 * RSVP database query functions.
 * @namespace rsvpQueries
 */
export const rsvpQueries = {
  /**
   * Creates or updates an RSVP for an event.
   * @param {number} eventId - Event ID
   * @param {number} userId - User ID
   * @param {'yes' | 'no' | 'maybe'} status - RSVP status
   * @param {string | null} comment - Optional comment
   * @returns {Promise<RSVP | undefined>} The created/updated RSVP
   */
  upsert: async (
    eventId: number,
    userId: number,
    status: 'yes' | 'no' | 'maybe',
    comment: string | null
  ): Promise<RSVP | undefined> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          INSERT INTO rsvps (event_id, user_id, status, comment)
          VALUES (?, ?, ?, ?)
          ON CONFLICT (event_id, user_id)
          DO UPDATE SET status = ?, comment = ?
          RETURNING *
        `)
        .bind(eventId, userId, status, comment, status, comment)
        .first<RSVP>();

      return result || undefined;
    } catch (error) {
      console.error('Error upserting RSVP:', error);
      throw error;
    }
  },

  /**
   * Finds all RSVPs for an event with usernames.
   * @param {number} eventId - Event ID
   * @returns {Promise<RSVPWithUser[]>} Array of RSVPs with usernames
   */
  findByEvent: async (eventId: number): Promise<RSVPWithUser[]> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          SELECT r.*, u.username
          FROM rsvps r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.event_id = ?
          ORDER BY r.created_at ASC
        `)
        .bind(eventId)
        .all<RSVPWithUser>();

      return result.results || [];
    } catch (error) {
      console.error('Error finding RSVPs by event:', error);
      return [];
    }
  },

  /**
   * Gets RSVP counts for an event.
   * @param {number} eventId - Event ID
   * @returns {Promise<{yes: number, no: number, maybe: number}>} RSVP counts
   */
  countByEvent: async (eventId: number): Promise<{ yes: number; no: number; maybe: number }> => {
    try {
      const db = getDatabase();
      const result = await db
        .prepare(`
          SELECT
            COALESCE(SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END), 0) as yes,
            COALESCE(SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END), 0) as no,
            COALESCE(SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END), 0) as maybe
          FROM rsvps WHERE event_id = ?
        `)
        .bind(eventId)
        .first<{ yes: number; no: number; maybe: number }>();

      return result || { yes: 0, no: 0, maybe: 0 };
    } catch (error) {
      console.error('Error counting RSVPs:', error);
      return { yes: 0, no: 0, maybe: 0 };
    }
  },
};
