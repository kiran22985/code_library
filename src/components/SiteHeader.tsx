"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { SearchItem } from "@/lib/courses";
import { SearchDialog, SearchIcon } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

const NAV = [
  { href: "/courses", label: "Courses" },
  { href: "/python", label: "Python" },
  { href: "/roadmap", label: "Roadmap" },
];

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function SiteHeader({ index }: { index: SearchItem[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  // ⌘K / Ctrl-K (or "/") opens search from anywhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          scrolled
            ? "border-line bg-bg/85 backdrop-blur-md"
            : "border-transparent bg-bg"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-fg">
              Code<span className="text-accent">Library</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-surface-2 font-medium text-fg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2 text-sm text-muted transition hover:border-line-strong hover:text-fg sm:w-56"
            >
              <SearchIcon className="size-4" />
              <span className="hidden sm:inline">Search lessons</span>
              <kbd className="ml-auto hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] sm:block">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />
            <UserMenu />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg md:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                {menuOpen ? (
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-line bg-surface px-4 py-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-fg-soft hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Mounted only while open, so its state resets on every launch. */}
      {searchOpen && (
        <SearchDialog index={index} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) return false;
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.isContentEditable === true
  );
}

function Logo() {
  return (
    <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-hover text-on-accent shadow-sm">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="m9 8-4 4 4 4M15 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
