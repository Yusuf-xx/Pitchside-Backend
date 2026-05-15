import type { Prisma } from '@prisma/client';
import { PITCHSIDE_CITY_NAMES } from './pitchside-cities';

const LOWER_TO_CANONICAL = new Map(PITCHSIDE_CITY_NAMES.map((n) => [n.toLowerCase(), n] as const));

/**
 * Trims input and maps known Indian cities to the canonical spelling used in profiles.
 * Unknown names are returned trimmed as-is.
 */
export function canonicalizeCityName(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  return LOWER_TO_CANONICAL.get(t.toLowerCase()) ?? t;
}

/** Prisma string filter: case-insensitive equality (PostgreSQL). */
export function prismaCityEqualsInsensitive(city: string): Prisma.StringFilter {
  return { equals: city.trim(), mode: 'insensitive' };
}
