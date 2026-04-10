import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn()", () => {
  describe("when called with plain string arguments", () => {
    it("then joins them with a space", () => {
      expect(cn("a", "b", "c")).toBe("a b c");
    });
  });

  describe("when called with falsy values", () => {
    it("then drops false, null, undefined, and empty strings", () => {
      expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
    });
  });

  describe("when called with an object map", () => {
    it("then keeps only the keys whose value is truthy", () => {
      expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });
  });

  describe("when called with nested arrays", () => {
    it("then flattens them into a single class string", () => {
      expect(cn(["a", ["b", ["c"]]], "d")).toBe("a b c d");
    });
  });

  describe("when called with no arguments", () => {
    it("then returns an empty string", () => {
      expect(cn()).toBe("");
    });
  });
});
