import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'auth.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize database schema
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('KSS-IT-Committee');

  if (!adminExists) {
    // Create default admin user with password "admin"
    const hashedPassword = bcrypt.hashSync('METRO_KSS_IT_COMMITTEE', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('KSS-IT-Committee', hashedPassword);
    console.log('Default admin user created');
  }
}

// Initialize on module load
initializeDatabase();

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

export const userQueries = {
  findByUsername: (username: string): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  },
};

export const sessionQueries = {
  create: (sessionId: string, userId: number, expiresAt: Date): void => {
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(
      sessionId,
      userId,
      expiresAt.toISOString()
    );
  },

  findById: (sessionId: string): Session | undefined => {
    return db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as Session | undefined;
  },

  delete: (sessionId: string): void => {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  },

  deleteExpired: (): void => {
    db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  },
};

export default db;
