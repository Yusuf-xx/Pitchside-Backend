import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum WaitlistProgram {
  SCOUT_MODE = 'SCOUT_MODE',
}

export class WaitlistSignupDto {
  @ApiProperty({ enum: WaitlistProgram })
  @IsEnum(WaitlistProgram)
  program!: WaitlistProgram;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Delhi' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;
}
