"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

/** Header widget: sign in / sign up when anonymous, account menu when not. */
export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (loading) {
    return <span className="size-9 animate-pulse rounded-lg bg-surface-2" aria-hidden />;
  }

  if (!user) {
    const next = encodeURIComponent(pathname);
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href={`/login?next=${next}`}
          className="hidden rounded-lg px-3 py-2 text-sm text-muted transition hover:text-fg sm:block"
        >
          Sign in
        </Link>
        <Link
          href={`/signup?next=${next}`}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
        >
          Sign up
        </Link>
      </div>
    );
  }

  // Older accounts predate the profile fields, so fall back to the email.
  const displayName = user.fullName || user.email || "Account";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid size-9 place-items-center rounded-lg bg-accent text-sm font-semibold text-on-accent transition hover:bg-accent-hover"
        title={displayName}
      >
        {displayName.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/20"
        >
          <p className="border-b border-line px-4 py-3">
            <span className="block text-xs text-muted">Signed in as</span>
            <span className="block truncate text-sm font-medium text-fg">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted">{user.email}</span>
          </p>

          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-fg-soft transition hover:bg-surface-2"
          >
            Your account
          </Link>
          <Link
            href="/python"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-fg-soft transition hover:bg-surface-2"
          >
            Continue learning
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className="block w-full border-t border-line px-4 py-2.5 text-left text-sm text-fg-soft transition hover:bg-surface-2 hover:text-danger"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
