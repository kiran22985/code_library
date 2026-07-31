import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { burnTime, verifyPassword } from "@/lib/auth/password";
import { checkRateLimit, clientKey, resetRateLimit } from "@/lib/auth/rateLimit";
import { attachSessionCookie, createSession } from "@/lib/auth/session";
import { emailKey } from "@/lib/auth/validate";

/** Deliberately vague: never reveal whether the email or the password was wrong. */
const GENERIC_ERROR = "Incorrect email or password.";

export async function POST(request: Request) {
  const key = clientKey(request, "login");
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const user = await queryOne<{
    id: number;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    password_hash: string;
    created_at: Date;
  }>(
    `SELECT id, full_name, email, phone, password_hash, created_at
       FROM users
      WHERE email_key = $1`,
    [emailKey(email)],
  );

  if (!user) {
    // Spend the same time as a real verification so response timing does not
    // reveal which addresses have accounts.
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
      fullName: user.full_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      createdAt: user.created_at.toISOString(),
    },
  });
  attachSessionCookie(response, token);
  return response;
}
