import { expect, test } from "vitest";
import { roundDown } from "@sharadox/time-web-library/round-down";

test.each([
  ["2026-07-01T20:52:30Z", 15, 45, "2026-07-01T20:00:00.000Z"],
  ["2026-07-01T20:52:30Z", 15, 0, "2026-07-01T20:45:00.000Z"],
  ["2026-07-01T00:10:00Z", 30, 20, "2026-06-30T23:30:00.000Z"],
])("roundDown(%s, %s, %s) is %s", (date, step, before, expected) => {
  expect(roundDown(new Date(date), step, before).toISOString()).toBe(expected);
});

test("doesn't move the time by default", () => {
  expect(roundDown(new Date("2026-07-01T10:15:00Z"), 15).toISOString()).toBe("2026-07-01T10:15:00.000Z");
});
