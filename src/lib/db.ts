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

function hostOf(connectionString: string): string {
  try {
    return new URL(connectionString).hostname;
  } catch {
    // Fall back to a regex if the password contains characters that break URL().
    return /@([^:/?]+)/.exec(connectionString)?.[1] ?? "";
  }
}

/**
 * Whether to use TLS, which differs by host:
 *
 * - Local Postgres: no TLS.
 * - Render's *internal* hostname (`dpg-…-a`, no dots): plain TCP inside their
 *   private network. Forcing TLS here fails with "The server does not support
 *   SSL connections".
 * - Anything else — Render external, Neon, Supabase: TLS required, with a
 *   certificate chain the Node trust store does not recognise.
 *
 * Set `DATABASE_SSL=true|false` to override the detection.
 */
function sslSetting(connectionString: string) {
  const override = process.env.DATABASE_SSL;
  if (override === "false") return undefined;
  if (override === "true") return { rejectUnauthorized: false };

  const host = hostOf(connectionString);
  const isLocal = ["localhost", "127.0.0.1", "::1", ""].includes(host);
  const isPrivateHostname = !host.includes(".");

  return isLocal || isPrivateHostname ? undefined : { rejectUnauthorized: false };
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
    ssl: sslSetting(connectionString),
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
