import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSquadDto {
  @ApiProperty({ example: 'Koramangala Ballers' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ example: 'Bengaluru' })
  @IsString()
  @MaxLength(80)
  city!: string;
}
