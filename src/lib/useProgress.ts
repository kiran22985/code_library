"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getCourseSnapshot,
  getServerSnapshot,
  resetCourse,
  subscribe,
  toggleLesson,
} from "./progressStore";

/**
 * Per-course lesson progress.
 *
 * The backing store handles both cases — localStorage when signed out, the
 * account when signed in — so components using this hook did not change when
 * accounts were added.
 */
export function useProgress(course: string) {
  const completed = useSyncExternalStore(
    subscribe,
    () => getCourseSnapshot(course),
    getServerSnapshot,
  );

  const toggle = useCallback(
    (slug: string) => toggleLesson(course, slug),
    [course],
  );

  const reset = useCallback(() => resetCourse(course), [course]);

  return {
    completed,
    isDone: (slug: string) => completed.includes(slug),
    toggle,
    reset,
  };
}
