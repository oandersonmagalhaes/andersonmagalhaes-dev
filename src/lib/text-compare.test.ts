import { describe, it, expect } from "vitest";
import type { Change } from "diff";
import {
  buildUnifiedLines,
  buildSplitData,
  formatDiffText,
  unifiedLinePrefix,
  splitRawLines,
} from "./text-compare";

/**
 * Helpers to build `Change` arrays inline so the tests don't need to invoke
 * the real `diffLines` algorithm — we're testing OUR transformation of the
 * diff output, not the diff library itself.
 */
const unchanged = (value: string): Change => ({ value, added: false, removed: false, count: value.split("\n").length });
const added = (value: string): Change => ({ value, added: true, removed: false, count: value.split("\n").length });
const removed = (value: string): Change => ({ value, added: false, removed: true, count: value.split("\n").length });

describe("unifiedLinePrefix()", () => {
  describe("when called with each line type", () => {
    it("then returns + for added, - for removed, space for unchanged", () => {
      expect(unifiedLinePrefix("added")).toBe("+");
      expect(unifiedLinePrefix("removed")).toBe("-");
      expect(unifiedLinePrefix("unchanged")).toBe(" ");
    });
  });
});

describe("splitRawLines()", () => {
  describe("when input ends with a trailing newline", () => {
    it("then drops the empty trailing string", () => {
      expect(splitRawLines("a\nb\n")).toEqual(["a", "b"]);
    });
  });

  describe("when input has no trailing newline", () => {
    it("then keeps every line as-is", () => {
      expect(splitRawLines("a\nb")).toEqual(["a", "b"]);
    });
  });

  describe("when input is a single line", () => {
    it("then returns a one-element array", () => {
      expect(splitRawLines("hello")).toEqual(["hello"]);
    });
  });
});

describe("buildUnifiedLines()", () => {
  describe("when there are no changes", () => {
    it("then returns an empty array", () => {
      expect(buildUnifiedLines([])).toEqual([]);
    });
  });

  describe("when every change is unchanged", () => {
    it("then numbers each line on both sides", () => {
      const result = buildUnifiedLines([unchanged("a\nb\n")]);
      expect(result).toEqual([
        { key: "u-n-1", type: "unchanged", content: "a", oldNum: 1, newNum: 1 },
        { key: "u-n-2", type: "unchanged", content: "b", oldNum: 2, newNum: 2 },
      ]);
    });
  });

  describe("when there is an addition followed by a removal", () => {
    it("then keeps the running line counters separate for each side", () => {
      const result = buildUnifiedLines([
        unchanged("ctx\n"),
        added("new\n"),
        removed("old\n"),
        unchanged("end\n"),
      ]);
      expect(result.map((l) => [l.type, l.content, l.oldNum, l.newNum])).toEqual([
        ["unchanged", "ctx", 1, 1],
        ["added", "new", null, 2],
        ["removed", "old", 2, null],
        ["unchanged", "end", 3, 3],
      ]);
    });
  });

  describe("when a change spans multiple lines", () => {
    it("then emits one entry per line and preserves order", () => {
      const result = buildUnifiedLines([added("x\ny\nz\n")]);
      expect(result).toHaveLength(3);
      expect(result.map((l) => l.content)).toEqual(["x", "y", "z"]);
      expect(result.every((l) => l.type === "added")).toBe(true);
      expect(result.map((l) => l.newNum)).toEqual([1, 2, 3]);
      expect(result.every((l) => l.oldNum === null)).toBe(true);
    });
  });

  describe("when entry keys are inspected", () => {
    it("then every key is unique", () => {
      const result = buildUnifiedLines([
        unchanged("a\nb\n"),
        added("c\n"),
        removed("d\n"),
      ]);
      const keys = result.map((l) => l.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});

describe("buildSplitData()", () => {
  describe("when there are no changes", () => {
    it("then returns empty left/right panes", () => {
      expect(buildSplitData([])).toEqual({ left: [], right: [] });
    });
  });

  describe("when only additions are present", () => {
    it("then left is all empty placeholders and right has the added lines", () => {
      const { left, right } = buildSplitData([added("a\nb\n")]);
      expect(left.every((l) => l.type === "empty" && l.num === null)).toBe(true);
      expect(right.map((l) => [l.type, l.content, l.num])).toEqual([
        ["added", "a", 1],
        ["added", "b", 2],
      ]);
    });
  });

  describe("when only removals are present", () => {
    it("then right is all empty placeholders and left has the removed lines", () => {
      const { left, right } = buildSplitData([removed("a\nb\n")]);
      expect(right.every((l) => l.type === "empty" && l.num === null)).toBe(true);
      expect(left.map((l) => [l.type, l.content, l.num])).toEqual([
        ["removed", "a", 1],
        ["removed", "b", 2],
      ]);
    });
  });

  describe("when a mix of unchanged, added and removed lines is given", () => {
    it("then left and right keep aligned line counters", () => {
      const { left, right } = buildSplitData([
        unchanged("ctx\n"),
        added("new\n"),
        removed("old\n"),
        unchanged("end\n"),
      ]);
      expect(left).toHaveLength(4);
      expect(right).toHaveLength(4);
      // Pane sequences:
      expect(left.map((l) => [l.type, l.num])).toEqual([
        ["unchanged", 1],
        ["empty", null],
        ["removed", 2],
        ["unchanged", 3],
      ]);
      expect(right.map((l) => [l.type, l.num])).toEqual([
        ["unchanged", 1],
        ["added", 2],
        ["empty", null],
        ["unchanged", 3],
      ]);
    });
  });

  describe("when split-pane keys are inspected", () => {
    it("then no two keys collide across left and right", () => {
      const { left, right } = buildSplitData([
        unchanged("a\nb\n"),
        added("c\n"),
        removed("d\n"),
      ]);
      const keys = [...left.map((l) => l.key), ...right.map((l) => l.key)];
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});

describe("formatDiffText()", () => {
  describe("when called with an empty change list", () => {
    it("then returns an empty string", () => {
      expect(formatDiffText([])).toBe("");
    });
  });

  describe("when changes have a trailing newline", () => {
    it("then drops the empty final line so output isn't double-spaced", () => {
      expect(formatDiffText([added("a\n")])).toBe("+ a");
    });
  });

  describe("when called with mixed change types", () => {
    it("then prefixes lines with +/-/space and joins with newlines", () => {
      const result = formatDiffText([
        unchanged("ctx\n"),
        added("new\n"),
        removed("old\n"),
      ]);
      expect(result).toBe("  ctx\n+ new\n- old");
    });
  });

  describe("when a change holds multiple lines", () => {
    it("then every line in that change shares the same prefix", () => {
      expect(formatDiffText([added("x\ny\nz\n")])).toBe("+ x\n+ y\n+ z");
    });
  });
});
