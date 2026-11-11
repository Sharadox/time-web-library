import { expect, test } from "vitest";
import { minutesInZone } from "@sharadox/time-web-library/zone-minute";

test.each([
  ["2026-07-01T16:30:00Z", "Europe/Lisbon", 17 * 60 + 30],
  ["2026-01-15T16:30:00Z", "Europe/Lisbon", 16 * 60 + 30],
  ["2026-01-15T23:59:00Z", "Asia/Tokyo", 8 * 60 + 59],
])("%s in %s is minute %s", (date, zone, expected) => {
  expect(minutesInZone(new Date(date), zone)).toBe(expected);
});
