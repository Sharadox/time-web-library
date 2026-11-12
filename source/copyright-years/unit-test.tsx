// @vitest-environment happy-dom
import { cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vitest";
import { CopyrightYears } from "@sharadox/time-web-library/copyright-years";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test("shows the range up to the current year, or the one year while it lasts", () => {
  vi.useFakeTimers({ now: new Date("2027-03-01T12:00:00Z") });
  expect(render(<CopyrightYears since={1996} />).container.textContent).toBe("1996–2027");
  cleanup();
  expect(render(<CopyrightYears since={2027} />).container.textContent).toBe("2027");
});

test("a page built in an earlier year shows the current one once it runs", () => {
  vi.useFakeTimers({ now: new Date("2026-06-01T12:00:00Z") });
  const built = renderToString(<CopyrightYears since={2026} />);
  expect(built).toContain(">2026<");
  vi.setSystemTime(new Date("2028-01-02T12:00:00Z"));
  const { container } = render(<CopyrightYears since={2026} />);
  expect(container.textContent).toBe("2026–2028");
});
