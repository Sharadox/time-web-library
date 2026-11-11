import { expect, test } from "vitest";
import { sunTimes } from "@sharadox/time-web-library/sun-time";

/** A live sun dial recomputes every minute; a full year of days must stay trivial. */
test("computes a year of sun times within one frame", async ({ bench }) => {
  const result = await bench("365 days of sun times", () => {
    for (let day = 0; day < 365; day++) sunTimes(new Date(Date.UTC(2026, 0, 1 + day)), 37.04, -8.05);
  }).run();
  expect(result.latency.mean).toBeLessThan(16);
});
