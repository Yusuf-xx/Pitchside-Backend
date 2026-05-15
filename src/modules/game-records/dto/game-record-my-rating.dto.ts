import { ApiProperty } from '@nestjs/swagger';

export class GameRecordMyRatingDto {
  @ApiProperty()
  subjectUserId!: string;

  @ApiProperty()
  skill!: number;

  @ApiProperty()
  effort!: number;

  @ApiProperty()
  attitude!: number;

  @ApiProperty()
  communication!: number;

  @ApiProperty()
  noShow!: boolean;
}
