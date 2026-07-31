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
  full_name     TEXT,
  phone         TEXT,
  email         TEXT,
  -- Lower-cased copy so "Ada@x.com" and "ada@x.com" are the same account.
  email_key     TEXT,
  -- Legacy from the username-based sign-up; kept nullable so existing rows
  -- survive, but no longer written to.
  username      TEXT,
  username_key  TEXT UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Upgrade path for databases created before accounts moved to email.
-- Every statement is idempotent, so this runs safely on every deploy.
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone     TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email     TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_key TEXT;
ALTER TABLE users ALTER COLUMN username     DROP NOT NULL;
ALTER TABLE users ALTER COLUMN username_key DROP NOT NULL;

-- Unique on the lower-cased email. Postgres allows many NULLs in a unique
-- index, so legacy username-only rows do not collide with each other.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key_idx ON users (email_key);

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
