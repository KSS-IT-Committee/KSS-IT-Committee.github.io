declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// Cloudflare D1 Database types
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T[]>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results?: T;
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
    last_row_id?: number;
    changed_db: boolean;
    changes?: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Cloudflare Environment bindings
interface CloudflareEnv {
  kss_it_committee_db: D1Database;
}
