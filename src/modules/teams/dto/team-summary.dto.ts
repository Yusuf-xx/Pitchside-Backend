import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class TeamSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiPropertyOptional({ description: 'Primary kit accent hex' })
  kitColorHex?: string;

  @ApiProperty({ description: 'Number of players in the squad roster' })
  memberCount!: number;

  @ApiProperty()
  captainUserId!: string;

  @ApiProperty()
  wins!: number;

  @ApiProperty()
  losses!: number;

  @ApiProperty()
  draws!: number;

  @ApiProperty({ description: 'Average squad OVR for the team game mode (defaults when no cards)' })
  teamOvr!: number;
}
