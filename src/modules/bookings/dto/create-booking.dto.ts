import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  turfId!: string;

  @ApiProperty({ example: '2026-05-14' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date!: string;

  @ApiProperty({ example: ['18:00', '19:00'], description: 'IST slot starts' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    each: true,
    message: 'slotStarts must be HH:mm (24-hour) values',
  })
  slotStarts!: string[];

  @ApiProperty({ enum: GameMode })
  @IsEnum(GameMode)
  gameMode!: GameMode;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(2)
  @Max(50)
  expectedPlayers!: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  splitPayment?: boolean;
}
