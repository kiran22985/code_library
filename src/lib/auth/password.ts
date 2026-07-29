import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with scrypt from Node's standard library.
 *
 * scrypt is a memory-hard key derivation function — the same family as bcrypt
 * and argon2 — and it ships with Node, so there is no native dependency to
 * compile on the deploy host. Passwords are never stored, only these hashes.
 */

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/** Cost parameters. N is the work factor: raising it doubles the time taken. */
const N = 32_768;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 128 * N * R * 2;

/** Returns `scrypt$N$r$p$salt$hash`, everything needed to verify later. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, {
    N,
    r: R,
    p: P,
    maxmem: MAX_MEM,
  });
  return [
    "scrypt",
    N,
    R,
    P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Constant-time verification. Returns false rather than throwing on a malformed
 * stored value, so a corrupt row cannot crash the login route.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, rawN, rawR, rawP, rawSalt, rawHash] = parts;
  const cost = { N: Number(rawN), r: Number(rawR), p: Number(rawP) };
  if (!Number.isFinite(cost.N) || !Number.isFinite(cost.r) || !Number.isFinite(cost.p)) {
    return false;
  }

  const expected = Buffer.from(rawHash, "base64");
  if (expected.length === 0) return false;

  try {
    const actual = await scrypt(
      password.normalize("NFKC"),
      Buffer.from(rawSalt, "base64"),
      expected.length,
      { ...cost, maxmem: 128 * cost.N * cost.r * 2 },
    );
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * A hash of a value nobody knows, used to spend the same CPU time when a
 * username does not exist. Without it, a failed login returns noticeably faster
 * for unknown usernames, which leaks which accounts are real.
 */
let dummyHash: string | null = null;

export async function burnTime(password: string): Promise<void> {
  dummyHash ??= await hashPassword(randomBytes(32).toString("hex"));
  await verifyPassword(password, dummyHash);
}
