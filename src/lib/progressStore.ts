"use client";

/**
 * Lesson progress, for signed-out and signed-in visitors alike.
 *
 * - **Signed out** — progress lives in localStorage under the guest namespace.
 * - **Signed in** — the account is the source of truth. localStorage still
 *   holds a copy, but namespaced per user id, so two people using the same
 *   browser never see each other's progress and signing out restores the
 *   guest's own.
 *
 * Guest progress is never merged into an account automatically: a brand-new
 * account starts empty, which is what people expect. `importGuestProgress()`
 * exists for when the visitor explicitly asks to carry it over.
 *
 * Updates are optimistic — the store changes immediately and the API call
 * follows, so a slow connection never makes a completed lesson flicker back.
 */

type Snapshot = Record<string, string[]>;

const PREFIX = "code-library:progress:";
/** Distinguishes `…:u12:python` (an account) from `…:python` (a guest). */
const USER_SCOPED = /^code-library:progress:u\d+:/;
const EMPTY: string[] = [];

let state: Snapshot = {};
let userId: number | null = null;
let initialised = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function storageKey(course: string, forUser = userId): string {
  return forUser === null ? `${PREFIX}${course}` : `${PREFIX}u${forUser}:${course}`;
}

/** Reads every course for one scope: a specific user, or the guest. */
function readScope(forUser: number | null): Snapshot {
  const loaded: Snapshot = {};
  const scopePrefix = forUser === null ? PREFIX : `${PREFIX}u${forUser}:`;

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith(scopePrefix)) continue;
      // The guest prefix is also a prefix of every user key, so filter those out.
      if (forUser === null && USER_SCOPED.test(key)) continue;

      const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
      if (Array.isArray(parsed)) {
        loaded[key.slice(scopePrefix.length)] = parsed as string[];
      }
    }
  } catch {
    // Storage unavailable (private mode, quota) — progress is a nicety.
  }
  return loaded;
}

function writeScope(course: string) {
  try {
    window.localStorage.setItem(
      storageKey(course),
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

/** Loads the guest's stored progress once, on the client. */
export function initProgress() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  state = readScope(null);
  emit();
}

/**
 * Called when the signed-in user changes.
 *
 * On sign-in the cached copy for that account renders immediately, then the
 * server's authoritative copy replaces it. On sign-out the guest's own
 * progress comes back.
 */
export async function setProgressUser(user: { id: number } | null) {
  userId = user?.id ?? null;

  // Show something instantly rather than blanking the UI during the request.
  state = readScope(userId);
  emit();

  if (userId === null) return;

  try {
    const response = await fetch("/api/progress/", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;

    const data: { progress?: Snapshot } = await response.json();
    state = data.progress ?? {};
    emit();
    for (const course of Object.keys(state)) writeScope(course);
  } catch {
    // Offline: keep the cached copy.
  }
}

/**
 * Copies progress made while signed out into the current account. Only ever
 * called from an explicit user action, never automatically.
 */
export async function importGuestProgress(): Promise<boolean> {
  if (userId === null) return false;

  const guest = readScope(null);
  if (Object.keys(guest).length === 0) return false;

  try {
    const response = await fetch("/api/progress/merge/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: guest }),
    });
    if (!response.ok) return false;

    const data: { progress?: Snapshot } = await response.json();
    state = data.progress ?? {};
    emit();
    for (const course of Object.keys(state)) writeScope(course);
    return true;
  } catch {
    return false;
  }
}

/** Lessons recorded while signed out, used to offer the import. */
export function getGuestSnapshot(): Snapshot {
  if (typeof window === "undefined") return {};
  return readScope(null);
}

/**
 * How many lessons are stored against the guest. A primitive, so it is a stable
 * `useSyncExternalStore` snapshot.
 */
export function getGuestCount(): number {
  if (typeof window === "undefined") return 0;
  return Object.values(readScope(null)).reduce(
    (sum, lessons) => sum + lessons.length,
    0,
  );
}

export function toggleLesson(course: string, lesson: string) {
  const current = state[course] ?? EMPTY;
  const done = !current.includes(lesson);

  setCourse(
    course,
    done ? [...current, lesson] : current.filter((slug) => slug !== lesson),
  );
  writeScope(course);

  if (userId === null) return;
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
  writeScope(course);

  if (userId === null) return;
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
