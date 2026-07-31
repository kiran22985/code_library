"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getGuestCount,
  importGuestProgress,
  subscribe,
} from "@/lib/progressStore";

/**
 * Offers to copy progress made while signed out into the account.
 *
 * This used to happen automatically on sign-in, which meant a new account
 * inherited whatever was in the browser — including, on a shared computer,
 * somebody else's lessons. Now it only happens when the visitor asks.
 */
export function GuestProgressImport() {
  // localStorage is an external store, so read it as a snapshot rather than
  // copying it into state from an effect.
  const guestCount = useSyncExternalStore(subscribe, getGuestCount, () => 0);
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  if (guestCount === 0 || dismissed || status === "done") return null;

  return (
    <section className="mt-8 rounded-2xl border border-accent-line bg-accent-soft p-5">
      <h2 className="text-sm font-semibold text-accent">
        Progress from before you signed in
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-soft">
        This browser has {guestCount} lesson{guestCount === 1 ? "" : "s"} marked
        complete from while you were signed out. Add{" "}
        {guestCount === 1 ? "it" : "them"} to your account?
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={status === "working"}
          onClick={async () => {
            setStatus("working");
            const ok = await importGuestProgress();
            setStatus(ok ? "done" : "idle");
          }}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "working" ? "Adding…" : "Add to my account"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg-soft transition hover:border-line-strong"
        >
          No thanks
        </button>
      </div>
    </section>
  );
}
