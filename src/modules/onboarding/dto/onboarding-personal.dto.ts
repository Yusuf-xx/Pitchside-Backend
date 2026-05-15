import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';
import { PITCHSIDE_CITY_NAMES_FOR_ISIN } from '../../../common/pitchside-cities';

const AGE_GROUPS = ['UNDER_15', 'UNDER_18', 'UNDER_23', 'OPEN', 'VETERANS'] as const;

export class OnboardingPersonalDto {
  @ApiProperty()
  @IsString()
  displayName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ example: 'Mumbai', description: 'Must be one of the canonical PITCHSIDE city names.' })
  @IsString()
  @IsIn(PITCHSIDE_CITY_NAMES_FOR_ISIN)
  city!: string;

  @ApiProperty({ example: '2005-03-12' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: 'UNDER_18', enum: AGE_GROUPS })
  @IsIn(AGE_GROUPS as unknown as string[])
  ageGroup!: string;

  @ApiProperty({ enum: GameMode, isArray: true, minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(GameMode, { each: true })
  activeModes!: GameMode[];

  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  primaryMode!: GameMode;

  @ApiPropertyOptional({
    description: 'Optional — used for women-only / mixed games. Stored privately.',
    enum: ['MAN', 'WOMAN', 'NON_BINARY', 'UNSPECIFIED'],
  })
  @IsOptional()
  @IsIn(['MAN', 'WOMAN', 'NON_BINARY', 'UNSPECIFIED'])
  gender?: 'MAN' | 'WOMAN' | 'NON_BINARY' | 'UNSPECIFIED';
}
