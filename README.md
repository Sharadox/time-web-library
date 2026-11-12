# @sharadox/time-web-library

Time for local businesses' websites, always in the place's own time zone, whatever the visitor's:

- **`minutesInZone(date, zone)`:** minutes since midnight there.
- **`formatTime(date, zone)`:** "17:28" on a 24-hour clock.
- **`openState(now, from, to, zone)`:** "before", "open" or "after" today's hours.
- **`roundDown(date, step, before?)`:** suggested times, for example 45 minutes before sunset on the quarter hour.
- **`sunTimes(date, latitude, longitude)`:** sunrise and sunset (NOAA approximation, ±1–2 minutes).
- **`useSunToday(latitude, longitude)`:** today's sun, or tomorrow's once it has set, refreshed every minute.
- **`openingStatus(now, hours)`:** whether a place is open, from its weekly hours (with breaks) and closures (holidays), and when that next changes. `nextClosure` and `reopening` announce a closure ahead.
- **`<CopyrightYears since={1996} />`:** "1996–2026", or just "2026" in the first year; the current year moves on by itself.

## Install

```sh
pnpm add @sharadox/time-web-library
```

## API

| Import              | Export                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `…/zone-minute`     | `minutesInZone(date, timeZone)`                                                                                                                                                                                           |
| `…/format-time`     | `formatTime(date, timeZone)`                                                                                                                                                                                              |
| `…/open-state`      | `openState(now, from, to, timeZone)`; `OpenState` and `TimeOfDay` in `…/open-state/type`                                                                                                                                  |
| `…/round-down`      | `roundDown(date, step, before = 0)`                                                                                                                                                                                       |
| `…/sun-time`        | `sunTimes(date, latitude, longitude)` → `{ rise, set }`                                                                                                                                                                   |
| `…/sun-today`       | `useSunToday(latitude, longitude)` → `{ rise, set, now, tomorrow }` or `null` before mounting                                                                                                                             |
| `…/opening-status`  | `openingStatus(now, hours)` → `{ open, closure?, change: { day, time, inDays, date } }`; `nextClosure(now, hours)`; `reopening(closure, hours)`; `OpeningHours`, `OpeningStatus` and `Closure` in `…/opening-status/type` |
| `…/copyright-years` | `<CopyrightYears since={year} />`                                                                                                                                                                                         |

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
