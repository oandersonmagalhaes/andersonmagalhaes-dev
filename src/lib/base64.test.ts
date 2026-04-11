import { describe, it, expect } from "vitest";
import { encodeBase64, decodeBase64 } from "./base64";

describe("encodeBase64()", () => {
  describe("when input is plain ASCII", () => {
    it("then returns the standard Base64 encoding", () => {
      expect(encodeBase64("hello")).toBe("aGVsbG8=");
      expect(encodeBase64("Anderson")).toBe("QW5kZXJzb24=");
    });
  });

  describe("when input is empty", () => {
    it("then returns an empty string", () => {
      expect(encodeBase64("")).toBe("");
    });
  });

  describe("when input contains UTF-8 multi-byte characters", () => {
    it("then encodes the UTF-8 byte sequence (not the code points)", () => {
      // "olá" → 0x6f 0x6c 0xc3 0xa1 → b2zDoQ==
      expect(encodeBase64("olá")).toBe("b2zDoQ==");
    });

    it("then handles emoji (4-byte UTF-8 sequences)", () => {
      // 🚀 → 0xf0 0x9f 0x9a 0x80 → 8J+agA==
      expect(encodeBase64("🚀")).toBe("8J+agA==");
    });
  });
});

describe("decodeBase64()", () => {
  describe("when input is a valid Base64 ASCII string", () => {
    it("then returns the decoded text", () => {
      expect(decodeBase64("aGVsbG8=")).toBe("hello");
      expect(decodeBase64("QW5kZXJzb24=")).toBe("Anderson");
    });
  });

  describe("when input encodes UTF-8 bytes", () => {
    it("then decodes them back into the original string", () => {
      expect(decodeBase64("b2zDoQ==")).toBe("olá");
      expect(decodeBase64("8J+agA==")).toBe("🚀");
    });
  });

  describe("when input is invalid Base64", () => {
    it("then throws (so the caller can render an error)", () => {
      expect(() => decodeBase64("not-base64!@#")).toThrow();
    });
  });
});

describe("encodeBase64() / decodeBase64() round-trip", () => {
  describe("when text contains a mix of ASCII, accented, CJK and emoji", () => {
    it("then survives encode→decode unchanged", () => {
      const original = "Olá, 世界! 🚀 — testing UTF-8";
      expect(decodeBase64(encodeBase64(original))).toBe(original);
    });
  });
});
