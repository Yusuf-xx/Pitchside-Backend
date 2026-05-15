import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardRowDto {
  @ApiProperty()
  rank!: number;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  ovr!: number;
}
