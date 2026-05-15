import { ApiProperty } from '@nestjs/swagger';

export class GameRecordParticipantDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;
}
