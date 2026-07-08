-- Optional D1 schema for multiplayer match history (future use).
-- Apply with:  wrangler d1 execute dusk-db --file=worker/schema.sql
CREATE TABLE IF NOT EXISTS mp_match (
  id        TEXT PRIMARY KEY,
  code      TEXT NOT NULL,
  seed      INTEGER NOT NULL,
  players   INTEGER NOT NULL,
  winner    INTEGER,
  started_at INTEGER NOT NULL,
  ended_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_mp_match_code ON mp_match(code);
