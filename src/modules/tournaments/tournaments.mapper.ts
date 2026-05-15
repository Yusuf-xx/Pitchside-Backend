import type { Tournament } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';

export function mapTournamentToSummary(row: Tournament): TournamentSummaryDto {
  return {
    id: row.id,
    name: row.name,
    gameMode: row.gameMode as GameMode,
    format: row.format,
    city: row.city,
    startsAt: row.startsAt.toISOString(),
    entryFeeInr: row.entryFeeInr,
    prizeInr: row.prizeInr,
    teamsRegistered: row.teamsRegistered,
    teamsCap: row.teamsCap,
    bannerImageUrl: row.bannerImageUrl ?? undefined,
    genderFormat: row.genderFormat,
  };
}
