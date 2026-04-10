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

export function describeCron(
  minute: string,
  hour: string,
  dom: string,
  month: string,
  dow: string,
  t: CronTranslator
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
