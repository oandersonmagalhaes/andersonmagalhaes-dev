/**
 * Pure Base64 encode/decode helpers used by the Base64 Translator tool.
 *
 * Both functions handle full UTF-8 by going through `TextEncoder` /
 * `TextDecoder` instead of the deprecated `escape`/`unescape` route. They
 * throw on invalid input — the React client catches and renders the error.
 */

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const binaryStr = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binaryStr);
}

export function decodeBase64(input: string): string {
  const binaryStr = atob(input);
  const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
