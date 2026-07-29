import { NextResponse } from "next/server";
import { clearSessionCookie, destroyCurrentSession } from "@/lib/auth/session";

export async function POST() {
  // Delete the row first so the token stops working even if the browser keeps
  // the cookie for some reason.
  await destroyCurrentSession();

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
