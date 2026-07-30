/**
 * Creates the database schema. Safe to run repeatedly — every statement is
 * `IF NOT EXISTS`, so it runs on every deploy before the server starts.
 *
 *   npm run migrate
 */
import pg from "pg";

const { Pool } = pg;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT        NOT NULL,
  -- Lower-cased copy so "Ada" and "ada" cannot both be registered.
  username_key  TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessions are stored server-side so they can be revoked. The cookie holds a
-- random token; only its SHA-256 hash is stored here, so a database leak does
-- not hand out working sessions.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT        PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx  ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx  ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS progress (
  user_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug  TEXT        NOT NULL,
  lesson_slug  TEXT        NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_slug, lesson_slug)
);
`;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is not set.\n" +
        "Local: copy .env.example to .env.local and point it at Postgres.\n" +
        "Render: the Blueprint wires it in from the database automatically.",
    );
    process.exit(1);
  }

  // Must match the detection in src/lib/db.ts: no TLS for a local database or
  // for Render's internal hostname (`dpg-…-a`, which has no dots), TLS for any
  // public managed host. Override with DATABASE_SSL=true|false.
  let host = "";
  try {
    host = new URL(process.env.DATABASE_URL).hostname;
  } catch {
    host = /@([^:/?]+)/.exec(process.env.DATABASE_URL)?.[1] ?? "";
  }

  const override = process.env.DATABASE_SSL;
  const useSsl =
    override === "true"
      ? true
      : override === "false"
        ? false
        : host.includes(".") &&
          !["localhost", "127.0.0.1", "::1"].includes(host);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await pool.query(SCHEMA);
    // Housekeeping: drop sessions that expired while the app was down.
    const { rowCount } = await pool.query(
      "DELETE FROM sessions WHERE expires_at < now()",
    );
    console.log(`Schema is up to date. Removed ${rowCount ?? 0} expired sessions.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
