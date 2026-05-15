import type { Tournament } from '@prisma/client';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';
export declare function mapTournamentToSummary(row: Tournament): TournamentSummaryDto;
