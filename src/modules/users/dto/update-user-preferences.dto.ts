import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';
import { PITCHSIDE_CITY_NAMES_FOR_ISIN } from '../../../common/pitchside-cities';

export class UpdateUserPreferencesDto {
  @ApiProperty({ enum: GameMode, isArray: true, example: [GameMode.FOOTBALL, GameMode.CRICKET] })
  @IsArray()
  @IsEnum(GameMode, { each: true })
  activeModes!: GameMode[];

  @ApiProperty({ example: 'Bengaluru', description: 'Must be one of the canonical PITCHSIDE city names.' })
  @IsString()
  @IsIn(PITCHSIDE_CITY_NAMES_FOR_ISIN)
  city!: string;

  @ApiPropertyOptional({ enum: GameMode, description: 'Primary filter for home feed' })
  @IsOptional()
  @IsEnum(GameMode)
  primaryMode?: GameMode;
}
