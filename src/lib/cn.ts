import { clsx, type ClassValue } from "clsx";

/**
 * Tiny class-name helper. Wraps clsx so callers can pass conditional and
 * arrayed inputs without juggling falsy values.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
