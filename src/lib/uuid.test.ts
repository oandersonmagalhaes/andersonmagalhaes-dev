import { describe, it, expect } from "vitest";
import {
  NAMESPACES,
  uuidToBytes,
  bytesToUuid,
  generateUuidV5,
} from "./uuid";

describe("uuidToBytes()", () => {
  describe("when given a canonical UUID string", () => {
    it("then returns 16 bytes matching the hex pairs", () => {
      const bytes = uuidToBytes("00112233-4455-6677-8899-aabbccddeeff");
      expect(Array.from(bytes)).toEqual([
        0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
        0xcc, 0xdd, 0xee, 0xff,
      ]);
    });
  });
});

describe("bytesToUuid()", () => {
  describe("when given 16 bytes", () => {
    it("then returns a canonical 8-4-4-4-12 UUID string", () => {
      const bytes = new Uint8Array([
        0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
        0xcc, 0xdd, 0xee, 0xff,
      ]);
      expect(bytesToUuid(bytes)).toBe("00112233-4455-6677-8899-aabbccddeeff");
    });
  });

  describe("when round-tripped through uuidToBytes()", () => {
    it("then yields the original UUID", () => {
      const original = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
      expect(bytesToUuid(uuidToBytes(original))).toBe(original);
    });
  });
});

describe("generateUuidV5()", () => {
  describe("when given the same input twice", () => {
    it("then returns the same deterministic UUID", async () => {
      const a = await generateUuidV5("anderson", NAMESPACES.DNS);
      const b = await generateUuidV5("anderson", NAMESPACES.DNS);
      expect(a).toBe(b);
    });
  });

  describe("when given different inputs", () => {
    it("then returns different UUIDs", async () => {
      const a = await generateUuidV5("anderson", NAMESPACES.DNS);
      const b = await generateUuidV5("magalhaes", NAMESPACES.DNS);
      expect(a).not.toBe(b);
    });
  });

  describe("when called with the DNS namespace and the canonical RFC test input", () => {
    it("then matches the RFC 4122 expected v5 UUID for 'www.example.org'", async () => {
      // Reference value from RFC-style UUID v5 implementations.
      const result = await generateUuidV5("www.example.org", NAMESPACES.DNS);
      expect(result).toBe("74738ff5-5367-5958-9aee-98fffdcd1876");
    });
  });

  describe("when inspecting the produced UUID", () => {
    it("then sets version 5 and the RFC4122 variant bits", async () => {
      const uuid = await generateUuidV5("anderson", NAMESPACES.URL);
      // Version nibble is the 13th hex char (index 14 in canonical form).
      expect(uuid[14]).toBe("5");
      // Variant nibble is the 17th hex char and must be 8, 9, a, or b.
      expect(uuid[19]).toMatch(/[89ab]/);
    });
  });
});

describe("NAMESPACES", () => {
  describe("when reading the standard RFC 4122 namespaces", () => {
    it("then exposes DNS, URL, OID, and X500", () => {
      expect(Object.keys(NAMESPACES).sort()).toEqual([
        "DNS",
        "OID",
        "URL",
        "X500",
      ]);
      expect(NAMESPACES.DNS).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
    });
  });
});
