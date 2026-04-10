/**
 * Pure password-generator helpers for the Password Generator tool.
 *
 * `generatePassword` requires a `Web Crypto`-compatible `crypto.getRandomValues`
 * (available in browsers and modern Node). Tests can pass a fake crypto via the
 * optional `cryptoImpl` argument so randomness becomes deterministic.
 */

export const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

export type CharsetKey = keyof typeof CHARSETS;
export type StrengthLevel = 1 | 2 | 3 | 4;
export type StrengthLabel = "weak" | "medium" | "strong" | "veryStrong";

export interface CryptoLike {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
}

export function generatePassword(
  length: number,
  options: Record<CharsetKey, boolean>,
  cryptoImpl: CryptoLike = crypto
): string {
  let chars = "";
  for (const [key, enabled] of Object.entries(options)) {
    if (enabled) chars += CHARSETS[key as CharsetKey];
  }
  if (!chars || length <= 0) return "";

  const array = new Uint32Array(length);
  cryptoImpl.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

export function getStrength(
  password: string,
  options: Record<CharsetKey, boolean>
): { level: StrengthLevel; label: StrengthLabel } {
  const len = password.length;
  const enabledSets = Object.values(options).filter(Boolean).length;

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (len >= 20) score++;
  if (len >= 32) score++;
  if (enabledSets >= 2) score++;
  if (enabledSets >= 3) score++;
  if (enabledSets >= 4) score++;

  if (score <= 2) return { level: 1, label: "weak" };
  if (score <= 4) return { level: 2, label: "medium" };
  if (score <= 5) return { level: 3, label: "strong" };
  return { level: 4, label: "veryStrong" };
}
