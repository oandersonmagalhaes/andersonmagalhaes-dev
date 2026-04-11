"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { describeCron, getNextExecutions, formatRunDate } from "@/lib/cron";
import tools from "../tools.module.css";
import styles from "./Crontab.module.css";

interface CronField {
  label: string;
  placeholder: string;
  value: string;
}

const PRESETS: { label: string; values: [string, string, string, string, string] }[] = [
  { label: "everyMinute", values: ["*", "*", "*", "*", "*"] },
  { label: "everyHour", values: ["0", "*", "*", "*", "*"] },
  { label: "everyDayMidnight", values: ["0", "0", "*", "*", "*"] },
  { label: "everyMonday", values: ["0", "0", "*", "*", "1"] },
  { label: "everyMonth1st", values: ["0", "0", "1", "*", "*"] },
];

export default function EasyCrontabClient() {
  const t = useTranslations("tools");
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  const expression = `${minute} ${hour} ${dom} ${month} ${dow}`;
  const description = useMemo(
    () => describeCron(minute, hour, dom, month, dow, t),
    [minute, hour, dom, month, dow, t]
  );

  // Compute next runs only on the client to avoid hydration mismatch
  // (depends on `new Date()` and locale-specific formatting)
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  useEffect(() => {
    setNextRuns(getNextExecutions(minute, hour, dom, month, dow, 5));
  }, [minute, hour, dom, month, dow]);

  const fields: (CronField & { setter: (v: string) => void })[] = [
    { label: t("cron.minute"), placeholder: "0-59", value: minute, setter: setMinute },
    { label: t("cron.hour"), placeholder: "0-23", value: hour, setter: setHour },
    { label: t("cron.dayOfMonth"), placeholder: "1-31", value: dom, setter: setDom },
    { label: t("cron.month"), placeholder: "1-12", value: month, setter: setMonth },
    { label: t("cron.dayOfWeek"), placeholder: "0-7", value: dow, setter: setDow },
  ];

  function applyPreset(values: [string, string, string, string, string]) {
    setMinute(values[0]);
    setHour(values[1]);
    setDom(values[2]);
    setMonth(values[3]);
    setDow(values[4]);
  }

  return (
    <ToolLayout titleKey="cron.title" descriptionKey="cron.description">
      <div className={tools.stack}>
        <div className={styles.fieldsGrid}>
          {fields.map((field) => (
            <div key={field.label} className={styles.cronField}>
              <label className={styles.cronFieldLabel}>{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className={styles.cronInput}
              />
              <span className={styles.cronHint}>{field.placeholder}</span>
            </div>
          ))}
        </div>

        <div className={styles.expressionPanel}>
          <div className={styles.expressionRow}>
            <span className={tools.eyebrow}>{t("cron.expression")}</span>
            <CopyButton text={expression} />
          </div>
          <div className={styles.expression}>{expression}</div>
        </div>

        <div className={styles.descriptionBox}>
          <p className={styles.descriptionText}>{description}</p>
        </div>

        <div className={styles.presetsSection}>
          <span className={tools.eyebrow}>{t("cron.presets")}</span>
          <div className={styles.presetsRow}>
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(preset.values)}
              >
                {t(`cron.${preset.label}`)}
              </Button>
            ))}
          </div>
        </div>

        {nextRuns.length > 0 && (
          <div className={styles.runsSection}>
            <span className={tools.eyebrow}>{t("cron.nextRuns")}</span>
            <div className={styles.runsList}>
              {nextRuns.map((date, i) => (
                <div key={formatRunDate(date)} className={styles.runRow}>
                  <span className={styles.runIndex}>{i + 1}</span>
                  <span className={styles.runDate}>{formatRunDate(date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
