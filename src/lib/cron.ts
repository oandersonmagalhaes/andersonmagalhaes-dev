/**
 * Pure cron-expression utilities used by the Easy Crontab tool.
 *
 * Kept dependency-free and DOM-free so they can be unit tested in isolation.
 * The React client at `src/app/[locale]/easy-crontab/client.tsx` consumes
 * these helpers — do not duplicate their logic in the component.
 */

export type CronTranslator = (
  key: string,
  values?: Record<string, string | number>
) => string;

// ---------------------------------------------------------------------------
// Internal helpers — each handles one field of the cron expression so that
// describeCron's cognitive complexity stays within SonarQube's threshold.
// ---------------------------------------------------------------------------

function describeDow(dow: string, t: CronTranslator): string | null {
  if (dow === "*") return null;
  const dayName = (i: number) => t(`cron.describe.days.${i === 7 ? 0 : i}`);
  const idx = parseInt(dow);
  if (!isNaN(idx) && idx >= 0 && idx <= 7) {
    return t("cron.describe.everyDay", { day: dayName(idx) });
  }
  if (dow.includes(",")) {
    const days = dow
      .split(",")
      .map((d) => {
        const i = parseInt(d.trim());
        return !isNaN(i) ? dayName(i) : d;
      })
      .join(", ");
    return t("cron.describe.onDays", { days });
  }
  if (dow.includes("/")) {
    return t("cron.describe.everyNDaysOfWeek", { n: dow.split("/")[1] });
  }
  return t("cron.describe.dayOfWeek", { value: dow });
}

function describeMonth(month: string, t: CronTranslator): string | null {
  if (month === "*") return null;
  const monthName = (i: number) => t(`cron.describe.months.${i}`);
  const idx = parseInt(month);
  if (!isNaN(idx) && idx >= 1 && idx <= 12) {
    return t("cron.describe.inMonth", { month: monthName(idx) });
  }
  if (month.includes("/")) {
    return t("cron.describe.everyNMonths", { n: month.split("/")[1] });
  }
  return t("cron.describe.monthValue", { value: month });
}

function describeDom(dom: string, t: CronTranslator): string | null {
  if (dom === "*") return null;
  if (dom.includes("/")) {
    return t("cron.describe.everyNDays", { n: dom.split("/")[1] });
  }
  return t("cron.describe.onDay", { day: dom });
}

function describeTime(minute: string, hour: string, t: CronTranslator): string {
  if (minute === "*" && hour === "*") {
    return t("cron.describe.everyMinute");
  }
  if (minute === "*") {
    return t("cron.describe.everyMinuteOfHour", { hour });
  }
  if (hour === "*") {
    if (minute.includes("/")) {
      return t("cron.describe.everyNMinutes", { n: minute.split("/")[1] });
    }
    return t("cron.describe.atMinuteOfEveryHour", { minute });
  }
  if (hour.includes("/")) {
    return t("cron.describe.everyNHoursAtMinute", {
      n: hour.split("/")[1],
      minute,
    });
  }
  const h = parseInt(hour);
  const m = parseInt(minute);
  const timeStr =
    !isNaN(h) && !isNaN(m)
      ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      : `${hour}:${minute}`;
  return t("cron.describe.atTime", { time: timeStr });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function describeCron(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string,
  t: CronTranslator
): string {
  const parts: string[] = [];

  const dowPart = describeDow(dow, t);
  if (dowPart) parts.push(dowPart);

  const monthPart = describeMonth(month, t);
  if (monthPart) parts.push(monthPart);

  const domPart = describeDom(dom, t);
  if (domPart) parts.push(domPart);

  parts.unshift(describeTime(minute, hour, t));

  return parts.join(", ");
}

export function matchesField(value: number, field: string): boolean {
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

export function getNextExecutions(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string,
  count: number,
  from: Date = new Date()
): Date[] {
  const results: Date[] = [];
  const check = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
    from.getHours(),
    from.getMinutes() + 1,
    0,
    0
  );

  // Guard: max iterations to prevent infinite loops (1 year of minutes)
  let iterations = 0;
  const maxIterations = 525600;

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const m = check.getMinutes();
    const h = check.getHours();
    const d = check.getDate();
    const mo = check.getMonth() + 1;
    const dw = check.getDay();

    if (
      matchesField(m, minute) &&
      matchesField(h, hour) &&
      matchesField(d, dom) &&
      matchesField(mo, month) &&
      matchesField(dw, dow)
    ) {
      results.push(new Date(check));
    }

    check.setMinutes(check.getMinutes() + 1);
  }

  return results;
}

export function formatRunDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}
