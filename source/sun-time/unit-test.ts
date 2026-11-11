import { expect, test } from "vitest";
import { formatTime } from "@sharadox/time-web-library/format-time";
import { sunTimes } from "@sharadox/time-web-library/sun-time";

// Reference values for Vale do Lobo (Algarve) from the suncalc library (independent implementation), ±3 min.
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const near = (actual: Date, expected: string) =>
  expect(Math.abs(minutes(formatTime(actual, "Europe/Lisbon")) - minutes(expected))).toBeLessThanOrEqual(3);

test("matches reference sunrise and sunset at the solstices", () => {
  const summer = sunTimes(new Date("2026-06-21T12:00:00Z"), 37.04, -8.05);
  near(summer.rise, "06:13");
  near(summer.set, "20:56");
  const winter = sunTimes(new Date("2026-12-21T12:00:00Z"), 37.04, -8.05);
  near(winter.rise, "07:43");
  near(winter.set, "17:19");
});
