import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { query, queryOne } from "../db";

/**
 * Server-side sessions.
 *
 * The browser gets a random 256-bit token in an httpOnly cookie; the database
 * stores only its SHA-256 hash. That means the cookie cannot be read by
 * JavaScript (so XSS cannot steal it), and a database leak does not hand
 * anyone a usable session. Sessions can also be revoked, which a stateless JWT
 * cannot do.
 */

export const SESSION_COOKIE = "codelibrary_session";
const SESSION_DAYS = 30;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    // Render terminates TLS, so cookies are https-only in production.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

/** Creates a session row and returns the raw token for the cookie. */
export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [hashToken(token), userId, expiresAt],
  );

  return token;
}

export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, cookieOptions());
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}

/** Resolves the signed-in user for the current request, or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await queryOne<{
    id: number;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    created_at: Date;
  }>(
    `SELECT u.id, u.full_name, u.email, u.phone, u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > now()`,
    [hashToken(token)],
  );

  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    createdAt: row.created_at.toISOString(),
  };
}

export async function destroyCurrentSession(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return;
  await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
}

/** Called after login/signup to stop expired rows accumulating. */
export async function pruneExpiredSessions(): Promise<void> {
  await query("DELETE FROM sessions WHERE expires_at < now()");
}
