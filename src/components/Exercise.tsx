"use client";

import { useState, type ReactNode } from "react";

export function Exercise({
  prompt,
  hint,
  solution,
}: {
  prompt: ReactNode;
  hint?: ReactNode;
  /** Pre-highlighted solution rendered by the server. */
  solution: ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="my-7 rounded-xl border border-accent-line bg-accent-soft p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3 3 8v8l9 5 9-5V8l-9-5Z" strokeLinejoin="round" />
          <path d="m3 8 9 5 9-5M12 21v-8" strokeLinejoin="round" />
        </svg>
        Practice
      </p>
      <p className="mt-2.5 text-[15px] leading-relaxed text-fg-soft">{prompt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {hint && (
          <button
            type="button"
            onClick={() => setShowHint((open) => !open)}
            className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-soft transition hover:border-line-strong"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowSolution((open) => !open)}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-on-accent transition hover:bg-accent-hover"
        >
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      </div>

      {showHint && hint && (
        <p className="mt-4 border-l-2 border-accent-line pl-3 text-sm text-muted">
          {hint}
        </p>
      )}
      {showSolution && <div className="mt-2">{solution}</div>}
    </section>
  );
}
