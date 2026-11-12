/** Days a place is shut outside its usual hours, as dates on its own calendar (both included). */
export interface Closure {
  /** "2026-12-12". */
  from: string;
  /** "2027-01-03". */
  to: string;
}

/** A place's usual hours, the time zone they are in, and any closures. */
export interface OpeningHours<Gap extends Closure = Closure> {
  /** ISO weekdays: 1 is Monday, 7 is Sunday. */
  days: readonly number[];
  /** Open periods each of those days, on a 24-hour clock: "09:00". */
  periods: readonly { opens: string; closes: string }[];
  /** For example "Europe/Lisbon". */
  timeZone: string;
  closures?: readonly Gap[];
}

/** Whether the place is open at a moment, and when that next changes. */
export interface OpeningStatus<Gap extends Closure = Closure> {
  open: boolean;
  /** The closure it is shut for right now, if any. */
  closure?: Gap;
  /** When it next closes (if open) or opens (if closed). */
  change: {
    /** ISO weekday of the change. */
    day: number;
    /** "13:00". */
    time: string;
    /** 0 today, 1 tomorrow, and so on. */
    inDays: number;
    /** The date of the change on the place's calendar: "2027-01-04". */
    date: string;
  };
}
