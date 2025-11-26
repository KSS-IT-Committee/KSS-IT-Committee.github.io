import 'server-only';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

// Initialize database schema
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

// Initialize on module load
initializeDatabase();

export interface User {
  id: number;
  username: string;
  password: string;
  verified: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

export const userQueries = {
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

export const sessionQueries = {
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
