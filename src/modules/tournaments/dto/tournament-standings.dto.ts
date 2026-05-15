import { ApiProperty } from '@nestjs/swagger';

export class TournamentStandingsDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
    description: 'Group stage standings rows',
  })
  groups!: Record<string, unknown>[];

  @ApiProperty({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
    description: 'Knockout bracket rows',
  })
  knockout!: Record<string, unknown>[];

  @ApiProperty()
  note!: string;
}
