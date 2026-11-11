import { expect, test } from "vitest";
import { openState } from "@sharadox/time-web-library/open-state";

test("knows before, during and after opening hours in the zone", () => {
  const hours = [
    [11, 30],
    [22, 0],
  ] as const;
  const zone = "Europe/Lisbon";
  expect(openState(new Date("2026-01-15T11:29:00Z"), ...hours, zone)).toBe("before");
  expect(openState(new Date("2026-01-15T11:30:00Z"), ...hours, zone)).toBe("open");
  expect(openState(new Date("2026-01-15T22:00:00Z"), ...hours, zone)).toBe("after");
  expect(openState(new Date("2026-07-15T21:30:00Z"), ...hours, zone)).toBe("after"); // 22:30 summer time
});
