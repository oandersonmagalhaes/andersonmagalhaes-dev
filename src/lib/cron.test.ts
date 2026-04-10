import { describe, it, expect } from "vitest";
import {
  describeCron,
  matchesField,
  getNextExecutions,
  formatRunDate,
  type CronTranslator,
} from "./cron";

/**
 * Identity translator: returns the key plus its values, so assertions can
 * check which i18n key would have been used without coupling to real
 * message bundles.
 */
const t: CronTranslator = (key, values) =>
  values
    ? `${key}(${Object.entries(values)
        .map(([k, v]) => `${k}=${v}`)
        .join(",")})`
    : key;

describe("matchesField()", () => {
  describe("when the field is a wildcard", () => {
    it("then matches any value", () => {
      expect(matchesField(0, "*")).toBe(true);
      expect(matchesField(42, "*")).toBe(true);
    });
  });

  describe("when the field is a literal value", () => {
    it("then only matches that exact value", () => {
      expect(matchesField(5, "5")).toBe(true);
      expect(matchesField(6, "5")).toBe(false);
    });
  });

  describe("when the field is a comma list", () => {
    it("then matches any of the listed values", () => {
      expect(matchesField(1, "1,3,5")).toBe(true);
      expect(matchesField(3, "1,3,5")).toBe(true);
      expect(matchesField(2, "1,3,5")).toBe(false);
    });
  });

  describe("when the field is a range", () => {
    it("then matches values inside the range (inclusive)", () => {
      expect(matchesField(2, "2-5")).toBe(true);
      expect(matchesField(5, "2-5")).toBe(true);
      expect(matchesField(6, "2-5")).toBe(false);
    });
  });

  describe("when the field is a step", () => {
    it("then matches multiples of the step starting from the base", () => {
      expect(matchesField(0, "*/15")).toBe(true);
      expect(matchesField(15, "*/15")).toBe(true);
      expect(matchesField(30, "*/15")).toBe(true);
      expect(matchesField(20, "*/15")).toBe(false);
    });

    it("then respects an explicit base offset", () => {
      expect(matchesField(5, "5/10")).toBe(true);
      expect(matchesField(15, "5/10")).toBe(true);
      expect(matchesField(4, "5/10")).toBe(false);
    });

    it("then returns false when the step is not a number", () => {
      expect(matchesField(10, "*/abc")).toBe(false);
    });
  });
});

