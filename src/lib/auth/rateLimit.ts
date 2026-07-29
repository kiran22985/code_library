import "server-only";

/**
 * A small in-process throttle for the login and signup routes, so an attacker
 * cannot try thousands of passwords per minute.
 *
 * Deliberately simple: the counters live in memory, so they reset when the
 * service restarts and are not shared between instances. That is enough for a
 * single free-tier web service. If this ever runs on several instances, move
 * the counters into Postgres or Redis.
 */

interface Attempt {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

/** Keeps the map from growing without bound on a long-running process. */
function sweep(now: number) {
  if (attempts.size < 5_000) return;
  for (const [key, attempt] of attempts) {
    if (attempt.resetAt <= now) attempts.delete(key);
  }
}

export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return `${scope}:${ip}`;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = attempts.get(key);
  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Called after a successful login so honest users are not penalised. */
export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
