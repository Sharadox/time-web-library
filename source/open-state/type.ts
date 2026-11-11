/** Before opening, open, or after closing — today, in the place's time zone. */
export type OpenState = "open" | "before" | "after";

/** A time of day as [hours, minutes]. */
export type TimeOfDay = readonly [number, number];
