import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class PlayerCardStatDto {
  @ApiProperty({ example: 'PAC' })
  key!: string;

  @ApiProperty({ example: 82 })
  value!: number;
}

export class PlayerCardDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ enum: GameMode })
  mode!: GameMode;

  @ApiProperty({ example: 78 })
  ovr!: number;

  @ApiProperty()
  position!: string;

  @ApiProperty({ example: 'ADVANCED' })
  skillLevel!: string;

  @ApiPropertyOptional({ example: 'LEFT' })
  preferredFoot?: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ type: [PlayerCardStatDto] })
  stats!: PlayerCardStatDto[];

  @ApiProperty()
  reputationTier!: string;

  @ApiProperty()
  rarity!: string;

  @ApiProperty({ type: [String], description: 'Achievement / badge keys' })
  badges!: string[];

  @ApiPropertyOptional({ description: 'Games attended ÷ games confirmed × 100' })
  reliabilityPct?: number;
}
