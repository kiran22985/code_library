"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";

/**
 * "Mark complete" control plus prev/next navigation. Completing a lesson
 * advances to the next one, which is the flow most learners expect.
 */
export function LessonFooter({
  courseSlug,
  slug,
  prev,
  next,
}: {
  courseSlug: string;
  slug: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}) {
  const { isDone, toggle, ready } = useProgress(courseSlug);
  const done = ready && isDone(slug);

  return (
    <div className="mt-14 border-t border-line pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => toggle(slug)}
          suppressHydrationWarning
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            done
              ? "border border-success/40 bg-success/10 text-success"
              : "bg-accent text-on-accent hover:bg-accent-hover"
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {done ? "Completed" : "Mark as complete"}
        </button>

        {next && (
          <Link
            href={`/${courseSlug}/${next.slug}`}
            className="flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg-soft transition hover:border-line-strong hover:text-fg"
          >
            Next lesson
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>

      <nav className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/${courseSlug}/${prev.slug}`}
            className="group rounded-xl border border-line p-4 transition hover:border-accent-line hover:bg-surface"
          >
            <span className="text-xs text-muted">← Previous</span>
            <span className="mt-1 block text-sm font-medium text-fg group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${courseSlug}/${next.slug}`}
            className="group rounded-xl border border-line p-4 text-right transition hover:border-accent-line hover:bg-surface"
          >
            <span className="text-xs text-muted">Next →</span>
            <span className="mt-1 block text-sm font-medium text-fg group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
