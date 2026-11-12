"use client";
import { useEffect, useRef } from "react";
import type { CopyrightYearsProperties } from "@sharadox/time-web-library/copyright-years/type";

/** "2026" in the first year, "2026–2027" once another has begun. */
const years = (since: number, current: number) => (current > since ? `${since}–${current}` : `${since}`);

/**
 * The years for a copyright line, from the first year to the current one, moving on by itself: "1996–2026", or just
 * "2026" while the first year lasts. Pages are built ahead of time, so the browser writes in its own year once it runs
 * (in case the page was built in an earlier year).
 *
 * @example
 * <p>© <CopyrightYears since={1996} /> Example, Lda.</p>
 */
export function CopyrightYears({ since }: CopyrightYearsProperties) {
  const element = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    element.current!.textContent = years(since, new Date().getFullYear());
  }, [since]);
  return (
    <span ref={element} suppressHydrationWarning>
      {years(since, new Date().getFullYear())}
    </span>
  );
}
