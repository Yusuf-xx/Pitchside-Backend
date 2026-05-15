/**
 * Normalizes user input toward E.164: strips spaces/dashes, ensures leading +.
 * Returns null if it does not look like a dialable international number.
 */
export function normalizePhoneE164Input(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const digits = t.replace(/[^\d+]/g, '');
  if (!digits) return null;
  let s = digits.startsWith('+') ? digits : `+${digits.replace(/^\+/, '')}`;
  if (s.length < 9 || s.length > 17) return null;
  if (!/^\+[1-9]\d{6,14}$/.test(s)) return null;
  return s;
}
