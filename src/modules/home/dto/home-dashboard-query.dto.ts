import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class HomeDashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Required for guests. Signed-in users fall back to profile city when omitted (must not be TBD).',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    enum: GameMode,
    description: 'Override feed filter for this request only (does not persist). Uses profile primaryMode when omitted.',
  })
  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;
}
