import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminAppealItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  moderatorNote?: string;

  @ApiPropertyOptional()
  reviewedAt?: string;

  @ApiPropertyOptional()
  reviewedByUserId?: string;

  @ApiPropertyOptional()
  reviewedByLabel?: string;

  @ApiProperty()
  createdAt!: string;
}
