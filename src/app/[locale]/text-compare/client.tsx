"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { diffLines, Change } from "diff";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

type ViewMode = "unified" | "split";

function formatDiffText(changes: Change[]): string {
  return changes
    .map((change) => {
      const prefix = change.added ? "+" : change.removed ? "-" : " ";
      return change.value
        .split("\n")
        .filter((line, i, arr) => !(i === arr.length - 1 && line === ""))
        .map((line) => `${prefix} ${line}`)
        .join("\n");
    })
    .join("\n");
}

export default function TextCompareClient() {
  const t = useTranslations("tools");
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [compared, setCompared] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("unified");

  const changes = useMemo(() => {
    if (!compared) return [];
    return diffLines(textA, textB);
  }, [textA, textB, compared]);

  const diffText = useMemo(() => formatDiffText(changes), [changes]);

  function handleCompare() {
    setCompared(true);
  }

  function handleClear() {
    setTextA("");
    setTextB("");
    setCompared(false);
  }

  // Build line-numbered unified view
  const unifiedLines = useMemo(() => {
    let oldLine = 1;
    let newLine = 1;
    const lines: {
      type: "added" | "removed" | "unchanged";
      content: string;
      oldNum: number | null;
      newNum: number | null;
    }[] = [];

    for (const change of changes) {
      const raw = change.value.split("\n");
      // Remove trailing empty string from split
      if (raw[raw.length - 1] === "") raw.pop();

      for (const line of raw) {
        if (change.added) {
          lines.push({ type: "added", content: line, oldNum: null, newNum: newLine++ });
        } else if (change.removed) {
          lines.push({ type: "removed", content: line, oldNum: oldLine++, newNum: null });
        } else {
          lines.push({ type: "unchanged", content: line, oldNum: oldLine++, newNum: newLine++ });
        }
      }
    }
    return lines;
  }, [changes]);

  // Build split view data
  const splitData = useMemo(() => {
    const left: { type: "removed" | "unchanged" | "empty"; content: string; num: number | null }[] = [];
    const right: { type: "added" | "unchanged" | "empty"; content: string; num: number | null }[] = [];
    let oldLine = 1;
    let newLine = 1;

    for (const change of changes) {
      const raw = change.value.split("\n");
      if (raw[raw.length - 1] === "") raw.pop();

      if (change.added) {
        for (const line of raw) {
          left.push({ type: "empty", content: "", num: null });
          right.push({ type: "added", content: line, num: newLine++ });
        }
      } else if (change.removed) {
        for (const line of raw) {
          left.push({ type: "removed", content: line, num: oldLine++ });
          right.push({ type: "empty", content: "", num: null });
        }
      } else {
        for (const line of raw) {
          left.push({ type: "unchanged", content: line, num: oldLine++ });
          right.push({ type: "unchanged", content: line, num: newLine++ });
        }
      }
    }
    return { left, right };
  }, [changes]);

  return (
    <ToolLayout titleKey="textCompare.title" descriptionKey="textCompare.description">
      <div className="space-y-6">
        {/* Text inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">
              {t("textCompare.textA")}
            </label>
            <textarea
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value);
                setCompared(false);
              }}
              placeholder={t("textCompare.placeholderA")}
              className="w-full h-48 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">
              {t("textCompare.textB")}
            </label>
            <textarea
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value);
                setCompared(false);
              }}
              placeholder={t("textCompare.placeholderB")}
              className="w-full h-48 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleCompare}>{t("compare")}</Button>
          <Button onClick={handleClear} variant="ghost">
            {t("clear")}
          </Button>
        </div>

        {/* Diff output */}
        {compared && changes.length > 0 && (
          <div className="space-y-3">
            {/* View toggle + copy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-brand-surface rounded-lg p-1">
                <button
                  onClick={() => setViewMode("unified")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === "unified"
                      ? "bg-brand-card text-gray-100"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {t("textCompare.unified")}
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === "split"
                      ? "bg-brand-card text-gray-100"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {t("textCompare.split")}
                </button>
              </div>
              <CopyButton text={diffText} />
            </div>

            {/* Unified view */}
            {viewMode === "unified" && (
              <div className="bg-brand-card border border-gray-800 rounded-lg overflow-x-auto">
                <div className="min-w-[500px]">
                  {unifiedLines.map((line, i) => (
                    <div
                      key={i}
                      className={`flex text-sm font-mono ${
                        line.type === "added"
                          ? "bg-brand-emerald/10 text-brand-emerald"
                          : line.type === "removed"
                          ? "bg-red-500/10 text-red-400"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-600 select-none border-r border-gray-800/50 text-xs leading-6">
                        {line.oldNum ?? ""}
                      </span>
                      <span className="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-600 select-none border-r border-gray-800/50 text-xs leading-6">
                        {line.newNum ?? ""}
                      </span>
                      <span className="w-6 shrink-0 text-center py-0.5 select-none text-xs leading-6">
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                      </span>
                      <span className="py-0.5 pr-4 whitespace-pre leading-6">
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Split view */}
            {viewMode === "split" && (
              <div className="grid grid-cols-2 gap-0.5">
                {/* Left */}
                <div className="bg-brand-card border border-gray-800 rounded-l-lg overflow-x-auto">
                  {splitData.left.map((line, i) => (
                    <div
                      key={i}
                      className={`flex text-sm font-mono ${
                        line.type === "removed"
                          ? "bg-red-500/10 text-red-400"
                          : line.type === "empty"
                          ? "bg-brand-surface/30 text-transparent"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="w-10 shrink-0 text-right pr-2 py-0.5 text-gray-600 select-none border-r border-gray-800/50 text-xs leading-6">
                        {line.num ?? ""}
                      </span>
                      <span className="py-0.5 px-2 whitespace-pre leading-6 truncate">
                        {line.content || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Right */}
                <div className="bg-brand-card border border-gray-800 rounded-r-lg overflow-x-auto">
                  {splitData.right.map((line, i) => (
                    <div
                      key={i}
                      className={`flex text-sm font-mono ${
                        line.type === "added"
                          ? "bg-brand-emerald/10 text-brand-emerald"
                          : line.type === "empty"
                          ? "bg-brand-surface/30 text-transparent"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="w-10 shrink-0 text-right pr-2 py-0.5 text-gray-600 select-none border-r border-gray-800/50 text-xs leading-6">
                        {line.num ?? ""}
                      </span>
                      <span className="py-0.5 px-2 whitespace-pre leading-6 truncate">
                        {line.content || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
