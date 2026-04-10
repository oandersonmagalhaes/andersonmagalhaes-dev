import { describe, it, expect } from "vitest";
import { validateJson } from "./json-validate";

describe("validateJson()", () => {
  describe("when input is empty or whitespace", () => {
    it("then reports invalid with no error", () => {
      expect(validateJson("")).toEqual({ valid: false });
      expect(validateJson("   \n\t ")).toEqual({ valid: false });
    });
  });

  describe("when input is a valid JSON value", () => {
    it("then reports valid for an object", () => {
      expect(validateJson('{"a":1}')).toEqual({ valid: true });
    });

    it("then reports valid for an array", () => {
      expect(validateJson("[1,2,3]")).toEqual({ valid: true });
    });

    it("then reports valid for a primitive", () => {
      expect(validateJson("42")).toEqual({ valid: true });
      expect(validateJson('"hello"')).toEqual({ valid: true });
      expect(validateJson("null")).toEqual({ valid: true });
    });
  });

  describe("when input is malformed", () => {
    it("then reports invalid with an error message", () => {
      const result = validateJson("{");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe("string");
    });

    it("then reports a 1-based line number when the parser exposes a position", () => {
      const result = validateJson('{\n  "a": 1,\n  "b": ,\n}');
      expect(result.valid).toBe(false);
      // Modern V8 includes "position N" in SyntaxError messages.
      if (result.error && /position \d+/.test(result.error)) {
        expect(result.line).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
