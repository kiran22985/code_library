"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";

/** Shown on the course overview page: resume point, percentage, reset. */
export function CourseProgressPanel({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: { slug: string; title: string }[];
}) {
  const { completed, ready, reset } = useProgress(courseSlug);
  const done = completed.length;
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const nextLesson =
    lessons.find((lesson) => !completed.includes(lesson.slug)) ?? lessons[0];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-fg">Your progress</p>
        <span suppressHydrationWarning className="font-mono text-sm text-accent">
          {ready ? `${done}/${lessons.length}` : `0/${lessons.length}`}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-[width] duration-700"
          style={{ width: ready ? `${percent}%` : "0%" }}
        />
      </div>

      <Link
        href={`/${courseSlug}/${nextLesson.slug}`}
        className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
      >
        <span className="min-w-0">
          <span className="block text-xs opacity-80" suppressHydrationWarning>
            {ready && done > 0 ? "Continue with" : "Start with"}
          </span>
          <span className="block truncate">{nextLesson.title}</span>
        </span>
        <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {ready && done > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 w-full text-xs text-muted transition hover:text-danger"
        >
          Reset progress
        </button>
      )}
    </div>
  );
}
