import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { checkRateLimit, clientKey } from "@/lib/auth/rateLimit";
import {
  attachSessionCookie,
  createSession,
  pruneExpiredSessions,
} from "@/lib/auth/session";
import { validatePassword, validateUsername } from "@/lib/auth/validate";

/** Postgres unique-violation error code. */
const UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request, "signup"));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const usernameError = validateUsername(body.username);
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 });

  const passwordError = validatePassword(body.password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const username = (body.username as string).trim();
  const passwordHash = await hashPassword(body.password as string);

  try {
    const user = await queryOne<{ id: number; username: string; created_at: Date }>(
      `INSERT INTO users (username, username_key, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, created_at`,
      [username, username.toLowerCase(), passwordHash],
    );

    if (!user) throw new Error("Insert returned no row");

    const token = await createSession(user.id);
    void pruneExpiredSessions().catch(() => {});

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at.toISOString(),
      },
    });
    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 },
      );
    }
    console.error("signup failed:", error);
    return NextResponse.json(
      { error: "Could not create the account. Please try again." },
      { status: 500 },
    );
  }
}

/** Used by the signup form to tell the user a name is taken before they submit. */
export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("username") ?? "";
  if (validateUsername(username)) {
    return NextResponse.json({ available: false });
  }
  const existing = await query("SELECT 1 FROM users WHERE username_key = $1", [
    username.trim().toLowerCase(),
  ]);
  return NextResponse.json({ available: existing.length === 0 });
}
