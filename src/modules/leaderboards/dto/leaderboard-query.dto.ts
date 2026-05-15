import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class CityLeaderboardQueryDto {
  @ApiProperty({ example: 'Bengaluru' })
  @IsString()
  city!: string;

  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  mode!: GameMode;
}

export class NationalLeaderboardQueryDto {
  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  mode!: GameMode;
}
