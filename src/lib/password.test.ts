import { describe, it, expect } from "vitest";
import {
  CHARSETS,
  generatePassword,
  getStrength,
  type CharsetKey,
  type CryptoLike,
} from "./password";

const ALL: Record<CharsetKey, boolean> = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};
const NONE: Record<CharsetKey, boolean> = {
  uppercase: false,
  lowercase: false,
  numbers: false,
  symbols: false,
};

/**
 * Deterministic crypto stub: fills the given array with sequential numbers
 * so the test can assert exact characters and byte ordering.
 */
function fakeCrypto(seed: number[]): CryptoLike {
  return {
    getRandomValues<T extends ArrayBufferView>(array: T): T {
      const view = array as unknown as { length: number; [i: number]: number };
      for (let i = 0; i < view.length; i++) {
        view[i] = seed[i % seed.length];
      }
      return array;
    },
  };
}

describe("generatePassword()", () => {
  describe("when no charset is enabled", () => {
    it("then returns an empty string", () => {
      expect(generatePassword(16, NONE)).toBe("");
    });
  });

  describe("when length is zero", () => {
    it("then returns an empty string", () => {
      expect(generatePassword(0, ALL)).toBe("");
    });
  });

  describe("when only the lowercase charset is enabled", () => {
    it("then every produced character belongs to that charset", () => {
      const pwd = generatePassword(64, {
        ...NONE,
        lowercase: true,
      });
      expect(pwd).toHaveLength(64);
      expect(pwd).toMatch(/^[a-z]+$/);
    });
  });

  describe("when called with a deterministic crypto", () => {
    it("then produces reproducible output of the requested length", () => {
      const pwd = generatePassword(
        8,
        { ...NONE, numbers: true },
        fakeCrypto([0, 1, 2, 3, 4, 5, 6, 7])
      );
      expect(pwd).toBe("01234567");
    });
  });

  describe("when called with the default crypto", () => {
    it("then uses every enabled character class given enough length", () => {
      const pwd = generatePassword(512, ALL);
      expect(pwd.length).toBe(512);
      expect(pwd).toMatch(/[A-Z]/);
      expect(pwd).toMatch(/[a-z]/);
      expect(pwd).toMatch(/[0-9]/);
      expect(pwd).toMatch(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/);
    });
  });
});

describe("getStrength()", () => {
  describe("when password is short and uses one charset", () => {
    it("then returns weak (level 1)", () => {
      expect(getStrength("abc", { ...NONE, lowercase: true })).toEqual({
        level: 1,
        label: "weak",
      });
    });
  });

  describe("when password is 12 chars with two charsets", () => {
    it("then returns medium (level 2)", () => {
      expect(
        getStrength("abcdefghABCD", {
          ...NONE,
          lowercase: true,
          uppercase: true,
        })
      ).toEqual({ level: 2, label: "medium" });
    });
  });

  describe("when password is 20 chars with three charsets", () => {
    it("then returns strong (level 3)", () => {
      expect(
        getStrength("abcdefghijklABCD1234", {
          ...NONE,
          lowercase: true,
          uppercase: true,
          numbers: true,
        })
      ).toEqual({ level: 3, label: "strong" });
    });
  });

  describe("when password is very long with all charsets", () => {
    it("then returns veryStrong (level 4)", () => {
      const pwd = "Abcdefghijklmnop12345678!@#$%^&*";
      expect(getStrength(pwd, ALL)).toEqual({ level: 4, label: "veryStrong" });
    });
  });
});

describe("CHARSETS", () => {
  describe("when reading the alphabet definitions", () => {
    it("then each set contains the expected characters", () => {
      expect(CHARSETS.uppercase).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      expect(CHARSETS.lowercase).toBe("abcdefghijklmnopqrstuvwxyz");
      expect(CHARSETS.numbers).toBe("0123456789");
    });
  });
});
