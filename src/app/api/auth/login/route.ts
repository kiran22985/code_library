import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { burnTime, verifyPassword } from "@/lib/auth/password";
import { checkRateLimit, clientKey, resetRateLimit } from "@/lib/auth/rateLimit";
import { attachSessionCookie, createSession } from "@/lib/auth/session";

/** Deliberately vague: never reveal whether the username or password was wrong. */
const GENERIC_ERROR = "Incorrect username or password.";

export async function POST(request: Request) {
  const key = clientKey(request, "login");
  const limit = checkRateLimit(key);
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

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const user = await queryOne<{
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
  }>(
    `SELECT id, username, password_hash, created_at
       FROM users
      WHERE username_key = $1`,
    [username.toLowerCase()],
  );

  if (!user) {
    // Spend the same time as a real verification so response timing does not
    // reveal which usernames exist.
    await burnTime(password);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  resetRateLimit(key);
  const token = await createSession(user.id);

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.created_at.toISOString(),
    },
  });
  attachSessionCookie(response, token);
  return response;
}