describe("describeCron()", () => {
  describe("when every field is a wildcard", () => {
    it("then describes the expression as 'every minute'", () => {
      expect(describeCron("*", "*", "*", "*", "*", t)).toBe(
        "cron.describe.everyMinute"
      );
    });
  });

  describe("when minute and hour are explicit", () => {
    it("then describes a fixed time of day padded to HH:MM", () => {
      expect(describeCron("5", "9", "*", "*", "*", t)).toBe(
        "cron.describe.atTime(time=09:05)"
      );
    });
  });

  describe("when only the minute uses a step", () => {
    it("then describes 'every N minutes'", () => {
      expect(describeCron("*/15", "*", "*", "*", "*", t)).toBe(
        "cron.describe.everyNMinutes(n=15)"
      );
    });
  });

  describe("when day-of-week is given", () => {
    it("then describes the day name and includes the time", () => {
      expect(describeCron("0", "0", "*", "*", "1", t)).toBe(
        "cron.describe.atTime(time=00:00), cron.describe.everyDay(day=cron.describe.days.1)"
      );
    });

    it("then folds Sunday alias 7 onto index 0", () => {
      expect(describeCron("0", "0", "*", "*", "7", t)).toBe(
        "cron.describe.atTime(time=00:00), cron.describe.everyDay(day=cron.describe.days.0)"
      );
    });
  });

  describe("when day-of-month and month are given", () => {
    it("then describes the calendar date in addition to the time", () => {
      expect(describeCron("0", "12", "1", "1", "*", t)).toBe(
        "cron.describe.atTime(time=12:00), cron.describe.inMonth(month=cron.describe.months.1), cron.describe.onDay(day=1)"
      );
    });
  });

  describe("when day-of-month is a step value", () => {
    it("then describes 'every N days'", () => {
      expect(describeCron("0", "0", "*/3", "*", "*", t)).toBe(
        "cron.describe.atTime(time=00:00), cron.describe.everyNDays(n=3)"
      );
    });
  });

  describe("when hour is set but minute is wildcard", () => {
    it("then describes 'every minute of hour H'", () => {
      expect(describeCron("*", "9", "*", "*", "*", t)).toBe(
        "cron.describe.everyMinuteOfHour(hour=9)"
      );
    });
  });

  describe("when minute is fixed and hour is wildcard", () => {
    it("then describes 'at minute M of every hour'", () => {
      expect(describeCron("30", "*", "*", "*", "*", t)).toBe(
        "cron.describe.atMinuteOfEveryHour(minute=30)"
      );
    });
  });

  describe("when hour is a step value", () => {
    it("then describes 'every N hours at minute M'", () => {
      expect(describeCron("0", "*/2", "*", "*", "*", t)).toBe(
        "cron.describe.everyNHoursAtMinute(n=2,minute=0)"
      );
    });
  });

  describe("when day-of-week is a non-numeric comma list", () => {
    it("then joins the parts via the onDays key", () => {
      // Non-numeric so parseInt() returns NaN and the comma branch fires.
      expect(describeCron("0", "0", "*", "*", "mon,wed,fri", t)).toBe(
        "cron.describe.atTime(time=00:00), cron.describe.onDays(days=mon, wed, fri)"
      );
    });
  });

  describe("when month is a step value", () => {
    it("then describes 'every N months'", () => {
      expect(describeCron("0", "0", "1", "*/2", "*", t)).toBe(
        "cron.describe.atTime(time=00:00), cron.describe.everyNMonths(n=2), cron.describe.onDay(day=1)"
      );
    });
  });
});

describe("getNextExecutions()", () => {
  describe("when the expression matches every minute", () => {
    it("then returns N consecutive minutes starting one minute after `from`", () => {
      const from = new Date(2024, 0, 1, 12, 0, 0);
      const runs = getNextExecutions("*", "*", "*", "*", "*", 3, from);
      expect(runs).toHaveLength(3);
      expect(runs[0]).toEqual(new Date(2024, 0, 1, 12, 1, 0));
      expect(runs[1]).toEqual(new Date(2024, 0, 1, 12, 2, 0));
      expect(runs[2]).toEqual(new Date(2024, 0, 1, 12, 3, 0));
    });
  });

  describe("when the expression is daily at midnight", () => {
    it("then returns the next midnights", () => {
      const from = new Date(2024, 5, 10, 8, 30, 0);
      const runs = getNextExecutions("0", "0", "*", "*", "*", 2, from);
      expect(runs[0]).toEqual(new Date(2024, 5, 11, 0, 0, 0));
      expect(runs[1]).toEqual(new Date(2024, 5, 12, 0, 0, 0));
    });
  });

  describe("when no future occurrence exists within a year", () => {
    it("then returns fewer results than requested instead of looping forever", () => {
      // Day-of-month 31 in February will never match — guard caps iteration.
      const from = new Date(2024, 0, 1, 0, 0, 0);
      const runs = getNextExecutions("0", "0", "31", "2", "*", 1, from);
      expect(runs).toEqual([]);
    });
  });
});

describe("formatRunDate()", () => {
  describe("when given a date with single-digit components", () => {
    it("then zero-pads month, day, hour, minute, and second", () => {
      const d = new Date(2024, 0, 2, 3, 4, 5);
      expect(formatRunDate(d)).toBe("2024-01-02 03:04:05");
    });
  });

  describe("when given a date with two-digit components", () => {
    it("then formats them without modification", () => {
      const d = new Date(2031, 11, 25, 14, 30, 59);
      expect(formatRunDate(d)).toBe("2031-12-25 14:30:59");
    });
  });
});
