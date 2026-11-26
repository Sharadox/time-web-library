"use client";
import { useSyncExternalStore } from "react";
import type { CopyrightYearsProperties } from "@sharadox/time-web-library/copyright-years/type";

/** "2026" in the first year, "2026–2027" once another has begun. */
const years = (since: number, current: number) => (current > since ? `${since}–${current}` : `${since}`);

const never = () => () => {};

/**
 * The years for a copyright line, from the first year to the current one: "1996–2026", or just "2026" while the
 * first year lasts. The clock is read only in the browser (building a page ahead of time may not read it, and it
 * would go out of date): the built page shows the first year, and the browser writes in its own at once.
 *
 * @example
 * <p>© <CopyrightYears since={1996} /> Example, Lda.</p>
 */
export function CopyrightYears({ since }: CopyrightYearsProperties) {
  const current = useSyncExternalStore(
    never,
    () => new Date().getFullYear(),
    () => since,
  );
  return <span suppressHydrationWarning>{years(since, current)}</span>;
}
