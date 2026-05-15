import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'] as const;

export class ModeIdentityItemDto {
  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  mode!: GameMode;

  @ApiProperty({ description: 'Mode-specific position code' })
  @IsString()
  position!: string;

  @ApiPropertyOptional({ description: 'Required for FOOTBALL and FUTSAL' })
  @ValidateIf((o) => o.mode === GameMode.FOOTBALL || o.mode === GameMode.FUTSAL)
  @IsString()
  preferredFoot?: string;

  @ApiProperty({ example: 'INTERMEDIATE' })
  @IsIn(SKILL_LEVELS as unknown as string[])
  skillLevel!: string;
}

export class OnboardingGameIdentityDto {
  @ApiProperty({ type: [ModeIdentityItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ModeIdentityItemDto)
  identities!: ModeIdentityItemDto[];
}
