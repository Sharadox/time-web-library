/**
 * Minutes since midnight in a time zone for an instant, whatever the visitor's own time zone.
 *
 * @example
 * minutesInZone(new Date("2026-07-01T16:30:00Z"), "Europe/Lisbon"); // 1050 (17:30)
 */
export function minutesInZone(date: Date, timeZone: string): number {
  const [hours, minutes] = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .split(":")
    .map(Number);
  return hours! * 60 + minutes!;
}
