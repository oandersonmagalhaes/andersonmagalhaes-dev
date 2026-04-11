/**
 * Pure diff helpers used by the Text Compare tool.
 *
 * Kept dependency-free (apart from `diff`'s `Change` type) and DOM-free so
 * they can be unit tested in isolation. The React client at
 * `src/app/[locale]/text-compare/client.tsx` consumes these helpers — do not
 * duplicate their logic in the component.
 */

import type { Change } from "diff";

export type UnifiedLine = {
  key: string;
  type: "added" | "removed" | "unchanged";
  content: string;
  oldNum: number | null;
  newNum: number | null;
};

export type SplitLine = {
  key: string;
  type: "added" | "removed" | "unchanged" | "empty";
  content: string;
  num: number | null;
};

export function unifiedLinePrefix(type: UnifiedLine["type"]): string {
  if (type === "added") return "+";
  if (type === "removed") return "-";
  return " ";
}

export function splitRawLines(value: string): string[] {
  const raw = value.split("\n");
  if (raw[raw.length - 1] === "") raw.pop();
  return raw;
}

export function buildUnifiedLines(changes: Change[]): UnifiedLine[] {
  let oldLine = 1;
  let newLine = 1;
  const lines: UnifiedLine[] = [];

  for (const change of changes) {
    for (const line of splitRawLines(change.value)) {
      if (change.added) {
        lines.push({ key: `u-a-${newLine}`, type: "added", content: line, oldNum: null, newNum: newLine++ });
      } else if (change.removed) {
        lines.push({ key: `u-r-${oldLine}`, type: "removed", content: line, oldNum: oldLine++, newNum: null });
      } else {
        lines.push({ key: `u-n-${oldLine}`, type: "unchanged", content: line, oldNum: oldLine++, newNum: newLine++ });
      }
    }
  }
  return lines;
}

function appendAddedSplitLines(
  left: SplitLine[],
  right: SplitLine[],
  raw: string[],
  newLine: number
): number {
  let n = newLine;
  for (const line of raw) {
    left.push({ key: `sl-e-${n}`, type: "empty", content: "", num: null });
    right.push({ key: `sr-a-${n}`, type: "added", content: line, num: n++ });
  }
  return n;
}

function appendRemovedSplitLines(
  left: SplitLine[],
  right: SplitLine[],
  raw: string[],
  oldLine: number
): number {
  let o = oldLine;
  for (const line of raw) {
    left.push({ key: `sl-r-${o}`, type: "removed", content: line, num: o++ });
    right.push({ key: `sr-e-${o}`, type: "empty", content: "", num: null });
  }
  return o;
}

function appendUnchangedSplitLines(
  left: SplitLine[],
  right: SplitLine[],
  raw: string[],
  oldLine: number,
  newLine: number
): [number, number] {
  let o = oldLine;
  let n = newLine;
  for (const line of raw) {
    left.push({ key: `sl-n-${o}`, type: "unchanged", content: line, num: o++ });
    right.push({ key: `sr-n-${n}`, type: "unchanged", content: line, num: n++ });
  }
  return [o, n];
}

export function buildSplitData(changes: Change[]): {
  left: SplitLine[];
  right: SplitLine[];
} {
  const left: SplitLine[] = [];
  const right: SplitLine[] = [];
  let oldLine = 1;
  let newLine = 1;

  for (const change of changes) {
    const raw = splitRawLines(change.value);
    if (change.added) {
      newLine = appendAddedSplitLines(left, right, raw, newLine);
    } else if (change.removed) {
      oldLine = appendRemovedSplitLines(left, right, raw, oldLine);
    } else {
      [oldLine, newLine] = appendUnchangedSplitLines(left, right, raw, oldLine, newLine);
    }
  }
  return { left, right };
}

function changePrefix(change: Change): string {
  if (change.added) return "+";
  if (change.removed) return "-";
  return " ";
}

export function formatDiffText(changes: Change[]): string {
  return changes
    .map((change) => {
      const prefix = changePrefix(change);
      return change.value
        .split("\n")
        .filter((line, i, arr) => !(i === arr.length - 1 && line === ""))
        .map((line) => `${prefix} ${line}`)
        .join("\n");
    })
    .join("\n");
}
