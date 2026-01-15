/**
 * Format a week range: "Jan 6-12, 2026" or "Dec 30 - Jan 5, 2026"
 */
export function formatWeekRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Get ISO week number from a date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Get the Monday-Sunday bounds for the current week
 */
export function getCurrentWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  return getWeekBoundsForDate(now);
}

/**
 * Get week bounds (Monday-Sunday) for a specific date
 */
export function getWeekBoundsForDate(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust for Monday start (Sunday = 0, so we treat it as 7)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  const start = new Date(d);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Check if a timestamp represents the current week
 */
export function isCurrentWeek(weekStartTimestamp: number): boolean {
  const current = getCurrentWeekBounds();
  return weekStartTimestamp === current.start.getTime();
}
