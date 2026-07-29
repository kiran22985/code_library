"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Per-course lesson progress, persisted in localStorage.
 *
 * The site is statically exported, so there is no account system — progress is
 * device-local. localStorage is an external store, so it is read through
 * `useSyncExternalStore`: that keeps server and hydration renders consistent
 * and keeps every mounted consumer (sidebar, course page, pager) in sync
 * without a global state library.
 */

const EVENT = "code-library:progress";
const EMPTY: string[] = [];
const key = (course: string) => `code-library:progress:${course}`;

/** Snapshots must be referentially stable, so parsed values are memoised. */
const cache = new Map<string, { raw: string | null; value: string[] }>();

function readSnapshot(course: string): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key(course));
  } catch {
    return EMPTY;
  }

  const cached = cache.get(course);
  if (cached && cached.raw === raw) return cached.value;

  let value = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed as string[];
  } catch {
    value = EMPTY;
  }

  cache.set(course, { raw, value });
  return value;
}

function write(course: string, slugs: string[]) {
  try {
    window.localStorage.setItem(key(course), JSON.stringify(slugs));
  } catch {
    // Storage can be unavailable (private mode, quota) — progress is a nicety.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: course }));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useProgress(course: string) {
  const completed = useSyncExternalStore(
    subscribe,
    () => readSnapshot(course),
    () => EMPTY,
  );

  const toggle = useCallback(
    (slug: string) => {
      const current = readSnapshot(course);
      write(
        course,
        current.includes(slug)
          ? current.filter((entry) => entry !== slug)
          : [...current, slug],
      );
    },
    [course],
  );

  const markDone = useCallback(
    (slug: string) => {
      const current = readSnapshot(course);
      if (!current.includes(slug)) write(course, [...current, slug]);
    },
    [course],
  );

  const reset = useCallback(() => write(course, []), [course]);

  return {
    completed,
    isDone: (slug: string) => completed.includes(slug),
    toggle,
    markDone,
    reset,
  };
}
