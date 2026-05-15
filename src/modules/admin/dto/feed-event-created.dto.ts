import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeedEventCreatedDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiPropertyOptional({ nullable: true })
  city!: string | null;

  @ApiPropertyOptional({ nullable: true })
  gameMode!: string | null;

  @ApiProperty()
  createdAt!: string;
}
