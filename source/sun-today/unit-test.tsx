import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useSunToday } from "@sharadox/time-web-library/sun-today";

const ALMANCIL = [37.08, -8.03] as const;
afterEach(() => vi.useRealTimers());

test("gives today's times during the day, refreshed every minute", () => {
  vi.useFakeTimers({ now: new Date("2026-07-01T12:00:00Z") });
  const { result, unmount } = renderHook(() => useSunToday(...ALMANCIL));
  expect(result.current).toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toMatchObject({ tomorrow: false });
  expect(result.current!.set.toISOString().slice(0, 10)).toBe("2026-07-01");
  act(() => vi.advanceTimersByTime(60_000));
  expect(result.current!.now.toISOString().slice(0, 16)).toBe("2026-07-01T12:01");
  unmount();
});

test("gives tomorrow's times after sunset", () => {
  vi.useFakeTimers({ now: new Date("2026-07-01T22:30:00Z") });
  const { result } = renderHook(() => useSunToday(...ALMANCIL));
  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toMatchObject({ tomorrow: true });
  expect(result.current!.set.toISOString().slice(0, 10)).toBe("2026-07-02");
});
