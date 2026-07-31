import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { checkRateLimit, clientKey } from "@/lib/auth/rateLimit";
import {
  attachSessionCookie,
  createSession,
  pruneExpiredSessions,
} from "@/lib/auth/session";
import {
  emailKey,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
} from "@/lib/auth/validate";

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

  let body: {
    fullName?: unknown;
    phone?: unknown;
    email?: unknown;
    password?: unknown;
    confirmPassword?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Checked in the order the fields appear on the form, so the message the user
  // sees points at the first field that needs attention.
  const problem =
    validateFullName(body.fullName) ??
    validatePhone(body.phone) ??
    validateEmail(body.email) ??
    validatePassword(body.password) ??
    validatePasswordConfirmation(body.password, body.confirmPassword);

  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const fullName = (body.fullName as string).trim();
  const phone = (body.phone as string).trim();
  const email = (body.email as string).trim();
  const passwordHash = await hashPassword(body.password as string);

  try {
    const user = await queryOne<{
      id: number;
      full_name: string;
      email: string;
      phone: string;
      created_at: Date;
    }>(
      `INSERT INTO users (full_name, phone, email, email_key, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, created_at`,
      [fullName, phone, email, emailKey(email), passwordHash],
    );

    if (!user) throw new Error("Insert returned no row");

    const token = await createSession(user.id);
    void pruneExpiredSessions().catch(() => {});

    const response = NextResponse.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at.toISOString(),
      },
    });
    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
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

/** Lets the signup form warn about a taken email before the user submits. */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email") ?? "";
  if (validateEmail(email)) {
    return NextResponse.json({ available: false });
  }
  const existing = await query("SELECT 1 FROM users WHERE email_key = $1", [
    emailKey(email),
  ]);
  return NextResponse.json({ available: existing.length === 0 });
}
