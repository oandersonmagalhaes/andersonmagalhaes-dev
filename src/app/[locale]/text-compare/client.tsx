"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { diffLines } from "diff";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/cn";
import {
  buildUnifiedLines,
  buildSplitData,
  formatDiffText,
  unifiedLinePrefix,
} from "@/lib/text-compare";
import tools from "../tools.module.css";
import styles from "./TextCompare.module.css";

type ViewMode = "unified" | "split";

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
  const unifiedLines = useMemo(() => buildUnifiedLines(changes), [changes]);

  // Build split view data
  const splitData = useMemo(() => buildSplitData(changes), [changes]);

  const lineClass = (type: "added" | "removed" | "unchanged" | "empty") =>
    cn(
      styles.line,
      type === "added" && styles.lineAdded,
      type === "removed" && styles.lineRemoved,
      type === "empty" && styles.lineEmpty
    );

  return (
    <ToolLayout titleKey="textCompare.title" descriptionKey="textCompare.description">
      <div className={tools.stack}>
        <div className={styles.inputsGrid}>
          <div className={tools.field}>
            <label className={tools.fieldLabel}>{t("textCompare.textA")}</label>
            <textarea
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value);
                setCompared(false);
              }}
              placeholder={t("textCompare.placeholderA")}
              className={`${tools.textarea} ${tools.textareaLg}`}
            />
          </div>
          <div className={tools.field}>
            <label className={tools.fieldLabel}>{t("textCompare.textB")}</label>
            <textarea
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value);
                setCompared(false);
              }}
              placeholder={t("textCompare.placeholderB")}
              className={`${tools.textarea} ${tools.textareaLg}`}
            />
          </div>
        </div>

        <div className={tools.actionRow}>
          <Button onClick={handleCompare}>{t("compare")}</Button>
          <Button onClick={handleClear} variant="ghost">
            {t("clear")}
          </Button>
        </div>

        {compared && changes.length > 0 && (
          <div className={styles.diffSection}>
            <div className={styles.diffHeader}>
              <div className={styles.viewToggle}>
                <button
                  onClick={() => setViewMode("unified")}
                  className={cn(
                    styles.viewBtn,
                    viewMode === "unified" && styles.viewBtnActive
                  )}
                >
                  {t("textCompare.unified")}
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={cn(
                    styles.viewBtn,
                    viewMode === "split" && styles.viewBtnActive
                  )}
                >
                  {t("textCompare.split")}
                </button>
              </div>
              <CopyButton text={diffText} />
            </div>

            {viewMode === "unified" && (
              <div className={styles.unified}>
                <div className={styles.unifiedInner}>
                  {unifiedLines.map((line) => (
                    <div key={line.key} className={lineClass(line.type)}>
                      <span className={styles.lineNum}>{line.oldNum ?? ""}</span>
                      <span className={styles.lineNum}>{line.newNum ?? ""}</span>
                      <span className={styles.linePrefix}>{unifiedLinePrefix(line.type)}</span>
                      <span className={styles.lineContent}>{line.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "split" && (
              <div className={styles.splitGrid}>
                <div className={`${styles.splitPane} ${styles.splitPaneLeft}`}>
                  {splitData.left.map((line) => (
                    <div key={line.key} className={lineClass(line.type)}>
                      <span className={`${styles.lineNum} ${styles.lineNumNarrow}`}>
                        {line.num ?? ""}
                      </span>
                      <span className={styles.lineContentSplit}>
                        {line.content || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`${styles.splitPane} ${styles.splitPaneRight}`}>
                  {splitData.right.map((line) => (
                    <div key={line.key} className={lineClass(line.type)}>
                      <span className={`${styles.lineNum} ${styles.lineNumNarrow}`}>
                        {line.num ?? ""}
                      </span>
                      <span className={styles.lineContentSplit}>
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
