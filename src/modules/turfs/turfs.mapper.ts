import type { Prisma } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { TurfSummaryDto } from './dto/turf-summary.dto';

function isGameMode(v: unknown): v is GameMode {
  return v === GameMode.FOOTBALL || v === GameMode.FUTSAL || v === GameMode.CRICKET;
}

export function parseModesJson(modes: Prisma.JsonValue): GameMode[] {
  if (!Array.isArray(modes)) return [];
  return modes.filter(isGameMode);
}

const SUB_KEYS = ['CAGE', 'ROOFTOP', 'BEACH', 'STREET_GULLY', 'BOX'] as const;

function parseSubFormats(json: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(json)) return [];
  return json.filter((x): x is string => typeof x === 'string' && (SUB_KEYS as readonly string[]).includes(x));
}

export function mapTurfRow(row: {
  id: string;
  name: string;
  area: string;
  city: string;
  modes: Prisma.JsonValue;
  footballVenueSubFormats?: Prisma.JsonValue | null;
  rating: number;
  reviewCount: number;
  priceInrPerHour: number;
  partner: boolean;
  availabilityNote: string;
}): TurfSummaryDto {
  const sub = parseSubFormats(row.footballVenueSubFormats ?? null);
  return {
    id: row.id,
    name: row.name,
    modes: parseModesJson(row.modes),
    footballVenueSubFormats: sub.length ? sub : undefined,
    area: row.area,
    city: row.city,
    rating: row.rating,
    reviewCount: row.reviewCount,
    priceInrPerHour: row.priceInrPerHour,
    partner: row.partner,
    availabilityNote: row.availabilityNote,
  };
}
