import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { isValidSlug } from "@/lib/auth/validate";

/**
 * Per-user lesson progress.
 *
 * Shape on the wire is `{ progress: { python: ["intro", "variables"] } }` —
 * small enough to send in one request, so the client can keep the whole map in
 * memory and render instantly.
 */

const NO_STORE = { "Cache-Control": "no-store, private" };

function unauthorised() {
  return NextResponse.json({ error: "Not signed in." }, { status: 401 });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorised();

  const rows = await query<{ course_slug: string; lesson_slug: string }>(
    `SELECT course_slug, lesson_slug
       FROM progress
      WHERE user_id = $1
      ORDER BY completed_at`,
    [user.id],
  );

  const progress: Record<string, string[]> = {};
  for (const row of rows) {
    (progress[row.course_slug] ??= []).push(row.lesson_slug);
  }

  return NextResponse.json({ progress }, { headers: NO_STORE });
}

/** Marks one lesson complete or incomplete. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorised();

  let body: { course?: unknown; lesson?: unknown; done?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidSlug(body.course) || !isValidSlug(body.lesson)) {
    return NextResponse.json({ error: "Invalid course or lesson." }, { status: 400 });
  }

  if (body.done === false) {
    await query(
      `DELETE FROM progress
        WHERE user_id = $1 AND course_slug = $2 AND lesson_slug = $3`,
      [user.id, body.course, body.lesson],
    );
  } else {
    await query(
      `INSERT INTO progress (user_id, course_slug, lesson_slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, course_slug, lesson_slug) DO NOTHING`,
      [user.id, body.course, body.lesson],
    );
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

/** Clears progress for one course, or for every course when none is given. */
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorised();

  const course = new URL(request.url).searchParams.get("course");

  if (course === null) {
    await query("DELETE FROM progress WHERE user_id = $1", [user.id]);
  } else {
    if (!isValidSlug(course)) {
      return NextResponse.json({ error: "Invalid course." }, { status: 400 });
    }
    await query("DELETE FROM progress WHERE user_id = $1 AND course_slug = $2", [
      user.id,
      course,
    ]);
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
