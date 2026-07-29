"use client";

/**
 * Lesson progress, for signed-out and signed-in visitors alike.
 *
 * - **Signed out** — progress lives in localStorage, exactly as before.
 * - **Signed in** — the server is the source of truth, and localStorage keeps
 *   working as an offline cache so the UI never blocks on a request.
 *
 * Updates are optimistic: the store changes immediately and the API call
 * follows. If that call fails the local value stays, so a flaky connection
 * cannot make a completed lesson appear to un-complete itself.
 */

type Snapshot = Record<string, string[]>;

const LS_PREFIX = "code-library:progress:";
const EMPTY: string[] = [];

let state: Snapshot = {};
let signedIn = false;
let initialised = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readLocal(): Snapshot {
  const loaded: Snapshot = {};
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith(LS_PREFIX)) continue;
      const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
      if (Array.isArray(parsed)) loaded[key.slice(LS_PREFIX.length)] = parsed as string[];
    }
  } catch {
    // Storage unavailable (private mode, quota) — progress is a nicety.
  }
  return loaded;
}

function writeLocal(course: string) {
  try {
    window.localStorage.setItem(
      `${LS_PREFIX}${course}`,
      JSON.stringify(state[course] ?? []),
    );
  } catch {
    // Ignore.
  }
}

function setCourse(course: string, lessons: string[]) {
  state = { ...state, [course]: lessons };
  emit();
}

/** Loads localStorage once, on the client. */
export function initProgress() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  state = readLocal();
  emit();
}

/**
 * Called when the signed-in user changes. On sign-in the local progress is
 * pushed up and merged; on sign-out the store falls back to localStorage.
 */
export async function setProgressUser(userPresent: boolean) {
  signedIn = userPresent;
  if (!userPresent) {
    state = readLocal();
    emit();
    return;
  }

  try {
    const response = await fetch("/api/progress/merge/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: state }),
    });
    if (!response.ok) return;

    const data: { progress?: Snapshot } = await response.json();
    state = data.progress ?? {};
    emit();
    for (const course of Object.keys(state)) writeLocal(course);
  } catch {
    // Offline: keep whatever is cached locally.
  }
}

export function toggleLesson(course: string, lesson: string) {
  const current = state[course] ?? EMPTY;
  const done = !current.includes(lesson);

  setCourse(
    course,
    done ? [...current, lesson] : current.filter((slug) => slug !== lesson),
  );
  writeLocal(course);

  if (!signedIn) return;
  void fetch("/api/progress/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course, lesson, done }),
  }).catch(() => {
    // Keep the optimistic value; localStorage already has it.
  });
}

export function resetCourse(course: string) {
  setCourse(course, []);
  writeLocal(course);

  if (!signedIn) return;
  void fetch(`/api/progress/?course=${encodeURIComponent(course)}`, {
    method: "DELETE",
  }).catch(() => {});
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCourseSnapshot(course: string): string[] {
  return state[course] ?? EMPTY;
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

export function getAllSnapshot(): Snapshot {
  return state;
}
