import { ApiProperty } from '@nestjs/swagger';

export class TrainingStatusDto {
  @ApiProperty()
  weeklyMinutes!: number;

  @ApiProperty()
  weeklyGoalMinutes!: number;

  @ApiProperty()
  streakDays!: number;

  @ApiProperty()
  clockedIn!: boolean;
}
