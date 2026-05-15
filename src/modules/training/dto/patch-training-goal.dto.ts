import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class PatchTrainingGoalDto {
  @ApiProperty({ description: 'Weekly training target in minutes', minimum: 30, maximum: 1440, example: 300 })
  @IsInt()
  @Min(30)
  @Max(1440)
  weeklyGoalMinutes!: number;
}
