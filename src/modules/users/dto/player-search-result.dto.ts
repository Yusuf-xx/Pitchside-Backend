import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class PlayerSearchResultDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ enum: GameMode })
  primaryMode!: GameMode;

  @ApiPropertyOptional()
  photoUrl?: string;
}
