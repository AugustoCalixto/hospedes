export type DateRange = {
  startDate: Date;
  endDate: Date;
};

/** Parse yyyy-MM-dd as UTC midnight (safe for @db.Date fields) */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format a date-only value without timezone shift */
export function formatDateOnly(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysUTC(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** UI inclusive end → storage exclusive end (hospitality convention) */
export function toExclusiveEnd(inclusiveEnd: Date): Date {
  return addDaysUTC(inclusiveEnd, 1);
}

/** Storage exclusive end → UI inclusive end for display */
export function toInclusiveEnd(exclusiveEnd: Date): Date {
  return addDaysUTC(exclusiveEnd, -1);
}

export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.startDate < b.endDate && b.startDate < a.endDate;
}

export function isDateRangeAvailable(
  blocks: DateRange[],
  reservations: DateRange[],
  requested: DateRange,
): boolean {
  const occupied = [...blocks, ...reservations];
  return !occupied.some((range) => rangesOverlap(range, requested));
}

export function getUnavailableDates(
  blocks: DateRange[],
  reservations: DateRange[],
  from: Date,
  to: Date,
): string[] {
  const dates: string[] = [];
  let current = from;

  while (current.getTime() <= to.getTime()) {
    const dayEnd = addDaysUTC(current, 1);
    const isBlocked = [...blocks, ...reservations].some((range) =>
      rangesOverlap({ startDate: current, endDate: dayEnd }, range),
    );

    if (isBlocked) {
      dates.push(formatDateOnly(current));
    }

    current = addDaysUTC(current, 1);
  }

  return dates;
}

/** Format an inclusive period for display (start → end inclusive) */
export function formatInclusivePeriod(start: Date, exclusiveEnd: Date): string {
  const startStr = formatDateOnly(start);

  if (exclusiveEnd.getTime() <= start.getTime()) {
    return startStr;
  }

  const endStr = formatDateOnly(toInclusiveEnd(exclusiveEnd));
  if (startStr === endStr) return startStr;
  return `${startStr} — ${endStr}`;
}
