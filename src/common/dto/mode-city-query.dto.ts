import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { GameMode } from '../enums/game-mode.enum';

export class ModeCityQueryDto {
  @ApiPropertyOptional({ enum: GameMode, description: 'Active game mode filter' })
  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'When true, only list women-only games' })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  womenOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Football venue sub-format filter (CAGE, ROOFTOP, BEACH, STREET_GULLY, BOX)',
  })
  @IsOptional()
  @IsString()
  footballVenueSubFormat?: string;
}
