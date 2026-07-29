import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { isValidSlug } from "@/lib/auth/validate";

/**
 * Called right after sign-in: the browser sends whatever progress it recorded
 * while signed out, and gets back the union of that and the account's saved
 * progress.
 *
 * Merging rather than overwriting means someone who worked through six lessons
 * anonymously and then created an account keeps those six lessons.
 */

/** Guards against a huge payload turning into a huge INSERT. */
const MAX_LESSONS = 2_000;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { progress?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const incoming = body.progress;
  const pairs: { course: string; lesson: string }[] = [];

  if (incoming && typeof incoming === "object") {
    for (const [course, lessons] of Object.entries(incoming as Record<string, unknown>)) {
      if (!isValidSlug(course) || !Array.isArray(lessons)) continue;
      for (const lesson of lessons) {
        if (isValidSlug(lesson)) pairs.push({ course, lesson });
        if (pairs.length >= MAX_LESSONS) break;
      }
    }
  }

  if (pairs.length > 0) {
    // One statement with UNNEST rather than a query per lesson.
    await query(
      `INSERT INTO progress (user_id, course_slug, lesson_slug)
       SELECT $1, course, lesson
         FROM UNNEST($2::text[], $3::text[]) AS t(course, lesson)
       ON CONFLICT (user_id, course_slug, lesson_slug) DO NOTHING`,
      [user.id, pairs.map((p) => p.course), pairs.map((p) => p.lesson)],
    );
  }

  const rows = await query<{ course_slug: string; lesson_slug: string }>(
    `SELECT course_slug, lesson_slug FROM progress WHERE user_id = $1`,
    [user.id],
  );

  const progress: Record<string, string[]> = {};
  for (const row of rows) {
    (progress[row.course_slug] ??= []).push(row.lesson_slug);
  }

  return NextResponse.json(
    { progress },
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
