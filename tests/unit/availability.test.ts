import { describe, it, expect } from "vitest";
import {
  rangesOverlap,
  isDateRangeAvailable,
  getUnavailableDates,
  parseDateOnly,
  formatDateOnly,
  toExclusiveEnd,
} from "@/lib/availability";

describe("rangesOverlap", () => {
  it("detects overlapping ranges", () => {
    expect(
      rangesOverlap(
        { startDate: parseDateOnly("2025-01-10"), endDate: parseDateOnly("2025-01-15") },
        { startDate: parseDateOnly("2025-01-12"), endDate: parseDateOnly("2025-01-18") },
      ),
    ).toBe(true);
  });

  it("returns false for adjacent non-overlapping ranges", () => {
    expect(
      rangesOverlap(
        { startDate: parseDateOnly("2025-01-10"), endDate: parseDateOnly("2025-01-15") },
        { startDate: parseDateOnly("2025-01-15"), endDate: parseDateOnly("2025-01-20") },
      ),
    ).toBe(false);
  });
});

describe("isDateRangeAvailable", () => {
  it("returns false when blocked", () => {
    const result = isDateRangeAvailable(
      [{ startDate: parseDateOnly("2025-01-12"), endDate: parseDateOnly("2025-01-14") }],
      [],
      { startDate: parseDateOnly("2025-01-10"), endDate: parseDateOnly("2025-01-16") },
    );
    expect(result).toBe(false);
  });

  it("returns true when no conflicts", () => {
    const result = isDateRangeAvailable(
      [{ startDate: parseDateOnly("2025-01-20"), endDate: parseDateOnly("2025-01-25") }],
      [],
      { startDate: parseDateOnly("2025-01-10"), endDate: parseDateOnly("2025-01-15") },
    );
    expect(result).toBe(true);
  });
});

describe("getUnavailableDates", () => {
  it("returns blocked dates in range", () => {
    const dates = getUnavailableDates(
      [{ startDate: parseDateOnly("2025-01-12"), endDate: parseDateOnly("2025-01-14") }],
      [],
      parseDateOnly("2025-01-10"),
      parseDateOnly("2025-01-15"),
    );
    expect(dates).toContain("2025-01-12");
    expect(dates).toContain("2025-01-13");
    expect(dates).not.toContain("2025-01-14");
  });

  it("blocks a single day correctly (no timezone shift)", () => {
    const dates = getUnavailableDates(
      [
        {
          startDate: parseDateOnly("2025-06-25"),
          endDate: toExclusiveEnd(parseDateOnly("2025-06-25")),
        },
      ],
      [],
      parseDateOnly("2025-06-20"),
      parseDateOnly("2025-06-30"),
    );
    expect(dates).toContain("2025-06-25");
    expect(dates).not.toContain("2025-06-24");
    expect(dates).not.toContain("2025-06-26");
  });
});

describe("parseDateOnly", () => {
  it("parses yyyy-MM-dd without timezone shift", () => {
    const date = parseDateOnly("2025-06-15");
    expect(date.getUTCFullYear()).toBe(2025);
    expect(date.getUTCMonth()).toBe(5);
    expect(date.getUTCDate()).toBe(15);
    expect(formatDateOnly(date)).toBe("2025-06-15");
  });
});
