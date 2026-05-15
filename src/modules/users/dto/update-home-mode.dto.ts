import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class UpdateHomeModeDto {
  @ApiProperty({ enum: GameMode, description: 'Must be one of the user’s active modes' })
  @IsEnum(GameMode)
  mode!: GameMode;
}
