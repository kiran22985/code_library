import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

/** The client calls this once on load to find out who is signed in. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    { user },
    // Sessions are per-user, so this must never be cached by a CDN or browser.
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
