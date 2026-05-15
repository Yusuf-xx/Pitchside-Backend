import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class TournamentTeaserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  startsAt!: string;

  @ApiProperty()
  entryFeeInr!: number;

  @ApiProperty()
  prizeInr!: number;

  @ApiProperty()
  teamsRegistered!: number;

  @ApiProperty()
  teamsCap!: number;

  @ApiProperty()
  format!: string;
}

export class FeedItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiPropertyOptional()
  gameMode?: string;

  @ApiProperty()
  createdAt!: string;
}
