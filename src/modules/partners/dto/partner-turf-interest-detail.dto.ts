import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PartnerTurfInterestDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  turfName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  contactNumber!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ nullable: true })
  assignedToUserId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  notes!: string | null;

  @ApiProperty()
  source!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
