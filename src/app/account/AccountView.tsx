"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getAllSnapshot, subscribe } from "@/lib/progressStore";

const EMPTY: Record<string, string[]> = {};

export function AccountView({
  courses,
}: {
  courses: { slug: string; title: string; icon: string; lessons: number }[];
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const progress = useSyncExternalStore(
    subscribe,
    getAllSnapshot,
    () => EMPTY,
  );

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted">
        Loading your account…
      </div>
    );
  }

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const totalDone = Object.values(progress).reduce(
    (sum, lessons) => sum + lessons.length,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <header className="flex flex-wrap items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent text-xl font-semibold text-on-accent">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            {user.username}
          </h1>
          <p className="text-sm text-muted">
            Member since {joined} · {totalDone} lesson
            {totalDone === 1 ? "" : "s"} completed
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout().then(() => router.push("/"))}
          className="ml-auto rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg-soft transition hover:border-danger/50 hover:text-danger"
        >
          Sign out
        </button>
      </header>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Your courses
        </h2>

        <div className="mt-4 space-y-3">
          {courses.map((course) => {
            const done = progress[course.slug]?.length ?? 0;
            const percent = course.lessons
              ? Math.round((done / course.lessons) * 100)
              : 0;
            return (
              <Link
                key={course.slug}
                href={`/${course.slug}`}
                className="block rounded-2xl border border-line bg-surface p-5 transition hover:border-accent-line"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{course.icon}</span>
                  <span className="font-medium text-fg">{course.title}</span>
                  <span className="ml-auto font-mono text-sm text-accent">
                    {done}/{course.lessons}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-[width] duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-bg-soft p-5">
        <h2 className="font-semibold text-fg">About your data</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your account stores a username, a hashed password and the lessons you
          have completed — nothing else. Passwords are hashed with scrypt and are
          never stored or logged in readable form.
        </p>
      </section>
    </div>
  );
}
