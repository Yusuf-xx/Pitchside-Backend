import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class TurfSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: GameMode, isArray: true })
  modes!: GameMode[];

  @ApiPropertyOptional({ description: 'Football venue sub-format tags when applicable' })
  footballVenueSubFormats?: string[];

  @ApiProperty()
  area!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  rating!: number;

  @ApiProperty()
  reviewCount!: number;

  @ApiProperty({ description: 'INR per hour' })
  priceInrPerHour!: number;

  @ApiProperty()
  partner!: boolean;

  @ApiProperty()
  availabilityNote!: string;
}
