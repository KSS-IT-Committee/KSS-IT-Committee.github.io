/**
 * @fileoverview Database utilities and query functions for user, session, event, and RSVP management.
 * @module lib/db
 *
 * This module provides:
 * - Database schema initialization (users, sessions, events, rsvps tables)
 * - User CRUD operations (create, find, check existence)
 * - Session management (create, find, delete, cleanup expired)
 * - Event + RSVP queries
 *
 * Uses Drizzle ORM over the postgres-js driver against the app's own self-hosted
 * `committee` Postgres database (provisioned by 2026-server-ansible). The
 * connection string is read lazily from the `DATABASE_URL` env var (injected at
 * runtime by the deploy infra). bcryptjs handles password hashing in the auth
 * routes.
 *
 * The exported surface (User/Session/Event/RSVP interfaces and the
 * userQueries/sessionQueries/eventQueries/rsvpQueries objects) is unchanged from
 * the previous @vercel/postgres implementation, so every caller keeps working.
 * Behaviour-sensitive SQL (the session sliding-expiration CTE, the COALESCE
 * partial update, window-function attendee counts, and the dynamic event list)
 * is preserved verbatim via db.execute(sql`...`) with ::text casts so timestamp
 * and date columns come back as strings, exactly as before.
 *
 * @requires server-only - Ensures this module cannot be imported in client components
 */
import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { events, rsvps, sessions, users } from "@/db/schema";

const schema = { events, rsvps, sessions, users };
type Db = PostgresJsDatabase<typeof schema>;

// Reuse the pool across HMR reloads in dev to avoid leaking connections.
const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

let cachedDb: Db | undefined;

/**
 * Lazily builds (and memoises) the Drizzle client. DATABASE_URL is read on first
 * use, so merely importing this module never opens a connection — and a build
 * without DATABASE_URL set fails only inside the query helpers' try/catch (which
 * return safe defaults), never at import time.
 */
function getDb(): Db {
  if (cachedDb) return cachedDb;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const client = globalForDb.pgClient ?? postgres(databaseUrl, { max: 10 });
  if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;
  cachedDb = drizzle(client, { schema });
  return cachedDb;
}

