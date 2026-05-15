import { ApiProperty } from '@nestjs/swagger';

export class WaitlistSignupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'ISO timestamp when the signup was stored' })
  createdAt!: string;
}
