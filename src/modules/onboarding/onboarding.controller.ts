import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OnboardingFormatsDto } from './dto/onboarding-formats.dto';
import { OnboardingGameIdentityDto } from './dto/onboarding-game-identity.dto';
import { OnboardingPersonalDto } from './dto/onboarding-personal.dto';
import { OnboardingStatusDto } from './dto/onboarding-status.dto';
import { OnboardingService } from './onboarding.service';

@ApiTags('Onboarding')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  @ApiOperation({ summary: 'Resume onboarding — current step and flags' })
  @ApiOkResponse({ type: OnboardingStatusDto })
  getStatus(@CurrentUser() user: { userId: string }): Promise<OnboardingStatusDto> {
    return this.onboardingService.getStatus(user.userId);
  }

  @Post('steps/personal')
  @ApiOperation({ summary: 'Step 1 — personal info, city, DOB, age group, active modes' })
  @ApiCreatedResponse({ type: OnboardingStatusDto })
  savePersonal(
    @CurrentUser() user: { userId: string },
    @Body() dto: OnboardingPersonalDto,
  ): Promise<OnboardingStatusDto> {
    return this.onboardingService.savePersonal(user.userId, dto);
  }

  @Post('steps/game-identity')
  @ApiOperation({ summary: 'Step 2 — per-mode position, foot (football/futsal), skill' })
  @ApiCreatedResponse({ type: OnboardingStatusDto })
  saveGameIdentity(
    @CurrentUser() user: { userId: string },
    @Body() dto: OnboardingGameIdentityDto,
  ): Promise<OnboardingStatusDto> {
    return this.onboardingService.saveGameIdentity(user.userId, dto);
  }

  @Post('steps/formats')
  @ApiOperation({ summary: 'Step 3 — preferred formats (multi-select)' })
  @ApiCreatedResponse({ type: OnboardingStatusDto })
  saveFormats(
    @CurrentUser() user: { userId: string },
    @Body() dto: OnboardingFormatsDto,
  ): Promise<OnboardingStatusDto> {
    return this.onboardingService.saveFormats(user.userId, dto);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Step 4 — generate player cards and finish onboarding' })
  @ApiCreatedResponse({ type: OnboardingStatusDto })
  complete(@CurrentUser() user: { userId: string }): Promise<OnboardingStatusDto> {
    return this.onboardingService.complete(user.userId);
  }
}