const db = new Proxy({} as Db, {
  get: (_target, prop) => {
    const target = getDb();
    const value = Reflect.get(target, prop);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

/**
 * Initializes the database schema by creating required tables.
 *
 * Creates the users, sessions, events, and rsvps tables (and their indexes) if
 * they don't already exist, so a fresh `committee` database self-initializes on
 * first boot. Kept in lockstep with `@/db/schema`. Errors are swallowed (e.g. a
 * build with no DATABASE_URL) so the app keeps running; query failures surface
 * in the individual helpers.
 *
 * @async
 * @private
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  try {
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Create events table
    await db.execute(sql`
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
    `);

    // Create rsvps table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        status TEXT NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `);

    // Create indexes for performance optimization
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_events_event_date_time ON events(event_date, event_time);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON rsvps(user_id);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);`,
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS idx_rsvps_event_status ON rsvps(event_id, status);`,
    );
  } catch (error) {
    console.error(`Database initialization error: ${error}`);
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
  user_rsvp: "yes" | "no" | "maybe" | null;
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
  status: "yes" | "no" | "maybe";
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
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return rows[0] as User | undefined;
    } catch (error) {
      console.error(`Error finding user by username: ${error}`);
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
  create: async (
    username: string,
    hashedPassword: string,
  ): Promise<User | undefined> => {
    try {
      const rows = await db
        .insert(users)
        .values({ username, password: hashedPassword, verified: false })
        .returning();
      return rows[0] as User | undefined;
    } catch (error) {
      console.error(`Error creating user: ${error}`);
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
      const rows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return rows.length > 0;
    } catch (error) {
      console.error(`Error checking if user exists: ${error}`);
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
  create: async (
    sessionId: string,
    userId: number,
    expiresAt: Date,
  ): Promise<void> => {
    try {
      await db.insert(sessions).values({
        id: sessionId,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      });
    } catch (error) {
      console.error(`Error creating session: ${error}`);
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
      const rows = (await db.execute(sql`
        WITH updated AS (
          UPDATE sessions
          SET expires_at = CURRENT_TIMESTAMP + INTERVAL '7 days'
          WHERE id = ${sessionId}
            AND expires_at > CURRENT_TIMESTAMP
            AND expires_at < CURRENT_TIMESTAMP + INTERVAL '6 days 23 hours'
          RETURNING id, user_id, created_at, expires_at
        )
        SELECT id, user_id, created_at::text AS created_at, expires_at::text AS expires_at
        FROM updated
        UNION ALL
        SELECT id, user_id, created_at::text AS created_at, expires_at::text AS expires_at
        FROM sessions
        WHERE id = ${sessionId}
          AND expires_at > CURRENT_TIMESTAMP
          AND NOT EXISTS (SELECT 1 FROM updated)
        LIMIT 1
      `)) as unknown as Session[];

      return rows[0];
    } catch (error) {
      console.error(`Error finding session by id: ${error}`);
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
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    } catch (error) {
      console.error(`Error deleting session: ${error}`);
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
      await db.delete(sessions).where(sql`${sessions.expires_at} < NOW()`);
    } catch (error) {
      console.error(`Error deleting expired sessions: ${error}`);
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
    createdBy: number,
  ): Promise<Event | undefined> => {
    try {
      const rows = await db
        .insert(events)
        .values({
          title,
          description,
          event_date: eventDate,
          event_time: eventTime,
          location,
          created_by: createdBy,
        })
        .returning();
      return rows[0] as Event | undefined;
    } catch (error) {
      console.error(`Error creating event: ${error}`);
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
      isUpcoming?: boolean;
      sortBy?: "date" | "popularity" | "recent";
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<EventWithCounts[]> => {
    const {
      limit,
      offset,
      isUpcoming = false,
      sortBy = "date",
      sortOrder = "asc",
    } = options;

    try {
      // Direction comes from a validated allow-list (asc | desc), so injecting it
      // as raw SQL is safe.
      const dir = sql.raw(sortOrder === "desc" ? "DESC" : "ASC");
      const order =
        sortBy === "popularity"
          ? sql`ORDER BY (COALESCE(ec.yes_count, 0) + COALESCE(ec.maybe_count, 0)) ${dir}, e.event_date ASC`
          : sortBy === "recent"
            ? sql`ORDER BY e.created_at ${dir}`
            : sql`ORDER BY e.event_date ${dir}, e.event_time ${dir}`;

      // event_date / event_time / created_at are cast ::text so they come back as
      // strings (YYYY-MM-DD / HH:MM:SS / timestamp string), matching the row
      // interfaces and what the client renders.
      const query = sql`
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
          WHERE user_id = ${userId}
        )
        SELECT
          e.id,
          e.title,
          e.description,
          e.event_date::text AS event_date,
          e.event_time::text AS event_time,
          e.location,
          e.created_by,
          e.created_at::text AS created_at,
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

      if (isUpcoming) {
        query.append(sql` WHERE e.event_date >= CURRENT_DATE`);
      }
      query.append(sql` ${order}`);
      if (limit !== undefined) {
        query.append(sql` LIMIT ${limit}`);
      }
      if (offset !== undefined) {
        query.append(sql` OFFSET ${offset}`);
      }

      const rows = (await db.execute(query)) as unknown as EventWithCounts[];
      return rows;
    } catch (error) {
      console.error(`Error finding all events: ${error}`);
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
      const rows = (await db.execute(sql`
        SELECT
          e.id,
          e.title,
          e.description,
          e.event_date::text AS event_date,
          e.event_time::text AS event_time,
          e.location,
          e.created_by,
          e.created_at::text AS created_at,
          u.username as creator_username
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ${id}
      `)) as unknown as EventWithCreator[];
      return rows[0];
    } catch (error) {
      console.error(`Error finding event by id: ${error}`);
      return undefined;
    }
  },

  /**
   * Finds an event by ID with attendees and counts in a single query.
   * @param {number} id - Event ID
   * @returns {Promise<{event: EventWithCreator, attendees: RSVPWithUser[], counts: {yes: number, no: number, maybe: number}} | null>}
   */
  findByIdWithAttendees: async (
    id: number,
  ): Promise<{
    event: EventWithCreator;
    attendees: RSVPWithUser[];
    counts: { yes: number; no: number; maybe: number };
  } | null> => {
    try {
      // Get event with creator
      const eventRows = (await db.execute(sql`
        SELECT
          e.id,
          e.title,
          e.description,
          e.event_date::text AS event_date,
          e.event_time::text AS event_time,
          e.location,
          e.created_by,
          e.created_at::text AS created_at,
          u.username as creator_username
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ${id}
      `)) as unknown as EventWithCreator[];

      if (eventRows.length === 0) {
        return null;
      }

      // Get attendees and counts in single query
      const attendeeRows = (await db.execute(sql`
        SELECT
          r.id,
          r.event_id,
          r.user_id,
          r.status,
          r.comment,
          r.created_at::text AS created_at,
          u.username,
          SUM(CASE WHEN r.status = 'yes' THEN 1 ELSE 0 END) OVER() as yes_count,
          SUM(CASE WHEN r.status = 'no' THEN 1 ELSE 0 END) OVER() as no_count,
          SUM(CASE WHEN r.status = 'maybe' THEN 1 ELSE 0 END) OVER() as maybe_count
        FROM rsvps r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.event_id = ${id}
        ORDER BY r.created_at ASC
      `)) as unknown as Array<
        RSVPWithUser & {
          yes_count: string | number;
          no_count: string | number;
          maybe_count: string | number;
        }
      >;

      const attendees = attendeeRows as unknown as RSVPWithUser[];
      const counts =
        attendeeRows.length > 0
          ? {
              yes: Number(attendeeRows[0].yes_count) || 0,
              no: Number(attendeeRows[0].no_count) || 0,
              maybe: Number(attendeeRows[0].maybe_count) || 0,
            }
          : { yes: 0, no: 0, maybe: 0 };

      return {
        event: eventRows[0],
        attendees,
        counts,
      };
    } catch (error) {
      console.error(`Error finding event with attendees: ${error}`);
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
      const rows = await db
        .delete(events)
        .where(and(eq(events.id, id), eq(events.created_by, userId)))
        .returning({ id: events.id });
      return rows.length > 0;
    } catch (error) {
      console.error(`Error deleting event: ${error}`);
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
      const rows = await db
        .delete(events)
        .where(sql`${events.event_date} < CURRENT_DATE - INTERVAL '5 days'`)
        .returning({ id: events.id });
      return rows.length;
    } catch (error) {
      console.error(`Error deleting past events: ${error}`);
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
    },
  ): Promise<Event | null> => {
    try {
      // For description, distinguish between "not provided" (undefined) and
      // "explicitly cleared" (null). COALESCE would treat both as keeping the
      // old value, so we use a CASE expression instead. The other fields keep
      // COALESCE semantics (passing null keeps the existing value).
      const isDescriptionProvided = data.description !== undefined;
      const rows = (await db.execute(sql`
        UPDATE events
        SET
          title = COALESCE(${data.title ?? null}, title),
          description = CASE
            WHEN ${isDescriptionProvided} THEN ${data.description ?? null}
            ELSE description
          END,
          event_date = COALESCE(${data.event_date ?? null}, event_date),
          event_time = COALESCE(${data.event_time ?? null}, event_time),
          location = COALESCE(${data.location ?? null}, location)
        WHERE id = ${id} AND created_by = ${userId}
        RETURNING
          id,
          title,
          description,
          event_date::text AS event_date,
          event_time::text AS event_time,
          location,
          created_by,
          created_at::text AS created_at
      `)) as unknown as Event[];
      return rows[0] ?? null;
    } catch (error) {
      console.error(`Error updating event: ${error}`);
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
   * @param {"yes" | "no" | "maybe"} status - RSVP status
   * @param {string | null} comment - Optional comment
   * @returns {Promise<RSVP | undefined>} The created/updated RSVP
   */
  upsert: async (
    eventId: number,
    userId: number,
    status: "yes" | "no" | "maybe",
    comment: string | null,
  ): Promise<RSVP | undefined> => {
    try {
      const rows = await db
        .insert(rsvps)
        .values({ event_id: eventId, user_id: userId, status, comment })
        .onConflictDoUpdate({
          target: [rsvps.event_id, rsvps.user_id],
          set: { status, comment },
        })
        .returning();
      return rows[0] as RSVP | undefined;
    } catch (error) {
      console.error(`Error upserting RSVP: ${error}`);
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
      const rows = (await db.execute(sql`
        SELECT
          r.id,
          r.event_id,
          r.user_id,
          r.status,
          r.comment,
          r.created_at::text AS created_at,
          u.username
        FROM rsvps r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.event_id = ${eventId}
        ORDER BY r.created_at ASC
      `)) as unknown as RSVPWithUser[];
      return rows;
    } catch (error) {
      console.error(`Error finding RSVPs by event: ${error}`);
      return [];
    }
  },

  /**
   * Gets RSVP counts for an event.
   * @param {number} eventId - Event ID
   * @returns {Promise<{yes: number, no: number, maybe: number}>} RSVP counts
   */
  countByEvent: async (
    eventId: number,
  ): Promise<{ yes: number; no: number; maybe: number }> => {
    try {
      const rows = (await db.execute(sql`
        SELECT
          COALESCE(SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END), 0)::int as yes,
          COALESCE(SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END), 0)::int as no,
          COALESCE(SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END), 0)::int as maybe
        FROM rsvps WHERE event_id = ${eventId}
      `)) as unknown as Array<{ yes: number; no: number; maybe: number }>;
      return rows[0];
    } catch (error) {
      console.error(`Error counting RSVPs: ${error}`);
      return { yes: 0, no: 0, maybe: 0 };
    }
  },
};
