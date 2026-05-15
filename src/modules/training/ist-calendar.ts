/**
 * Training week + streak use India Standard Time (Asia/Kolkata, UTC+05:30, no DST).
 */

export const TRAINING_TIME_ZONE = 'Asia/Kolkata';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export const DAY_MS = 24 * 60 * 60 * 1000;

export function getIstYmdParts(d: Date): { year: number; month: number; day: number } {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: TRAINING_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = f.formatToParts(d);
  const num = (type: 'year' | 'month' | 'day') =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: num('year'), month: num('month'), day: num('day') };
}

/** YYYY-MM-DD in Asia/Kolkata for this instant. */
export function istDateKey(d: Date): string {
  const { year, month, day } = getIstYmdParts(d);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * The UTC instant when clocks in Kolkata show 00:00:00 on the given calendar date
 * (year, month 1–12, day).
 */
export function istWallMidnight(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day) - IST_OFFSET_MS);
}

function istWeekdayShort(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TRAINING_TIME_ZONE,
    weekday: 'short',
  }).format(d);
}

/** Monday 00:00 IST of the week containing `now`. */
export function startOfIstIsoWeek(now: Date): Date {
  const { year, month, day } = getIstYmdParts(now);
  let t = istWallMidnight(year, month, day);
  for (let n = 0; n < 8; n++) {
    if (istWeekdayShort(t) === 'Mon') return t;
    t = new Date(t.getTime() - DAY_MS);
  }
  return istWallMidnight(year, month, day);
}

export function addIstDaysFromMidnight(istMidnight: Date, deltaDays: number): Date {
  return new Date(istMidnight.getTime() + deltaDays * DAY_MS);
}
