import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';
import { GameSummaryDto } from '../../games/dto/game-summary.dto';
import { TurfSummaryDto } from '../../turfs/dto/turf-summary.dto';
import { FeedItemDto, TournamentTeaserDto } from './home-feed.dto';

export class HomeDashboardDto {
  @ApiProperty({ description: 'First name or "Player" for guests' })
  greetingName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ enum: GameMode, description: 'Active filter for this payload' })
  gameMode!: GameMode;

  @ApiPropertyOptional({ description: 'Signed-in user primary OVR for active mode (if card exists)' })
  playerOvr?: number;

  @ApiProperty({ type: [GameSummaryDto] })
  nearbyGames!: GameSummaryDto[];

  @ApiProperty({ type: [GameSummaryDto] })
  needPlayersAlerts!: GameSummaryDto[];

  @ApiPropertyOptional({ type: GameSummaryDto, nullable: true })
  nextMatch?: GameSummaryDto | null;

  @ApiProperty({ type: [TournamentTeaserDto] })
  tournamentTeasers!: TournamentTeaserDto[];

  @ApiProperty({ type: [FeedItemDto] })
  feed!: FeedItemDto[];

  @ApiProperty({ type: [TurfSummaryDto] })
  nearbyTurfs!: TurfSummaryDto[];
}
