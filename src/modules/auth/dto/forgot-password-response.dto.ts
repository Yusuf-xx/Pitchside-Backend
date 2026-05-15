import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example:
      'If this email exists, a password reset link has been sent.',
  })
  message!: string;
}
