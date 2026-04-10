"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
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

type Translator = (key: string, values?: Record<string, string | number>) => string;

function describeCron(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string,
  t: Translator
): string {
  const dayName = (i: number) => t(`cron.describe.days.${i === 7 ? 0 : i}`);
  const monthName = (i: number) => t(`cron.describe.months.${i}`);

  const parts: string[] = [];

  // Day of week
  if (dow !== "*") {
    const idx = parseInt(dow);
    if (!isNaN(idx) && idx >= 0 && idx <= 7) {
      parts.push(t("cron.describe.everyDay", { day: dayName(idx) }));
    } else if (dow.includes(",")) {
      const days = dow
        .split(",")
        .map((d) => {
          const i = parseInt(d.trim());
          return !isNaN(i) ? dayName(i) : d;
        })
        .join(", ");
      parts.push(t("cron.describe.onDays", { days }));
    } else if (dow.includes("/")) {
      parts.push(
        t("cron.describe.everyNDaysOfWeek", { n: dow.split("/")[1] })
      );
    } else {
      parts.push(t("cron.describe.dayOfWeek", { value: dow }));
    }
  }

  // Month
  if (month !== "*") {
    const idx = parseInt(month);
    if (!isNaN(idx) && idx >= 1 && idx <= 12) {
      parts.push(t("cron.describe.inMonth", { month: monthName(idx) }));
    } else if (month.includes("/")) {
      parts.push(t("cron.describe.everyNMonths", { n: month.split("/")[1] }));
    } else {
      parts.push(t("cron.describe.monthValue", { value: month }));
    }
  }

  // Day of month
  if (dom !== "*") {
    if (dom.includes("/")) {
      parts.push(t("cron.describe.everyNDays", { n: dom.split("/")[1] }));
    } else {
      parts.push(t("cron.describe.onDay", { day: dom }));
    }
  }

  // Time
  if (minute === "*" && hour === "*") {
    parts.unshift(t("cron.describe.everyMinute"));
  } else if (minute === "*" && hour !== "*") {
    parts.unshift(t("cron.describe.everyMinuteOfHour", { hour }));
  } else if (minute !== "*" && hour === "*") {
    if (minute.includes("/")) {
      parts.unshift(
        t("cron.describe.everyNMinutes", { n: minute.split("/")[1] })
      );
    } else {
      parts.unshift(t("cron.describe.atMinuteOfEveryHour", { minute }));
    }
  } else {
    // Both set
    if (hour.includes("/")) {
      parts.unshift(
        t("cron.describe.everyNHoursAtMinute", {
          n: hour.split("/")[1],
          minute,
        })
      );
    } else {
      const h = parseInt(hour);
      const m = parseInt(minute);
      const timeStr =
        !isNaN(h) && !isNaN(m)
          ? `${h.toString().padStart(2, "0")}:${m
              .toString()
              .padStart(2, "0")}`
          : `${hour}:${minute}`;
      parts.unshift(t("cron.describe.atTime", { time: timeStr }));
    }
  }

  return parts.join(", ");
}

function matchesField(value: number, field: string, max: number): boolean {
  if (field === "*") return true;
  if (field.includes("/")) {
    const [base, step] = field.split("/");
    const stepN = parseInt(step);
    const baseN = base === "*" ? 0 : parseInt(base);
    if (isNaN(stepN)) return false;
    return (value - baseN) % stepN === 0 && value >= baseN;
  }
  if (field.includes(",")) {
    return field.split(",").some((v) => parseInt(v.trim()) === value);
  }
  if (field.includes("-")) {
    const [lo, hi] = field.split("-").map(Number);
    return value >= lo && value <= hi;
  }
  return parseInt(field) === value;
}

function getNextExecutions(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string,
  count: number
): Date[] {
  const results: Date[] = [];
  const now = new Date();
  const check = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  // Guard: max iterations to prevent infinite loops
  let iterations = 0;
  const maxIterations = 525600; // 1 year of minutes

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const m = check.getMinutes();
    const h = check.getHours();
    const d = check.getDate();
    const mo = check.getMonth() + 1;
    const dw = check.getDay();

    if (
      matchesField(m, minute, 59) &&
      matchesField(h, hour, 23) &&
      matchesField(d, dom, 31) &&
      matchesField(mo, month, 12) &&
      matchesField(dw, dow, 7)
    ) {
      results.push(new Date(check));
    }

    check.setMinutes(check.getMinutes() + 1);
  }

  return results;
}

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

  function formatRunDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  }

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
          {fields.map((field, i) => (
            <div key={i} className={styles.cronField}>
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
                <div key={i} className={styles.runRow}>
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
