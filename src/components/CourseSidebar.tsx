"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/useProgress";

export interface SidebarModule {
  id: string;
  title: string;
  lessons: { slug: string; title: string; minutes: number }[];
}

/**
 * Course navigation rail. Collapsible on mobile, sticky on desktop, and it
 * shows completion state pulled from localStorage.
 */
export function CourseSidebar({
  courseSlug,
  modules,
}: {
  courseSlug: string;
  modules: SidebarModule[];
}) {
  const pathname = usePathname();
  const { completed, ready } = useProgress(courseSlug);
  const [open, setOpen] = useState(false);
  const activeRef = useRef<HTMLAnchorElement>(null);

  const currentSlug = pathname.split("/").filter(Boolean)[1];
  const total = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const done = completed.length;

  useEffect(() => setOpen(false), [pathname]);

  // Keep the active lesson visible when the rail is taller than the viewport.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="sticky top-16 z-30 flex w-full items-center gap-2 border-b border-line bg-bg/90 px-4 py-3 text-sm font-medium text-fg backdrop-blur lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
        Course contents
        <span className="ml-auto text-xs text-muted">
          {ready ? `${done}/${total}` : `${total} lessons`}
        </span>
      </button>

      <nav
        aria-label="Course contents"
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-bg px-2 py-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-0 lg:border-r lg:pr-4 scroll-thin`}
      >
        <div className="mb-5 px-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-medium uppercase tracking-wider">Progress</span>
            <span suppressHydrationWarning>
              {ready ? `${Math.round((done / total) * 100)}%` : "—"}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: ready ? `${(done / total) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-5">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <span className="mr-1.5 text-accent">
                {String(moduleIndex + 1).padStart(2, "0")}
              </span>
              {module.title}
            </p>
            <ul className="mt-1 space-y-0.5">
              {module.lessons.map((lesson) => {
                const active = lesson.slug === currentSlug;
                const isDone = completed.includes(lesson.slug);
                return (
                  <li key={lesson.slug}>
                    <Link
                      ref={active ? activeRef : undefined}
                      href={`/${courseSlug}/${lesson.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13.5px] transition ${
                        active
                          ? "bg-accent-soft font-medium text-accent"
                          : "text-muted hover:bg-surface-2 hover:text-fg"
                      }`}
                    >
                      <span
                        suppressHydrationWarning
                        className={`grid size-4 shrink-0 place-items-center rounded-full border text-[9px] ${
                          isDone
                            ? "border-success bg-success text-white"
                            : active
                              ? "border-accent"
                              : "border-line-strong"
                        }`}
                      >
                        {isDone && (
                          <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="leading-snug">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
