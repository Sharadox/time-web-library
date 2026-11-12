import type { Closure, OpeningHours, OpeningStatus } from "@sharadox/time-web-library/opening-status/type";

const minutes = (time: string) => {
  const [hours, rest] = time.split(":");
  return Number(hours) * 60 + Number(rest);
};

/** The date, weekday (ISO) and minutes since midnight at a moment, on a time zone's calendar and clock. */
function localNow(moment: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(moment)
      .map((part) => [part.type, part.value]),
  );
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return { date, minute: Number(parts.hour) * 60 + Number(parts.minute) };
}

/** A calendar date some days later: addDays("2026-12-31", 1) is "2027-01-01". */
const addDays = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

/** The ISO weekday of a calendar date (1 is Monday). */
const weekdayOf = (date: string) => ((new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7) + 1;

/** The closure covering a calendar date, if any. */
const closureOn = <Gap extends Closure>(hours: OpeningHours<Gap>, date: string) =>
  hours.closures?.find((closure) => closure.from <= date && date <= closure.to);

/**
 * Whether a place is open at a moment, on its own clock (whatever the visitor's time zone), and when that next
 * changes: the closing time while open, or the next opening (later today, or the next open day, past any closure)
 * while closed. During a closure it says which.
 *
 * @example
 * openingStatus(new Date(), { days: [1, 2, 3, 4, 5], periods: [{ opens: "09:00", closes: "18:00" }],
 *   timeZone: "Europe/Lisbon", closures: [{ from: "2026-12-24", to: "2026-12-26" }] });
 * // { open: true, change: { day: 3, time: "18:00", inDays: 0, date: "2026-11-18" } }
 */
export function openingStatus<Gap extends Closure>(moment: Date, hours: OpeningHours<Gap>): OpeningStatus<Gap> {
  const now = localNow(moment, hours.timeZone);
  const periods = [...hours.periods].sort((first, second) => minutes(first.opens) - minutes(second.opens));
  const closure = closureOn(hours, now.date);
  const openOn = (date: string) => hours.days.includes(weekdayOf(date)) && !closureOn(hours, date);
  const today = { day: weekdayOf(now.date), date: now.date, inDays: 0 };
  if (openOn(now.date)) {
    const current = periods.find(
      (period) => minutes(period.opens) <= now.minute && now.minute < minutes(period.closes),
    );
    if (current) return { open: true, change: { ...today, time: current.closes } };
    const later = periods.find((period) => now.minute < minutes(period.opens));
    if (later) return { open: false, change: { ...today, time: later.opens } };
  }
  // A year ahead is plenty: longer closures than that are not opening hours.
  for (let inDays = 1; inDays <= 366; inDays++) {
    const date = addDays(now.date, inDays);
    if (openOn(date)) {
      return {
        open: false,
        ...(closure ? { closure } : {}),
        change: { day: weekdayOf(date), time: periods[0]!.opens, inDays, date },
      };
    }
  }
  throw new Error("openingStatus: no opening day within a year");
}

/**
 * The closure still to come or under way at a moment (the earliest that has not ended), to announce it ahead.
 *
 * @example
 * nextClosure(new Date("2026-11-20"), hours); // { from: "2026-12-12", to: "2027-01-03" }
 */
export function nextClosure<Gap extends Closure>(moment: Date, hours: OpeningHours<Gap>): Gap | undefined {
  const today = localNow(moment, hours.timeZone).date;
  return [...(hours.closures ?? [])]
    .sort((first, second) => first.from.localeCompare(second.from))
    .find((closure) => closure.to >= today);
}

/**
 * The first open day after a closure, on the place's calendar: when it reopens.
 *
 * @example
 * reopening({ from: "2026-12-12", to: "2027-01-03" }, hours); // "2027-01-04"
 */
export function reopening<Gap extends Closure>(closure: Gap, hours: OpeningHours<Gap>): string {
  for (let inDays = 1; inDays <= 366; inDays++) {
    const date = addDays(closure.to, inDays);
    if (hours.days.includes(weekdayOf(date)) && !closureOn(hours, date)) return date;
  }
  throw new Error("openingStatus: no opening day within a year");
}
