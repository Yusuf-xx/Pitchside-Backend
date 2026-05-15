import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class MatchHistoryStatLineDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  goals?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  assists?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  wickets?: number;
}

export class MatchHistoryQueryDto {
  @ApiPropertyOptional({ enum: GameMode })
  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;

  @ApiPropertyOptional({ example: '2026-05', description: 'YYYY-MM filter' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/)
  month?: string;
}

export class MatchHistoryRowDto {
  @ApiProperty()
  gameId!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiProperty()
  venueName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  startsAt!: string;

  @ApiPropertyOptional()
  formatLabel?: string;

  @ApiProperty({ description: 'WIN | LOSS | DRAW | N_A' })
  result!: string;

  @ApiProperty({ description: 'ATTENDED | NO_SHOW | CANCELLED | PENDING' })
  attendanceStatus!: string;

  @ApiPropertyOptional({ type: [String], description: 'Positive tags received this match' })
  tagsReceived?: string[];

  @ApiPropertyOptional({ type: MatchHistoryStatLineDto, description: 'Host-entered stats at game completion' })
  statLine?: MatchHistoryStatLineDto;
}

export class MatchHistorySummaryDto {
  @ApiProperty()
  gamesPlayed!: number;

  @ApiProperty({ description: '0–100' })
  attendanceRatePct!: number;

  @ApiProperty()
  wins!: number;

  @ApiProperty()
  losses!: number;

  @ApiProperty()
  draws!: number;
}

export class MatchHistoryResponseDto {
  @ApiProperty({ type: MatchHistorySummaryDto })
  summary!: MatchHistorySummaryDto;

  @ApiProperty({ type: [MatchHistoryRowDto] })
  rows!: MatchHistoryRowDto[];
}
