/**
 * @fileoverview Database utilities and query functions for user and session management.
 * @module lib/db
 *
 * This module provides:
 * - Database schema initialization (users and sessions tables)
 * - User CRUD operations (create, find, check existence)
 * - Session management (create, find, delete, cleanup expired)
 *
 * Uses Vercel Postgres (Neon) as the database backend with bcryptjs for password hashing.
 *
 * @requires server-only - Ensures this module cannot be imported in client components
 */
import 'server-only';
import { sql } from '@vercel/postgres';

/**
 * Initializes the database schema by creating required tables.
 *
 * Creates the following tables if they don't exist:
 * - users: Stores user credentials and verification status
 * - sessions: Stores active user sessions with expiration
 *
 * @async
 * @private
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // // Add verified column if it doesn't exist (for existing databases)
    // await sql`
    //   ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
    // `;

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        event_time TIME NOT NULL,
        location TEXT NOT NULL,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create rsvps table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        status TEXT NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `;

    // Create indexes for performance optimization
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_event_date_time ON events(event_date, event_time);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON rsvps(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_event_status ON rsvps(event_id, status);`;

    // // Check if admin user exists
    // const adminResult = await sql`
    //   SELECT id FROM users WHERE username = 'KSS-IT-Committee'
    // `;

    // if (adminResult.rows.length === 0) {
    //   // Create default admin user
    //   const hashedPassword = bcrypt.hashSync('METRO_KSS_IT_COMMITTEE', 10);
    //   await sql`
    //     INSERT INTO users (username, password, verified)
    //     VALUES ('KSS-IT-Committee', ${hashedPassword}, TRUE)
    //   `;
    //   console.log('Default admin user created');
    // }
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw - let the app continue, errors will be caught in queries
  }
}

// Initialize database schema on module load
initializeDatabase();

/**
 * Represents a user in the database.
 * @interface User
 */
