const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse `YYYY-MM-DD` as local calendar date (matches `<input type="date">`). */
export function parseLocalYmd(ymd: string): Date | null {
  const m = YMD.exec(ymd.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function fullYearsBetween(dob: Date, ref: Date): number {
  let age = ref.getFullYear() - dob.getFullYear();
  const dm = ref.getMonth() - dob.getMonth();
  if (dm < 0 || (dm === 0 && ref.getDate() < dob.getDate())) age -= 1;
  return age;
}

/** Latest calendar DOB so `fullYearsBetween(dob, ref) >= minAge` (inclusive). */
export function latestDobForMinAge(minAge: number, ref: Date): Date {
  let d = new Date(ref.getFullYear() - minAge, ref.getMonth(), ref.getDate());
  while (fullYearsBetween(d, ref) < minAge) {
    d.setDate(d.getDate() - 1);
  }
  return startOfLocalDay(d);
}

export type ProfileDobErrorCode =
  | 'INVALID_DATE'
  | 'DOB_NOT_BEFORE_TODAY'
  | 'TOO_YOUNG'
  | 'TOO_OLD';

const MIN_AGE = 13;
const MAX_AGE = 120;

/**
 * Validates profile date of birth from `YYYY-MM-DD` (local calendar).
 * Returns `null` if valid, otherwise an error code.
 */
export function validateProfileDobYmd(dobIso: string, now: Date = new Date()): ProfileDobErrorCode | null {
  const dob = parseLocalYmd(dobIso);
  if (!dob) return 'INVALID_DATE';

  const today = startOfLocalDay(now);
  if (dob.getTime() >= today.getTime()) return 'DOB_NOT_BEFORE_TODAY';

  const age = fullYearsBetween(dob, now);
  if (age < MIN_AGE) return 'TOO_YOUNG';
  if (age > MAX_AGE) return 'TOO_OLD';
  return null;
}

export function profileDobErrorMessage(code: ProfileDobErrorCode): string {
  switch (code) {
    case 'INVALID_DATE':
      return 'Enter a valid date of birth.';
    case 'DOB_NOT_BEFORE_TODAY':
      return 'Date of birth must be before today.';
    case 'TOO_YOUNG':
      return `You must be at least ${MIN_AGE} years old.`;
    case 'TOO_OLD':
      return 'Please enter a realistic date of birth.';
    default:
      return 'Invalid date of birth.';
  }
}

export function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** `min` / `max` for `<input type="date">` (local), enforcing min age and max age. */
export function profileDobInputBounds(now: Date = new Date()): { min: string; max: string } {
  const today = startOfLocalDay(now);
  const oldest = new Date(today);
  oldest.setFullYear(oldest.getFullYear() - MAX_AGE);
  const latest = latestDobForMinAge(MIN_AGE, now);
  return { min: formatLocalYmd(oldest), max: formatLocalYmd(latest) };
}
