import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

const GENDER_FORMATS = ['OPEN', 'WOMEN_ONLY', 'MIXED'] as const;
const FOOTBALL_VENUE_SUB = ['CAGE', 'ROOFTOP', 'BEACH', 'STREET_GULLY', 'BOX'] as const;

export class CreateGameDto {
  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  gameMode!: GameMode;

  @ApiProperty({ example: '5v5 Futsal — GoalZone Bandra' })
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  venueName!: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  @MaxLength(80)
  city!: string;

  @ApiProperty({ example: '2026-05-12T20:00:00+05:30' })
  @IsDateString()
  startsAt!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(2)
  @Max(50)
  maxPlayers!: number;

  @ApiPropertyOptional({
    description: 'Minimum joined players required to confirm the game (defaults to maxPlayers)',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(50)
  minPlayersToConfirm?: number;

  @ApiPropertyOptional({
    description: 'If set, OPEN games with fewer than minPlayersToConfirm at this time auto-cancel',
  })
  @IsOptional()
  @IsDateString()
  confirmDeadlineAt?: string;

  @ApiPropertyOptional({ enum: GENDER_FORMATS as unknown as string[], default: 'OPEN' })
  @IsOptional()
  @IsIn([...GENDER_FORMATS])
  genderFormat?: (typeof GENDER_FORMATS)[number];

  @ApiPropertyOptional({ description: 'For MIXED format — minimum women on field (enforced in future balancing)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  mixedMinWomenOnField?: number;

  @ApiPropertyOptional({ enum: FOOTBALL_VENUE_SUB as unknown as string[] })
  @IsOptional()
  @IsIn([...FOOTBALL_VENUE_SUB])
  footballVenueSubFormat?: (typeof FOOTBALL_VENUE_SUB)[number];

  @ApiProperty({ example: 'INTERMEDIATE' })
  @IsString()
  @MaxLength(40)
  skillLevel!: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: 150 })
  @IsInt()
  @Min(0)
  priceInrPerPlayer!: number;
}
