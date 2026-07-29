"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/courses";

/**
 * Command-palette style lesson search. The whole index is a few KB of JSON
 * generated at build time, so matching happens instantly on the client with no
 * API round-trip — which also keeps the static export self-contained.
 *
 * The component is mounted only while the dialog is open, so its state starts
 * fresh on every launch.
 */
export function SearchDialog({
  index,
  onClose,
}: {
  index: SearchItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.slice(0, 8);
    return index
      .map((item) => {
        let score = 0;
        for (const term of terms) {
          if (!item.haystack.includes(term)) return null;
          const title = item.title.toLowerCase();
          if (title.includes(term)) score += 3;
          if (title.startsWith(term)) score += 2;
          score += 1;
        }
        return { item, score };
      })
      .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.item);
  }, [index, query]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].href);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="size-4 shrink-0 text-muted" />
          <input
            // Focus on open — expected behaviour for a command palette.
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search lessons — try 'decorators' or 'dict'"
            className="w-full bg-transparent py-4 text-sm text-fg outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
            ESC
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No lessons match “{query}”.
          </p>
        ) : (
          <ul ref={listRef} className="scroll-thin max-h-[52vh] overflow-y-auto p-2">
            {results.map((item, position) => (
              <li key={item.href}>
                <button
                  type="button"
                  data-index={position}
                  onMouseMove={() => setActive(position)}
                  onClick={() => go(item.href)}
                  className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition ${
                    position === active ? "bg-accent-soft" : "hover:bg-surface-2"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-fg">
                    {item.title}
                    <span className="rounded border border-line px-1.5 py-px text-[10px] font-normal text-muted">
                      {item.course}
                    </span>
                  </span>
                  <span className="line-clamp-1 text-xs text-muted">
                    {item.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line px-1 font-mono">↑</kbd>
            <kbd className="rounded border border-line px-1 font-mono">↓</kbd>{" "}
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-line px-1 font-mono">↵</kbd> open
          </span>
          <span className="ml-auto">{index.length} lessons indexed</span>
        </div>
      </div>
    </div>
  );
}

export function SearchIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
