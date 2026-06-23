export type DateRange = {
  startDate: Date;
  endDate: Date;
};

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
): Date[] {
  const dates: Date[] = [];
  const current = new Date(from);
  current.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const dayStart = new Date(current);
    const dayEnd = new Date(current);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const isBlocked = [...blocks, ...reservations].some((range) =>
      rangesOverlap(
        { startDate: dayStart, endDate: dayEnd },
        range,
      ),
    );

    if (isBlocked) {
      dates.push(new Date(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
