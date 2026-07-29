"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { PASSWORD_RULES, USERNAME_RULES } from "@/lib/auth/validate";

/** Shared by /login and /signup — the two differ only in copy and endpoint. */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const { user, login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Only allow relative redirects, so ?next= cannot bounce to another site.
  const rawNext = searchParams.get("next") ?? "/account";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await (isSignup ? signup(username, password) : login(username, password));
      router.replace(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-2xl border border-line bg-surface p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {isSignup
            ? "Your lesson progress will sync across every device you sign in on."
            : "Sign in to pick up where you left off."}
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
          <Field
            id="username"
            label="Username"
            hint={isSignup ? USERNAME_RULES : undefined}
            value={username}
            onChange={setUsername}
            autoComplete="username"
            disabled={submitting}
          />

          <Field
            id="password"
            label="Password"
            hint={isSignup ? PASSWORD_RULES : undefined}
            value={password}
            onChange={setPassword}
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            disabled={submitting}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                className="text-xs font-medium text-muted hover:text-fg"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-on-accent transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? isSignup
                ? "Creating account…"
                : "Signing in…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={
              isSignup
                ? `/login?next=${encodeURIComponent(next)}`
                : `/signup?next=${encodeURIComponent(next)}`
            }
            className="font-medium text-accent hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        Accounts exist only to save your progress. Every lesson stays free and
        readable without signing in.
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  type = "text",
  autoComplete,
  disabled,
  trailing,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {trailing}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        required
        className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm text-fg outline-none transition focus:border-accent disabled:opacity-60"
      />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
