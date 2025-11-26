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
   * Each time a session is accessed, its expiration is extended by 7 days.
   * @param {string} sessionId - The session ID to look up
   * @returns {Promise<Session | undefined>} The session object or undefined
   */
  findById: async (sessionId: string): Promise<Session | undefined> => {
    try {
      const result = await sql`
        SELECT * FROM sessions WHERE id = ${sessionId}
      `;
      const session = result.rows[0] as Session | undefined;

      // Extend session expiry by 7 days on each access (sliding expiration)
      if (session) {
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);
        await sql`
          UPDATE sessions SET expires_at = ${newExpiresAt.toISOString()} WHERE id = ${sessionId}
        `;
      }

      return session;
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
