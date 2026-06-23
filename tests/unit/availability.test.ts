import { describe, it, expect } from "vitest";
import {
  rangesOverlap,
  isDateRangeAvailable,
  getUnavailableDates,
  parseDateOnly,
} from "@/lib/availability";

describe("rangesOverlap", () => {
  it("detects overlapping ranges", () => {
    expect(
      rangesOverlap(
        { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
        { startDate: new Date(2025, 0, 12), endDate: new Date(2025, 0, 18) },
      ),
    ).toBe(true);
  });

  it("returns false for adjacent non-overlapping ranges", () => {
    expect(
      rangesOverlap(
        { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
        { startDate: new Date(2025, 0, 15), endDate: new Date(2025, 0, 20) },
      ),
    ).toBe(false);
  });
});

describe("isDateRangeAvailable", () => {
  it("returns false when blocked", () => {
    const result = isDateRangeAvailable(
      [{ startDate: new Date(2025, 0, 12), endDate: new Date(2025, 0, 14) }],
      [],
      { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 16) },
    );
    expect(result).toBe(false);
  });

  it("returns true when no conflicts", () => {
    const result = isDateRangeAvailable(
      [{ startDate: new Date(2025, 0, 20), endDate: new Date(2025, 0, 25) }],
      [],
      { startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
    );
    expect(result).toBe(true);
  });
});

describe("getUnavailableDates", () => {
  it("returns blocked dates in range", () => {
    const dates = getUnavailableDates(
      [{ startDate: new Date(2025, 0, 12), endDate: new Date(2025, 0, 14) }],
      [],
      new Date(2025, 0, 10),
      new Date(2025, 0, 15),
    );
    expect(dates.length).toBeGreaterThan(0);
  });
});

describe("parseDateOnly", () => {
  it("parses yyyy-MM-dd without timezone shift", () => {
    const date = parseDateOnly("2025-06-15");
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(15);
  });
});
