"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  EMAIL_RULES,
  PASSWORD_RULES,
  PHONE_RULES,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
} from "@/lib/auth/validate";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormState = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

/**
 * Shared by /login and /signup.
 *
 * Sign-in needs only an email and password; sign-up collects the full profile.
 * The same validators run here and in the API route, so the message a user sees
 * before submitting matches the one the server would return.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const { user, login, signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormState) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  /**
   * Where to go after signing in. Read from the query string with a lazy
   * initialiser rather than `useSearchParams`, which would opt this page out of
   * prerendering and make the form appear only after hydration.
   *
   * Only relative paths are accepted, so `?next=` cannot bounce someone to
   * another site after login (an open-redirect).
   */
  const [next] = useState(() => {
    if (typeof window === "undefined") return "/account";
    const requested = new URLSearchParams(window.location.search).get("next");
    return requested?.startsWith("/") && !requested.startsWith("//")
      ? requested
      : "/account";
  });

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  /** Catches mistakes before a network round-trip; the server checks again. */
  const clientSideProblem = (): string | null => {
    if (!isSignup) return null;
    return (
      validateFullName(form.fullName) ??
      validatePhone(form.phone) ??
      validateEmail(form.email) ??
      validatePassword(form.password) ??
      validatePasswordConfirmation(form.password, form.confirmPassword)
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const problem = clientSideProblem();
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
      } else {
        await login(form.email.trim(), form.password);
      }
      router.replace(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const canSubmit = isSignup
    ? Object.values(form).every((value) => value.trim().length > 0)
    : form.email.trim().length > 0 && form.password.length > 0;

  const passwordsMismatch =
    isSignup &&
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-20">
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
          {isSignup && (
            <>
              <Field
                id="fullName"
                label="Full name"
                value={form.fullName}
                onChange={set("fullName")}
                autoComplete="name"
                placeholder="Kiran Giri"
                disabled={submitting}
              />

              <Field
                id="phone"
                label="Phone number"
                hint={PHONE_RULES}
                value={form.phone}
                onChange={set("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+977 9800000000"
                disabled={submitting}
              />
            </>
          )}

          <Field
            id="email"
            label="Email"
            hint={isSignup ? EMAIL_RULES : undefined}
            value={form.email}
            onChange={set("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={submitting}
          />

          <Field
            id="password"
            label="Password"
            hint={isSignup ? PASSWORD_RULES : undefined}
            value={form.password}
            onChange={set("password")}
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

          {isSignup && (
            <Field
              id="confirmPassword"
              label="Confirm password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={submitting}
              invalid={passwordsMismatch}
              error={passwordsMismatch ? "The two passwords do not match." : undefined}
            />
          )}

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
            disabled={submitting || !canSubmit}
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
            href={isSignup ? "/login" : "/signup"}
            className="font-medium text-accent hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        Accounts exist only to save your progress. Every lesson stays free and
        readable without signing in. See our{" "}
        <Link href="/privacy" className="text-accent underline underline-offset-2">
          privacy policy
        </Link>
        .
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
  placeholder,
  disabled,
  trailing,
  invalid,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
  invalid?: boolean;
  error?: string;
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
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={hint || error ? `${id}-hint` : undefined}
        required
        className={`mt-1.5 w-full rounded-lg border bg-bg px-3.5 py-2.5 text-sm text-fg outline-none transition disabled:opacity-60 ${
          invalid ? "border-danger focus:border-danger" : "border-line focus:border-accent"
        }`}
      />
      {(error ?? hint) && (
        <p
          id={`${id}-hint`}
          className={`mt-1.5 text-xs ${error ? "text-danger" : "text-muted"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
