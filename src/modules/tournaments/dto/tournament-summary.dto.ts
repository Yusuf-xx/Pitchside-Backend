import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class TournamentSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiProperty()
  format!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ description: 'ISO 8601 start time' })
  startsAt!: string;

  @ApiProperty()
  entryFeeInr!: number;

  @ApiProperty()
  prizeInr!: number;

  @ApiProperty()
  teamsRegistered!: number;

  @ApiProperty()
  teamsCap!: number;

  @ApiPropertyOptional()
  bannerImageUrl?: string;

  @ApiProperty({ description: 'OPEN | WOMEN_ONLY | MIXED' })
  genderFormat!: string;
}
