import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class CompleteGameParticipantStatDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiPropertyOptional({ description: 'Football / futsal' })
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

  @ApiPropertyOptional({ description: 'Cricket' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  wickets?: number;
}

export class CompleteGameDto {
  @ApiProperty({ enum: ['A', 'B', 'DRAW'] })
  @IsIn(['A', 'B', 'DRAW'])
  winnerSide!: 'A' | 'B' | 'DRAW';

  @ApiPropertyOptional({
    type: [CompleteGameParticipantStatDto],
    description: 'Optional per-player stat lines stored on match history',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompleteGameParticipantStatDto)
  participantStats?: CompleteGameParticipantStatDto[];
}
