import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class OnboardingFormatsDto {
  @ApiProperty({
    description: 'Preferred formats (e.g. 5v5 Futsal, 7v7 Football, Box Cricket 6v6)',
    example: ['5v5 Futsal', '7v7 Football'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  formats!: string[];
}
