"use client";
import { useEffect, useState } from "react";
import { sunTimes } from "@sharadox/time-web-library/sun-time";
import type { SunToday } from "@sharadox/time-web-library/sun-today/type";

/** Today's sunrise and sunset at a place (tomorrow's once the sun has set), refreshed every minute. Null until mounted. */
export function useSunToday(latitude: number, longitude: number) {
  const [sun, setSun] = useState<SunToday | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let times = sunTimes(now, latitude, longitude);
      const tomorrow = now > times.set;
      if (tomorrow) times = sunTimes(new Date(now.getTime() + 864e5), latitude, longitude);
      setSun({ ...times, now, tomorrow });
    };
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [latitude, longitude]);
  return sun;
}
