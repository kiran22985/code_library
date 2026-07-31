/**
 * Input rules, shared by the API routes and the forms so the messages match.
 * The server always re-validates — client-side checks are a convenience, never
 * a guarantee.
 *
 * This module is imported by client components, so it must stay free of any
 * server-only code (that is what the `server-only` import in password.ts
 * enforces).
 */

/** Longer passwords cost hashing time without adding security. */
export const MAX_PASSWORD_LENGTH = 200;

export const FULL_NAME_RULES = "your full name, 2–80 characters";
export const PHONE_RULES = "digits only, 7–15 numbers, optionally starting with +";
export const EMAIL_RULES = "a valid email address, e.g. you@example.com";
export const PASSWORD_RULES = "at least 8 characters";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Deliberately permissive. Anything stricter rejects real addresses, and the
 * only test that actually proves an address works is sending mail to it.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Names contain letters, spaces, hyphens, apostrophes and dots, in any script. */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;

export function validateFullName(value: unknown): string | null {
  if (typeof value !== "string") return "Full name is required.";
  const name = value.trim();
  if (!name) return "Full name is required.";
  if (name.length < 2 || name.length > 80) {
    return "Full name must be between 2 and 80 characters.";
  }
  if (!NAME_PATTERN.test(name)) {
    return "Full name may only contain letters, spaces, hyphens and apostrophes.";
  }
  return null;
}

export function validatePhone(value: unknown): string | null {
  if (typeof value !== "string") return "Phone number is required.";
  const phone = value.trim();
  if (!phone) return "Phone number is required.";
  // Allow the separators people naturally type, then count the digits.
  if (!/^\+?[\d\s()-]+$/.test(phone)) {
    return "Phone number may only contain digits, spaces, +, - and brackets.";
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return "Phone number must contain between 7 and 15 digits.";
  }
  return null;
}

export function validateEmail(value: unknown): string | null {
  if (typeof value !== "string") return "Email is required.";
  const email = value.trim();
  if (!email) return "Email is required.";
  if (email.length > 254) return "Email is too long.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(value: unknown): string | null {
  if (typeof value !== "string") return "Password is required.";
  if (value.length < MIN_PASSWORD_LENGTH) return `Password must be ${PASSWORD_RULES}.`;
  if (value.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function validatePasswordConfirmation(
  password: unknown,
  confirmation: unknown,
): string | null {
  if (typeof confirmation !== "string" || !confirmation) {
    return "Please confirm your password.";
  }
  if (password !== confirmation) return "The two passwords do not match.";
  return null;
}

/** Normalises an email for storage and lookup: trimmed and lower-cased. */
export function emailKey(email: string): string {
  return email.trim().toLowerCase();
}

/** Slugs come from the URL/client, so keep them to a safe shape. */
export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{1,80}$/.test(value);
}
