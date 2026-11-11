/**
 * The instant rounded down to a step of minutes (UTC minutes, so every time zone with whole-hour offsets agrees),
 * after moving it back by `before` minutes. Handy for suggested times: 45 minutes before sunset, on the quarter hour.
 *
 * @example
 * roundDown(new Date("2026-07-01T20:52:00Z"), 15, 45); // 2026-07-01T20:00:00Z
 */
export function roundDown(date: Date, step: number, before = 0): Date {
  const time = new Date(date.getTime() - before * 6e4);
  time.setUTCMinutes(Math.floor(time.getUTCMinutes() / step) * step, 0, 0);
  return time;
}
