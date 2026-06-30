/**
 * @fileoverview Drizzle ORM schema for the committee app's own Postgres database.
 * @module db/schema
 *
 * This app owns a dedicated `committee` database on the shared VPS Postgres
 * (provisioned by 2026-server-ansible). It is NOT part of the 2026 festival
 * `appdata` namespace and does not share the festival login — it keeps its own
 * `users` / `sessions` plus the `events` / `rsvps` feature.
 *
 * Column JS keys are deliberately snake_case (e.g. `created_at`, `event_date`)
 * so Drizzle query results match the hand-written row interfaces in
 * `@/lib/db` byte-for-byte — every API route and client component already reads
 * those snake_case fields. Timestamp/date columns use `{ mode: "string" }` so
 * they come back as strings (matching the previous @vercel/postgres behavior),
 * not JS `Date` objects.
 *
 * The physical tables are created at runtime by `initializeDatabase()` in
 * `@/lib/db` (CREATE TABLE IF NOT EXISTS), so a fresh `committee` database
 * self-initializes on first boot. Keep this schema in lockstep with that DDL;
 * `drizzle.config.ts` + `drizzle-kit` can also generate/push from here.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    expires_at: timestamp("expires_at", { mode: "string" }).notNull(),
  },
  (table) => [index("idx_sessions_expires_at").on(table.expires_at)],
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    event_date: date("event_date", { mode: "string" }).notNull(),
    event_time: time("event_time").notNull(),
    location: text("location").notNull(),
    created_by: integer("created_by")
      .notNull()
      .references(() => users.id),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_events_event_date_time").on(table.event_date, table.event_time),
    index("idx_events_created_by").on(table.created_by),
  ],
);

export const rsvps = pgTable(
  "rsvps",
  {
    id: serial("id").primaryKey(),
    event_id: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    status: text("status").notNull(),
    comment: text("comment"),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    unique("rsvps_event_id_user_id_key").on(table.event_id, table.user_id),
    check("rsvps_status_check", sql`${table.status} in ('yes', 'no', 'maybe')`),
    index("idx_rsvps_event_id").on(table.event_id),
    index("idx_rsvps_user_id").on(table.user_id),
    index("idx_rsvps_status").on(table.status),
    index("idx_rsvps_event_status").on(table.event_id, table.status),
  ],
);
