/**
 * Lists the accounts registered on the site, with how far each has got.
 *
 *   npm run users                                  # local database
 *   DATABASE_URL="<external url>" npm run users    # production
 *
 * Read-only: it never writes, and it cannot show passwords — those are stored
 * as scrypt hashes, which is the whole point.
 */
import pg from "pg";

const { Pool } = pg;

function sslFor(connectionString) {
  const override = process.env.DATABASE_SSL;
  if (override === "true") return { rejectUnauthorized: false };
  if (override === "false") return undefined;

  let host = "";
  try {
    host = new URL(connectionString).hostname;
  } catch {
    host = /@([^:/?]+)/.exec(connectionString)?.[1] ?? "";
  }
  const isLocal = ["localhost", "127.0.0.1", "::1", ""].includes(host);
  return isLocal || !host.includes(".") ? undefined : { rejectUnauthorized: false };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "DATABASE_URL is not set.\n" +
        'Production: DATABASE_URL="<External Database URL>" npm run users',
    );
    process.exit(1);
  }

  const pool = new Pool({ connectionString, ssl: sslFor(connectionString) });

  try {
    const { rows } = await pool.query(`
      SELECT u.id,
             coalesce(u.full_name, u.username, '—') AS name,
             coalesce(u.email, '—')                 AS email,
             coalesce(u.phone, '—')                 AS phone,
             to_char(u.created_at, 'YYYY-MM-DD HH24:MI') AS joined,
             count(p.lesson_slug)                        AS lessons,
             count(DISTINCT s.token_hash)                AS sessions,
             to_char(max(p.completed_at), 'YYYY-MM-DD')  AS last_active
        FROM users u
        LEFT JOIN progress p ON p.user_id = u.id
        LEFT JOIN sessions s ON s.user_id = u.id AND s.expires_at > now()
       GROUP BY u.id, u.full_name, u.username, u.email, u.phone, u.created_at
       ORDER BY u.created_at DESC
    `);

    if (rows.length === 0) {
      console.log("No accounts yet.");
      return;
    }

    const pad = (value, width) => String(value ?? "—").padEnd(width);
    console.log(
      `\n${pad("ID", 5)}${pad("NAME", 22)}${pad("EMAIL", 28)}${pad("PHONE", 16)}${pad("JOINED", 18)}${pad("LESSONS", 9)}SESSIONS`,
    );
    console.log("-".repeat(108));
    for (const row of rows) {
      console.log(
        pad(row.id, 5) +
          pad(row.name, 22) +
          pad(row.email, 28) +
          pad(row.phone, 16) +
          pad(row.joined, 18) +
          pad(row.lessons, 9) +
          row.sessions,
      );
    }

    const totals = await pool.query(
      "SELECT count(*)::int AS users, (SELECT count(*)::int FROM progress) AS completions FROM users",
    );
    const { users, completions } = totals.rows[0];
    console.log(
      `\n${users} account${users === 1 ? "" : "s"}, ${completions} lesson completion${completions === 1 ? "" : "s"}.\n`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Could not list users:", error.message);
  process.exit(1);
});
