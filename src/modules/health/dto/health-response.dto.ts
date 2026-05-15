import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'pitchside-api' })
  service!: string;

  @ApiProperty({ example: '1.0.0' })
  version!: string;
}
