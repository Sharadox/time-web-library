import type { OpenState, TimeOfDay } from "@sharadox/time-web-library/open-state/type";
import { minutesInZone } from "@sharadox/time-web-library/zone-minute";

/** Whether a place with daily hours `from`–`to` is open at `now`, in the place's time zone. */
export function openState(now: Date, from: TimeOfDay, to: TimeOfDay, timeZone: string): OpenState {
  const minutes = minutesInZone(now, timeZone);
  if (minutes < from[0] * 60 + from[1]) return "before";
  if (minutes >= to[0] * 60 + to[1]) return "after";
  return "open";
}
