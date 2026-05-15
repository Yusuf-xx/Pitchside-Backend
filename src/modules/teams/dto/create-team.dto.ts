import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name!: string;

  @ApiPropertyOptional({ example: '#1A56DB' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'kitColorHex must be a 6-digit hex like #1A56DB' })
  kitColorHex?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  city!: string;

  @ApiPropertyOptional({ enum: GameMode, description: 'Squad primary mode for OVR rollups' })
  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;
}
