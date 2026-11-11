import { expect, test } from "vitest";
import { formatTime } from "@sharadox/time-web-library/format-time";

test("formats on a 24-hour clock in the zone", () => {
  expect(formatTime(new Date("2026-07-15T20:05:00Z"), "Europe/Lisbon")).toBe("21:05");
});
