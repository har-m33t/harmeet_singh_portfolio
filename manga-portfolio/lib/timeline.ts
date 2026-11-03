const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export type Span = {
  start: Date;
  end: Date;
  ongoing: boolean;
};

function parseMonth(token: string, now: Date): Date | null {
  const t = token.trim().toLowerCase();
  if (t === "present") return now;

  const m = /^([a-z]{3})[a-z]*\s+(\d{4})$/.exec(t);
  if (!m) return null;

  const month = MONTHS.indexOf(m[1]);
  if (month === -1) return null;

  return new Date(Date.UTC(Number(m[2]), month, 1));
}

/**
 * Turns a display period ("Feb 2026 — Jun 2026", "Sep 2026 — Present") into a
 * span the timeline can draw. The period strings are the single source of
 * truth for dates, so the chart can never drift from the text beside it.
 *
 * An end month is inclusive — a role ending "Jun 2026" ran through June, so
 * the span closes at the start of July.
 */
export function parsePeriod(period: string, now = new Date()): Span | null {
  const [rawStart, rawEnd] = period.split(/[—–-]/).map((s) => s.trim());
  if (!rawStart) return null;

  const start = parseMonth(rawStart, now);
  if (!start) return null;

  const ongoing = !rawEnd || rawEnd.toLowerCase() === "present";
  if (ongoing) return { start, end: now, ongoing: true };

  const parsed = parseMonth(rawEnd, now);
  if (!parsed) return null;

  const end = new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, 1)
  );
  return { start, end, ongoing: false };
}

/** Inclusive list of years spanned, for the axis ticks. */
export function yearsBetween(from: Date, to: Date): number[] {
  const years: number[] = [];
  for (let y = from.getUTCFullYear(); y <= to.getUTCFullYear(); y++) {
    years.push(y);
  }
  return years;
}
