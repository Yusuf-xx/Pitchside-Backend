import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class BookingDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  turfId!: string;

  @ApiProperty()
  turfName!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiProperty()
  date!: string;

  @ApiProperty({ type: [String] })
  slots!: string[];

  @ApiProperty()
  totalInr!: number;

  @ApiProperty()
  splitPayment!: boolean;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ description: 'ISO timestamp when the booking was created' })
  createdAt?: string;
}
