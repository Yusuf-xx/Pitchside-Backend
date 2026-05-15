import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'player@pitchside.app' })
  @IsEmail()
  email!: string;
}
