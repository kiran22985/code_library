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

export const USERNAME_RULES =
  "3–20 characters, letters, numbers, underscores and hyphens only";
export const PASSWORD_RULES = "at least 8 characters";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateUsername(value: unknown): string | null {
  if (typeof value !== "string") return "Username is required.";
  const username = value.trim();
  if (!username) return "Username is required.";
  if (!USERNAME_PATTERN.test(username)) return `Username must be ${USERNAME_RULES}.`;
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

/** Slugs come from the URL/client, so keep them to a safe shape. */
export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{1,80}$/.test(value);
}
