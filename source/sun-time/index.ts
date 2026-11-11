import type { SunTimes } from "@sharadox/time-web-library/sun-time/type";

const RADIANS_PER_DEGREE = Math.PI / 180;

/** Sunrise and sunset for a date and place (NOAA solar position approximation, ±1–2 minutes). */
export function sunTimes(date: Date, latitude: number, longitude: number): SunTimes {
  const year = date.getUTCFullYear();
  const midnight = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());
  const day = Math.floor((midnight - Date.UTC(year, 0, 0)) / 864e5);
  const yearAngle = ((2 * Math.PI) / 365) * (day - 1 + 0.5);
  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(yearAngle) -
      0.032077 * Math.sin(yearAngle) -
      0.014615 * Math.cos(2 * yearAngle) -
      0.040849 * Math.sin(2 * yearAngle));
  const declination =
    0.006918 -
    0.399912 * Math.cos(yearAngle) +
    0.070257 * Math.sin(yearAngle) -
    0.006758 * Math.cos(2 * yearAngle) +
    0.000907 * Math.sin(2 * yearAngle) -
    0.002697 * Math.cos(3 * yearAngle) +
    0.00148 * Math.sin(3 * yearAngle);
  const hourAngle =
    Math.acos(
      Math.cos(90.833 * RADIANS_PER_DEGREE) / (Math.cos(latitude * RADIANS_PER_DEGREE) * Math.cos(declination)) -
        Math.tan(latitude * RADIANS_PER_DEGREE) * Math.tan(declination),
    ) / RADIANS_PER_DEGREE;
  const riseMinutes = 720 - 4 * (longitude + hourAngle) - equationOfTime;
  const setMinutes = 720 - 4 * (longitude - hourAngle) - equationOfTime;
  return { rise: new Date(midnight + riseMinutes * 6e4), set: new Date(midnight + setMinutes * 6e4) };
}
