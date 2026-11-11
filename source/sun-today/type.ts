/** Sun times for the relevant evening, plus the moment they were computed for. */
export interface SunToday {
  rise: Date;
  set: Date;
  now: Date;
  /** After today's sunset these are tomorrow's times. */
  tomorrow: boolean;
}
