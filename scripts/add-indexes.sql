-- Performance optimization: Add database indexes for frequently queried columns
-- Run this once to improve query performance

-- Index for sessions table - frequently queried by id and expires_at
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Index for events table - frequently ordered and filtered by date/time
CREATE INDEX IF NOT EXISTS idx_events_event_date_time ON events(event_date, event_time);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Index for rsvps table - frequently joined on event_id and filtered by user_id
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

-- Composite index for common query pattern (event_id, status)
CREATE INDEX IF NOT EXISTS idx_rsvps_event_status ON rsvps(event_id, status);

-- Index for users table - frequently queried by username
-- Note: username already has UNIQUE constraint which creates an index automatically

-- Display indexes created
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = "public"
ORDER BY tablename, indexname;