export interface User {
  id: number;
  username: string;
  password: string;
  verified: boolean;
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
      const result = await sql`
        SELECT * FROM users WHERE username = ${username}
      `;
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return undefined;
    }
  },

  /**
   * Creates a new user with the given credentials.
   * New users are created with verified=false and require admin approval.
   * @param {string} username - The username for the new user
   * @param {string} hashedPassword - The bcrypt-hashed password
   * @returns {Promise<User | undefined>} The created user object
   * @throws {Error} If user creation fails
   */
  create: async (username: string, hashedPassword: string): Promise<User | undefined> => {
    try {
      const result = await sql`
        INSERT INTO users (username, password, verified)
        VALUES (${username}, ${hashedPassword}, FALSE)
        RETURNING *
      `;
      return result.rows[0] as User | undefined;
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
      const result = await sql`
        SELECT 1 FROM users WHERE username = ${username}
      `;
      return result.rows.length > 0;
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
      await sql`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
      `;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  /**
   * Finds a session by ID and extends its expiration (sliding expiration).
   * Only extends expiration if session is valid and more than 1 hour old to reduce DB writes.
   * Returns undefined if session is expired or doesn't exist.
   * @param {string} sessionId - The session ID to look up
   * @returns {Promise<Session | undefined>} The session object or undefined if expired/not found
   */
  findById: async (sessionId: string): Promise<Session | undefined> => {
    try {
      // Combined query: select and conditionally update in one database round-trip
      // IMPORTANT: Only process sessions that are NOT expired
      const result = await sql`
        WITH updated AS (
          UPDATE sessions
          SET expires_at = CURRENT_TIMESTAMP + INTERVAL '7 days'
          WHERE id = ${sessionId}
            AND expires_at > CURRENT_TIMESTAMP
            AND expires_at < CURRENT_TIMESTAMP + INTERVAL '6 days 23 hours'
          RETURNING *
        )
        SELECT * FROM updated
        UNION ALL
        SELECT * FROM sessions
        WHERE id = ${sessionId}
          AND expires_at > CURRENT_TIMESTAMP
          AND NOT EXISTS (SELECT 1 FROM updated)
        LIMIT 1
      `;

      return result.rows[0] as Session | undefined;
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
      await sql`
        DELETE FROM sessions WHERE id = ${sessionId}
      `;
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
      await sql`
        DELETE FROM sessions WHERE expires_at < NOW()
      `;
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
      const result = await sql`
        INSERT INTO events (title, description, event_date, event_time, location, created_by)
        VALUES (${title}, ${description}, ${eventDate}, ${eventTime}, ${location}, ${createdBy})
        RETURNING *
      `;
      return result.rows[0] as Event | undefined;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Finds all events with RSVP counts and the current user's RSVP status.
   * @param {number} userId - Current user's ID for checking their RSVP
   * @param {object} options - Pagination, filtering, and sorting options
   * @returns {Promise<EventWithCounts[]>} Array of events with counts
   */
  findAll: async (
    userId: number,
    options: {
      limit?: number;
      offset?: number;
      upcoming?: boolean;
      sortBy?: 'date' | 'popularity' | 'recent';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<EventWithCounts[]> => {
    const {
      limit,
      offset,
      upcoming = false,
      sortBy = 'date',
      sortOrder = 'asc'
    } = options;

    try {
      // Build the base query
      let query = `
        WITH event_counts AS (
          SELECT
            event_id,
            COUNT(*) FILTER (WHERE status = 'yes') as yes_count,
            COUNT(*) FILTER (WHERE status = 'no') as no_count,
            COUNT(*) FILTER (WHERE status = 'maybe') as maybe_count
          FROM rsvps
          GROUP BY event_id
        ),
        user_rsvps AS (
          SELECT event_id, status as user_rsvp
          FROM rsvps
          WHERE user_id = $1
        )
        SELECT
          e.*,
          u.username as creator_username,
          COALESCE(ec.yes_count, 0)::int as yes_count,
          COALESCE(ec.no_count, 0)::int as no_count,
          COALESCE(ec.maybe_count, 0)::int as maybe_count,
          ur.user_rsvp
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        LEFT JOIN event_counts ec ON e.id = ec.event_id
        LEFT JOIN user_rsvps ur ON e.id = ur.event_id
      `;

      // Add WHERE clause if filtering upcoming events
      if (upcoming) {
        query += ' WHERE e.event_date >= CURRENT_DATE';
      }

      // Add ORDER BY clause based on sort options
      if (sortBy === 'popularity') {
        query += ` ORDER BY (COALESCE(ec.yes_count, 0) + COALESCE(ec.maybe_count, 0)) ${sortOrder === 'desc' ? 'DESC' : 'ASC'}, e.event_date ASC`;
      } else if (sortBy === 'recent') {
        query += ` ORDER BY e.created_at ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      } else {
        query += ` ORDER BY e.event_date ${sortOrder === 'desc' ? 'DESC' : 'ASC'}, e.event_time ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }

      // Add pagination
      const params: (number | undefined)[] = [userId];
      let paramIndex = 2;

      if (limit !== undefined) {
        query += ` LIMIT $${paramIndex}`;
        params.push(limit);
        paramIndex++;
      }

      if (offset !== undefined) {
        query += ` OFFSET $${paramIndex}`;
        params.push(offset);
      }

      const result = await sql.query(query, params);
      return result.rows as EventWithCounts[];
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
      const result = await sql`
        SELECT e.*, u.username as creator_username
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ${id}
      `;
      return result.rows[0] as EventWithCreator | undefined;
    } catch (error) {
      console.error('Error finding event by id:', error);
      return undefined;
    }
  },

  /**
   * Finds an event by ID with attendees and counts in a single query.
   * @param {number} id - Event ID
   * @returns {Promise<{event: EventWithCreator, attendees: RSVPWithUser[], counts: {yes: number, no: number, maybe: number}} | null>}
   */
  findByIdWithAttendees: async (
    id: number
  ): Promise<{
    event: EventWithCreator;
    attendees: RSVPWithUser[];
    counts: { yes: number; no: number; maybe: number };
  } | null> => {
    try {
      // Get event with creator
      const eventResult = await sql`
        SELECT e.*, u.username as creator_username
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ${id}
      `;

      if (eventResult.rows.length === 0) {
        return null;
      }

      // Get attendees and counts in single query
      const attendeesResult = await sql`
        SELECT
          r.*,
          u.username,
          SUM(CASE WHEN r.status = 'yes' THEN 1 ELSE 0 END) OVER() as yes_count,
          SUM(CASE WHEN r.status = 'no' THEN 1 ELSE 0 END) OVER() as no_count,
          SUM(CASE WHEN r.status = 'maybe' THEN 1 ELSE 0 END) OVER() as maybe_count
        FROM rsvps r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.event_id = ${id}
        ORDER BY r.created_at ASC
      `;

      const attendees = attendeesResult.rows as RSVPWithUser[];
      const counts = attendees.length > 0
        ? {
            yes: Number(attendeesResult.rows[0].yes_count) || 0,
            no: Number(attendeesResult.rows[0].no_count) || 0,
            maybe: Number(attendeesResult.rows[0].maybe_count) || 0,
          }
        : { yes: 0, no: 0, maybe: 0 };

      return {
        event: eventResult.rows[0] as EventWithCreator,
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
      const result = await sql`
        DELETE FROM events WHERE id = ${id} AND created_by = ${userId}
        RETURNING id
      `;
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  /**
   * Deletes all events that are more than 5 days old.
   * Events remain visible for 5 days after they occur before being deleted.
   * @returns {Promise<number>} Number of events deleted
   */
  deletePastEvents: async (): Promise<number> => {
    try {
      const result = await sql`
        DELETE FROM events
        WHERE event_date < CURRENT_DATE - INTERVAL '5 days'
        RETURNING id
      `;
      return result.rows.length;
    } catch (error) {
      console.error('Error deleting past events:', error);
      return 0;
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
      const result = await sql`
        UPDATE events
        SET
          title = COALESCE(${data.title ?? null}, title),
          description = COALESCE(${data.description ?? null}, description),
          event_date = COALESCE(${data.event_date ?? null}, event_date),
          event_time = COALESCE(${data.event_time ?? null}, event_time),
          location = COALESCE(${data.location ?? null}, location)
        WHERE id = ${id} AND created_by = ${userId}
        RETURNING *
      `;
      return (result.rows[0] as Event) || null;
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
      const result = await sql`
        INSERT INTO rsvps (event_id, user_id, status, comment)
        VALUES (${eventId}, ${userId}, ${status}, ${comment})
        ON CONFLICT (event_id, user_id)
        DO UPDATE SET status = ${status}, comment = ${comment}
        RETURNING *
      `;
      return result.rows[0] as RSVP | undefined;
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
      const result = await sql`
        SELECT r.*, u.username
        FROM rsvps r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.event_id = ${eventId}
        ORDER BY r.created_at ASC
      `;
      return result.rows as RSVPWithUser[];
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
      const result = await sql`
        SELECT
          COALESCE(SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END), 0)::int as yes,
          COALESCE(SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END), 0)::int as no,
          COALESCE(SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END), 0)::int as maybe
        FROM rsvps WHERE event_id = ${eventId}
      `;
      return result.rows[0] as { yes: number; no: number; maybe: number };
    } catch (error) {
      console.error('Error counting RSVPs:', error);
      return { yes: 0, no: 0, maybe: 0 };
    }
  },
};
