import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class InviteSquadDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  squadId!: string;
}
