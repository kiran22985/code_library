import "server-only";
import { Pool, type QueryResultRow } from "pg";

/**
 * A single shared connection pool.
 *
 * It is cached on `globalThis` because Next reloads modules on every edit in
 * development — without the cache each reload would open a new pool and
 * eventually exhaust Postgres connections.
 */
const globalForDb = globalThis as unknown as { codeLibraryPool?: Pool };

function isLocal(connectionString: string) {
  return /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString);
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and point it at a Postgres database.",
    );
  }

  globalForDb.codeLibraryPool ??= new Pool({
    connectionString,
    // Managed Postgres (Render, Neon, Supabase) requires TLS and presents a
    // certificate the Node trust store does not know; a local database does not.
    ssl: isLocal(connectionString) ? undefined : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return globalForDb.codeLibraryPool;
}

/** Runs a parameterised query. Never interpolate values into the SQL string. */
export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

/** Returns the first row, or null. */
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
