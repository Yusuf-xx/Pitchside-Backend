import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GpsDto } from './dto/gps.dto';
import { PatchTrainingGoalDto } from './dto/patch-training-goal.dto';
import { TrainingStatusDto } from './dto/training-status.dto';
import { TrainingService } from './training.service';

@ApiTags('Training')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Weekly progress & streak',
    description:
      'Weekly minutes sum completed sessions whose end time falls in the current India week (Monday 00:00 Asia/Kolkata through the following Monday). Streak uses consecutive IST calendar days with at least 10 logged minutes; today (IST) can be empty without breaking the streak yet.',
  })
  @ApiOkResponse({ type: TrainingStatusDto })
  status(@CurrentUser() user: { userId: string }): Promise<TrainingStatusDto> {
    return this.trainingService.getStatus(user.userId);
  }

  @Post('clock-in')
  @ApiOperation({ summary: 'Start a training session (optional GPS for future validation)' })
  @ApiOkResponse({ type: TrainingStatusDto })
  @ApiConflictResponse({ description: 'Already clocked in' })
  clockIn(
    @CurrentUser() user: { userId: string },
    @Body() body: GpsDto,
  ): Promise<TrainingStatusDto> {
    return this.trainingService.clockIn(user.userId, body);
  }

  @Post('clock-out')
  @ApiOperation({ summary: 'End the open session and credit minutes (capped per session)' })
  @ApiOkResponse({ type: TrainingStatusDto })
  @ApiBadRequestResponse({ description: 'Not clocked in' })
  clockOut(@CurrentUser() user: { userId: string }): Promise<TrainingStatusDto> {
    return this.trainingService.clockOut(user.userId);
  }

  @Patch('me/goal')
  @ApiOperation({ summary: 'Update weekly minute goal' })
  @ApiOkResponse({ type: TrainingStatusDto })
  patchGoal(
    @CurrentUser() user: { userId: string },
    @Body() dto: PatchTrainingGoalDto,
  ): Promise<TrainingStatusDto> {
    return this.trainingService.updateWeeklyGoal(user.userId, dto.weeklyGoalMinutes);
  }
}
