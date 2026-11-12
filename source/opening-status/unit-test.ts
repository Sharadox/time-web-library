import { describe, expect, test } from "vitest";
import { nextClosure, openingStatus, reopening } from "@sharadox/time-web-library/opening-status";
import type { OpeningHours } from "@sharadox/time-web-library/opening-status/type";

// Monday to Friday, with lunch; shut for Christmas. 2026-11-16 is a Monday; Lisbon is on UTC in winter.
const hours: OpeningHours<{ from: string; to: string; name: string }> = {
  days: [1, 2, 3, 4, 5],
  periods: [
    { opens: "14:00", closes: "18:00" },
    { opens: "09:00", closes: "13:00" },
  ],
  timeZone: "Europe/Lisbon",
  closures: [
    { from: "2027-04-02", to: "2027-04-02", name: "Easter" },
    { from: "2026-12-12", to: "2027-01-03", name: "Christmas" },
  ],
};
const at = (iso: string) => openingStatus(new Date(iso), hours);

describe("on the place's clock", () => {
  test.each([
    ["2026-11-16T08:59:00Z", false, { day: 1, time: "09:00", inDays: 0, date: "2026-11-16" }],
    ["2026-11-16T09:00:00Z", true, { day: 1, time: "13:00", inDays: 0, date: "2026-11-16" }],
    ["2026-11-16T13:30:00Z", false, { day: 1, time: "14:00", inDays: 0, date: "2026-11-16" }],
    ["2026-11-16T17:59:00Z", true, { day: 1, time: "18:00", inDays: 0, date: "2026-11-16" }],
    ["2026-11-16T18:00:00Z", false, { day: 2, time: "09:00", inDays: 1, date: "2026-11-17" }],
    ["2026-11-20T19:00:00Z", false, { day: 1, time: "09:00", inDays: 3, date: "2026-11-23" }],
    // Summer time: 08:30 UTC is 09:30 in Lisbon.
    ["2026-07-06T08:30:00Z", true, { day: 1, time: "13:00", inDays: 0, date: "2026-07-06" }],
  ])("%s", (iso, open, change) => {
    expect(at(iso)).toEqual({ open, change });
  });

  test("skips a closure ahead, and says which closure it is during one", () => {
    expect(at("2026-12-11T19:00:00Z")).toEqual({
      open: false,
      change: { day: 1, time: "09:00", inDays: 24, date: "2027-01-04" },
    });
    expect(at("2026-12-28T10:00:00Z")).toMatchObject({
      open: false,
      closure: { name: "Christmas" },
      change: { date: "2027-01-04", inDays: 7 },
    });
  });

  test("fails loudly without any opening day", () => {
    expect(() => openingStatus(new Date(), { ...hours, days: [] })).toThrow("no opening day");
  });
});

describe("closures", () => {
  test("announces the next closure until it has ended", () => {
    expect(nextClosure(new Date("2026-11-20T12:00:00Z"), hours)?.name).toBe("Christmas");
    expect(nextClosure(new Date("2027-01-03T23:00:00Z"), hours)?.name).toBe("Christmas");
    expect(nextClosure(new Date("2027-01-04T09:00:00Z"), hours)?.name).toBe("Easter");
    expect(nextClosure(new Date("2027-05-01T09:00:00Z"), hours)).toBeUndefined();
    expect(nextClosure(new Date(), { ...hours, closures: undefined })).toBeUndefined();
  });

  test("finds the first open day after a closure", () => {
    expect(reopening(hours.closures![1]!, hours)).toBe("2027-01-04");
    expect(reopening(hours.closures![0]!, hours)).toBe("2027-04-05");
    expect(() => reopening(hours.closures![0]!, { ...hours, days: [] })).toThrow("no opening day");
  });
});
