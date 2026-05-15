/** Positive teammate tags (shown publicly as top badges). */
export const POSITIVE_FEEDBACK_TAG_KEYS = [
  'GREAT_ENERGY',
  'CLINICAL_FINISHER',
  'SOLID_DEFENDER',
  'SAFE_HANDS_GK',
  'ALWAYS_RUNNING',
  'TEAM_PLAYER',
  'ALWAYS_ON_TIME',
] as const;

/** Negative tags — anonymous aggregate + private to subject; affect OVR internally. */
export const NEGATIVE_FEEDBACK_TAG_KEYS = [
  'BALL_HOG',
  'LATE_ARRIVAL',
  'UNSPORTING_ATTITUDE',
  'LOW_EFFORT',
] as const;

export function isAllowedFeedbackTagKey(key: string, isPositive: boolean): boolean {
  const k = key.trim().toUpperCase();
  if (isPositive) {
    return (POSITIVE_FEEDBACK_TAG_KEYS as readonly string[]).includes(k);
  }
  return (NEGATIVE_FEEDBACK_TAG_KEYS as readonly string[]).includes(k);
}
