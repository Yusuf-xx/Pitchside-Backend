import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WaitlistSignupDto } from './dto/waitlist-signup.dto';
import { WaitlistSignupResponseDto } from './dto/waitlist-signup-response.dto';
import { WaitlistService } from './waitlist.service';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @ApiOperation({ summary: 'Scout mode / early access email capture (public)' })
  @ApiCreatedResponse({ type: WaitlistSignupResponseDto })
  @ApiConflictResponse({ description: 'Same program + email already registered' })
  @ApiTooManyRequestsResponse({ description: 'Too many submissions. Try again later.' })
  signup(@Body() dto: WaitlistSignupDto): Promise<WaitlistSignupResponseDto> {
    return this.waitlistService.signup(dto);
  }
}
