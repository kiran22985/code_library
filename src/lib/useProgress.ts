"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Per-course lesson progress, persisted in localStorage.
 *
 * The site is statically exported, so there is no account system — progress is
 * device-local. A custom event keeps every mounted consumer (sidebar, course
 * page, pager) in sync without a global store.
 */

const EVENT = "code-library:progress";
const key = (course: string) => `code-library:progress:${course}`;

function read(course: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(course));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function write(course: string, slugs: string[]) {
  try {
    window.localStorage.setItem(key(course), JSON.stringify(slugs));
  } catch {
    // Storage can be unavailable (private mode, quota) — progress is a nicety.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: course }));
}

export function useProgress(course: string) {
  const [completed, setCompleted] = useState<string[]>([]);
  /** False until the first client read, so SSR and first paint agree. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setCompleted(read(course));
    sync();
    setReady(true);

    const onCustom = (event: Event) => {
      if ((event as CustomEvent<string>).detail === course) sync();
    };
    window.addEventListener(EVENT, onCustom);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, onCustom);
      window.removeEventListener("storage", sync);
    };
  }, [course]);

  const toggle = useCallback(
    (slug: string) => {
      const current = read(course);
      const next = current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug];
      write(course, next);
    },
    [course],
  );

  const markDone = useCallback(
    (slug: string) => {
      const current = read(course);
      if (!current.includes(slug)) write(course, [...current, slug]);
    },
    [course],
  );

  const reset = useCallback(() => write(course, []), [course]);

  return {
    completed,
    ready,
    isDone: (slug: string) => completed.includes(slug),
    toggle,
    markDone,
    reset,
  };
}
