import { ApiProperty } from '@nestjs/swagger';

export class PartnerInterestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'ISO timestamp when the submission was stored' })
  createdAt!: string;
}
