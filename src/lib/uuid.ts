/**
 * Pure UUID v5 helpers used by the "UUID from string" tool.
 *
 * Depends on the standard Web Crypto API (`crypto.subtle.digest`) which is
 * available in browsers and modern Node. No DOM dependencies.
 */

export const NAMESPACES: Record<string, string> = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

export function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export async function generateUuidV5(
  name: string,
  namespaceUuid: string
): Promise<string> {
  const namespaceBytes = uuidToBytes(namespaceUuid);
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);

  const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
  data.set(namespaceBytes);
  data.set(nameBytes, namespaceBytes.length);

  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashBytes = new Uint8Array(hashBuffer);

  // Set version 5
  hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50;
  // Set variant RFC4122
  hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80;

  return bytesToUuid(hashBytes.slice(0, 16));
}
